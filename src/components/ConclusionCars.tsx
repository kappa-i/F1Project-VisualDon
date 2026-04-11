import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';

import car1Url  from '../assets/1111.webp';
import car2Url  from '../assets/2222.webp';
import car3Url  from '../assets/3333.webp';
import trackUrl from '../assets/track-asset2.webp';

// ── World width matches track image natural width ──────────────────────────
// Paths are defined in viewport-space coordinates:
//   X : 0 → WORLD_W  (maps to 0 → 100vw)
//   Y : ≈ -100 → ≈ 1100  (maps to above-viewport → near bottom of viewport)
// The exact Y extent depends on window.innerHeight / scale, calibrate with ?dev2.
const WORLD_W = 1920;

// Dev2 editor viewBox: Y range [-300, 1500] so start/end points are both visible
// Width always = WORLD_W (1920), same scale as production (100vw).
const DEV2_VIEW_Y = -300;
const DEV2_VIEW_H = 1800; // -300 → 1500

type Pt     = { x: number; y: number };
type Seg    = { cp1: Pt; cp2: Pt; end: Pt };
type TabKey = 'car1' | 'car2' | 'car3';

// Open path — no Z
function buildPath(start: Pt, segs: Seg[]): string {
  let d = `M ${start.x} ${start.y}`;
  segs.forEach(s => { d += ` C ${s.cp1.x} ${s.cp1.y} ${s.cp2.x} ${s.cp2.y} ${s.end.x} ${s.end.y}`; });
  return d;
}

function midPt(a: Pt, b: Pt): Pt {
  return { x: Math.round((a.x + b.x) / 2), y: Math.round((a.y + b.y) / 2) };
}
function splitSeg(p0: Pt, seg: Seg): [Seg, Seg] {
  const q01   = midPt(p0,      seg.cp1);
  const q12   = midPt(seg.cp1, seg.cp2);
  const q23   = midPt(seg.cp2, seg.end);
  const q012  = midPt(q01,  q12);
  const q123  = midPt(q12,  q23);
  const q0123 = midPt(q012, q123);
  return [
    { cp1: q01,  cp2: q012, end: q0123 },
    { cp1: q123, cp2: q23,  end: seg.end },
  ];
}

// ── Calibrated paths — placeholder, calibrate with ?dev2 ──────────────────
// START.y = -100  → car hidden just above viewport, appears after ~10% scroll
// END.y   ≈ 1100  → car near bottom of viewport (adjust to match your screen)
const INIT_START_CAR1: Pt = {"x":1060,"y":-225};
const INIT_SEGS_CAR1: Seg[] = [
  { cp1:{x:1120,y:221},  cp2:{x:825,y:436},  end:{x:779,y:733}  },
  { cp1:{x:755,y:900},   cp2:{x:730,y:1121}, end:{x:890,y:1320} },
];

const INIT_START_CAR2: Pt = {"x":1200,"y":-228};
const INIT_SEGS_CAR2: Seg[] = [
  { cp1:{x:1218,y:488},  cp2:{x:875,y:411},  end:{x:869,y:896}  },
  { cp1:{x:888,y:1126},  cp2:{x:921,y:1209}, end:{x:1068,y:1304} },
];

const INIT_START_CAR3: Pt = {"x":1397,"y":-221};
const INIT_SEGS_CAR3: Seg[] = [
  { cp1:{x:1415,y:333},  cp2:{x:1219,y:338}, end:{x:1012,y:702} },
  { cp1:{x:949,y:839},   cp2:{x:836,y:1034}, end:{x:1208,y:1310} },
];

const CAR_SRCS: Record<TabKey, string> = { car1: car1Url, car2: car2Url, car3: car3Url };
// height fixe = même taille pour les 3 quelle que soit la largeur native de l'image
const CAR_H      = 250;  // world px
const FADE_START = 0.80; // dist progress at which fade begins

// Speed factors randomised once per page load → different car wins each time
// Range 0.82–1.18 : ~36 % spread
const SPEED_FACTORS: [number, number, number] = [
  0.82 + Math.random() * 0.36,
  0.82 + Math.random() * 0.36,
  0.82 + Math.random() * 0.36,
];

const IS_DEV2 = new URLSearchParams(location.search).has('dev2');

const TABS: { key: TabKey; label: string; color: string }[] = [
  { key: 'car1', label: 'Car 1', color: '#ffd700' },
  { key: 'car2', label: 'Car 2', color: '#00cfff' },
  { key: 'car3', label: 'Car 3', color: '#ff80ff' },
];

function btnStyle(color: string, disabled = false): React.CSSProperties {
  return {
    flex: 1, border: 'none', borderRadius: 6,
    padding: '7px 10px', fontFamily: 'monospace', fontSize: 11, letterSpacing: 0.3,
    background: disabled ? 'rgba(255,255,255,0.06)' : color,
    color:      disabled ? 'rgba(255,255,255,0.3)'  : '#fff',
    cursor:     disabled ? 'not-allowed' : 'pointer',
    opacity:    disabled ? 0.5 : 1,
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// position:fixed so cars are always in viewport-space.
// Visibility toggled by IntersectionObserver on #s-conclusion.
// Paths are in viewport coordinates (no double-movement cancellation).
// ═════════════════════════════════════════════════════════════════════════════
function ConclusionCarsMain() {
  const [scale,   setScale]   = useState(() => window.innerWidth / WORLD_W);
  const [visible, setVisible] = useState(false);

  const car1Ref = useRef<HTMLImageElement>(null);
  const car2Ref = useRef<HTMLImageElement>(null);
  const car3Ref = useRef<HTMLImageElement>(null);
  const carRefs = [car1Ref, car2Ref, car3Ref] as const;

  const pathStrs: Record<TabKey, string> = {
    car1: buildPath(INIT_START_CAR1, INIT_SEGS_CAR1),
    car2: buildPath(INIT_START_CAR2, INIT_SEGS_CAR2),
    car3: buildPath(INIT_START_CAR3, INIT_SEGS_CAR3),
  };

  // Scale on resize
  useEffect(() => {
    const onResize = () => setScale(window.innerWidth / WORLD_W);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Show only when conclusion page is active.
  // Driven by custom events dispatched from goToPage() in main.js.
  useEffect(() => {
    const onActive   = () => setVisible(true);
    const onInactive = () => setVisible(false);
    window.addEventListener('conclusion-active',   onActive);
    window.addEventListener('conclusion-inactive', onInactive);
    return () => {
      window.removeEventListener('conclusion-active',   onActive);
      window.removeEventListener('conclusion-inactive', onInactive);
    };
  }, []);

  // Scroll-driven animation from s-conclusion internal scroll
  useEffect(() => {
    const section = document.getElementById('s-conclusion');
    if (!section) return;

    const update = () => {
      const max = section.scrollHeight - section.clientHeight;
      if (max <= 0) return;
      const progress = Math.min(1, section.scrollTop / max);

      carRefs.forEach((ref, i) => {
        const el = ref.current;
        if (!el) return;
        const dist = Math.min(1, progress * SPEED_FACTORS[i]);
        const fade = dist < FADE_START
          ? 1
          : 1 - (dist - FADE_START) / (1 - FADE_START);
        el.style.setProperty('offset-distance', `${(dist * 100).toFixed(2)}%`);
        el.style.opacity = String(Math.max(0, fade));
      });
    };

    section.addEventListener('scroll', update, { passive: true });
    update();
    return () => section.removeEventListener('scroll', update);
  }, []);

  // viewH: viewport height expressed in world units
  const viewH = Math.round(window.innerHeight / scale);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 5,
      // hide when section not active — avoids showing over other sections
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s',
    }}>
      {/* Scaled world container sized to the viewport */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width:  `${WORLD_W}px`,
        height: `${viewH}px`,
        transformOrigin: 'top left',
        transform: `scale(${scale})`,
        overflow: 'visible',
      }}>
        {(['car1', 'car2', 'car3'] as TabKey[]).map((key, i) => (
          <img
            key={key}
            ref={carRefs[i]}
            src={CAR_SRCS[key]}
            style={{
              position: 'absolute', top: 0, left: 0,
              height: `${CAR_H}px`, width: 'auto',
              offsetPath:     `path('${pathStrs[key]}')`,
              offsetDistance: '0%',
              offsetRotate:   'auto -90deg',
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// DEV2 EDITOR
// SVG viewBox covers Y [-200, 1300] — start points and end points both visible.
// Track image shown inside SVG as reference background.
// ═════════════════════════════════════════════════════════════════════════════
function Dev2Editor() {
  type PathData = { start: Pt; segs: Seg[] };

  const [paths, setPaths] = useState<Record<TabKey, PathData>>({
    car1: { start: INIT_START_CAR1, segs: INIT_SEGS_CAR1 },
    car2: { start: INIT_START_CAR2, segs: INIT_SEGS_CAR2 },
    car3: { start: INIT_START_CAR3, segs: INIT_SEGS_CAR3 },
  });
  const [activeTab, setActiveTab] = useState<TabKey>('car1');
  const [selected,  setSelected]  = useState<number | 'start' | null>(null);
  const [showInfo,  setShowInfo]  = useState(false);
  const [copied,    setCopied]    = useState(false);

  const svgRef   = useRef<SVGSVGElement>(null);
  const dragging = useRef<string | null>(null);
  const mdPt     = useRef<{ x: number; y: number } | null>(null);

  // Same scale as production: width = 100vw → scale = vw / WORLD_W
  const [scale, setScale] = useState(() => window.innerWidth / WORLD_W);
  useEffect(() => {
    const onResize = () => setScale(window.innerWidth / WORLD_W);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const currPath = paths[activeTab];
  const { start: startPt, segs } = currPath;

  const pathStrs = useMemo(() => {
    const r = {} as Record<TabKey, string>;
    (['car1','car2','car3'] as TabKey[]).forEach(k => { r[k] = buildPath(paths[k].start, paths[k].segs); });
    return r;
  }, [paths]);

  const updPath = (fn: (p: PathData) => PathData) =>
    setPaths(prev => ({ ...prev, [activeTab]: fn(prev[activeTab]) }));

  const svgCoord = (e: React.MouseEvent): Pt => {
    const rect = svgRef.current!.getBoundingClientRect();
    // rect accounts for container scroll automatically via getBoundingClientRect
    return {
      x: Math.round((e.clientX - rect.left) / scale),
      y: Math.round((e.clientY - rect.top)  / scale + DEV2_VIEW_Y),
    };
  };

  const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging.current) return;
    const pt  = svgCoord(e);
    const key = dragging.current;
    if (key === 'start') { updPath(p => ({ ...p, start: pt })); return; }
    const [kind, idxStr] = key.split('_');
    const i = parseInt(idxStr);
    updPath(p => {
      const next = p.segs.map(s => ({...s,cp1:{...s.cp1},cp2:{...s.cp2},end:{...s.end}}));
      if      (kind === 'end') next[i].end = pt;
      else if (kind === 'cp1') next[i].cp1 = pt;
      else                     next[i].cp2 = pt;
      return { ...p, segs: next };
    });
  };

  const onAnchorDown = (key: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    dragging.current = key;
    mdPt.current = { x: e.clientX, y: e.clientY };
  };
  const onAnchorUp = (selIdx: number | 'start') => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mdPt.current) {
      const moved = Math.abs(e.clientX - mdPt.current.x) + Math.abs(e.clientY - mdPt.current.y);
      if (moved < 5) setSelected(prev => prev === selIdx ? null : selIdx);
    }
    dragging.current = null;
    mdPt.current = null;
  };

  // ── Path operations ───────────────────────────────────────────────────────
  const addAtStart = () => updPath(p => {
    const next = [...p.segs];
    const [a, b] = splitSeg(p.start, next[0]);
    return { ...p, segs: [a, b, ...next.slice(1)] };
  });

  const addAtEnd = () => updPath(p => {
    const next = [...p.segs];
    const idx  = next.length - 1;
    const p0   = idx > 0 ? next[idx - 1].end : p.start;
    const [a, b] = splitSeg(p0, next[idx]);
    next.splice(idx, 1, a, b);
    return { ...p, segs: next };
  });

  const addBefore = () => {
    if (selected === null || selected === 'start') return;
    const i = selected as number;
    updPath(p => {
      const next = [...p.segs];
      const p0   = i === 0 ? p.start : next[i - 1].end;
      const [a, b] = splitSeg(p0, next[i]);
      next.splice(i, 1, a, b);
      return { ...p, segs: next };
    });
  };

  const addAfter = () => {
    if (selected === null || selected === 'start') return;
    const i = selected as number;
    if (i >= segs.length - 1) { addAtEnd(); return; }
    updPath(p => {
      const next = [...p.segs];
      const [a, b] = splitSeg(next[i].end, next[i + 1]);
      next.splice(i + 1, 1, a, b);
      return { ...p, segs: next };
    });
  };

  const removePoint = () => {
    if (selected === null || selected === 'start' || segs.length <= 2) return;
    const i = selected as number;
    updPath(p => {
      const next = [...p.segs];
      if (i === 0) { next.splice(0, 1); }
      else { next.splice(i - 1, 2, { cp1: next[i-1].cp1, cp2: next[i].cp2, end: next[i].end }); }
      return { ...p, segs: next };
    });
    setSelected(null);
  };

  const resetBezier = () => {
    if (selected === null || selected === 'start') return;
    const i = selected as number;
    updPath(p => {
      const next       = p.segs.map(s => ({...s,cp1:{...s.cp1},cp2:{...s.cp2},end:{...s.end}}));
      const anchor     = next[i].end;
      const prevAnchor = i === 0 ? p.start : next[i - 1].end;
      next[i].cp2 = { x: Math.round(anchor.x + (prevAnchor.x - anchor.x)/3), y: Math.round(anchor.y + (prevAnchor.y - anchor.y)/3) };
      if (i + 1 < next.length) {
        const nextAnchor = next[i + 1].end;
        next[i+1].cp1 = { x: Math.round(anchor.x + (nextAnchor.x - anchor.x)/3), y: Math.round(anchor.y + (nextAnchor.y - anchor.y)/3) };
      }
      return { ...p, segs: next };
    });
  };

  const copyData = () => {
    const parts: string[] = [];
    (['car1','car2','car3'] as TabKey[]).forEach(key => {
      const p = paths[key];
      parts.push(`// ${key.toUpperCase()}`);
      parts.push(`const INIT_START_${key.toUpperCase()}: Pt = ${JSON.stringify(p.start)};`);
      parts.push(`const INIT_SEGS_${key.toUpperCase()}: Seg[] = ${JSON.stringify(p.segs, null, 2)};`);
      parts.push('');
    });
    navigator.clipboard.writeText(parts.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const ptR = 12, cpR = 8;
  const canRemove = selected !== null && selected !== 'start' && segs.length > 2;

  const viewBox = `0 ${DEV2_VIEW_Y} ${WORLD_W} ${DEV2_VIEW_H}`;

  // Viewport boundary: Y=0 → Y=viewH_approx
  const approxViewH = Math.round(window.innerHeight / (window.innerWidth / WORLD_W));

  const panel = createPortal(
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 99999,
      background: 'rgba(8,8,8,0.95)', border: '1px solid #e8002d',
      borderRadius: 10, padding: '16px 18px', fontFamily: 'monospace',
      fontSize: 12, color: '#fff', display: 'flex', flexDirection: 'column', gap: 10,
      minWidth: 260, boxShadow: '0 0 30px rgba(232,0,45,0.2)',
    }}>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ color:'#e8002d', fontWeight:'bold', letterSpacing:2, fontSize:11 }}>DEV2 · CONCLUSION CARS</span>
        <button onClick={() => setShowInfo(v => !v)} style={{
          width:22, height:22, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.3)',
          background: showInfo ? 'rgba(232,0,45,0.3)' : 'rgba(255,255,255,0.08)',
          color:'#fff', cursor:'pointer', fontSize:12, fontFamily:'serif', lineHeight:'20px', padding:0,
        }}>i</button>
      </div>

      {showInfo && (
        <div style={{ background:'rgba(255,255,255,0.05)', borderRadius:6, padding:'10px 12px', fontSize:11, lineHeight:1.75, color:'rgba(255,255,255,0.8)' }}>
          Paths en <b>espace viewport</b>.<br/>
          <b style={{color:'#888'}}>Ligne grise</b> = bord supérieur viewport (Y=0).<br/>
          <b style={{color:'#555'}}>Ligne pointillée</b> = bord inférieur viewport (~Y={approxViewH}).<br/>
          <b style={{color:'#4af'}}>START</b> à Y négatif = hors-champ en haut.<br/>
          <b>End</b> = arrêt juste avant footer.<br/>
          Positions: fixed → pas de double-mouvement.<br/>
          <b style={{color:'#22c55e'}}>Copy</b> → coller dans ConclusionCars.tsx.
        </div>
      )}

      <div style={{ display:'flex', gap:5 }}>
        {TABS.map(({ key, label, color }) => (
          <button key={key} onClick={() => { setActiveTab(key); setSelected(null); }} style={{
            flex:1, padding:'5px 9px', borderRadius:6, cursor:'pointer',
            background: activeTab === key ? 'rgba(232,0,45,0.18)' : 'rgba(255,255,255,0.07)',
            border: activeTab === key ? `1.5px solid ${color}` : '1.5px solid rgba(255,255,255,0.12)',
            color:'#fff', fontFamily:'monospace', fontSize:11,
            display:'flex', alignItems:'center', gap:5,
          }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background: color }} />
            {label}
          </button>
        ))}
      </div>

      <div style={{ display:'flex', gap:5 }}>
        <button onClick={addAtStart} style={btnStyle('#1d6fa4')}>+ Début</button>
        <button onClick={addAtEnd}   style={btnStyle('#1d6fa4')}>+ Fin</button>
      </div>
      {selected !== null && selected !== 'start' && (
        <div style={{ display:'flex', gap:5 }}>
          <button onClick={addBefore}   style={btnStyle('#1d6fa4')}>+ Avant</button>
          <button onClick={addAfter}    style={btnStyle('#1d6fa4')}>+ Après</button>
          <button onClick={resetBezier} style={btnStyle('#7c3aed')}>↺</button>
          <button onClick={removePoint} style={btnStyle('#991b1b', !canRemove)} disabled={!canRemove}>−</button>
        </div>
      )}
      <button onClick={copyData} style={{
        background: copied ? '#166534' : '#15803d', border:'none', borderRadius:6,
        color:'#fff', padding:'7px 10px', cursor:'pointer', fontFamily:'monospace', fontSize:11,
      }}>
        {copied ? '✓ Copié !' : 'Copy'}
      </button>
    </div>,
    document.body,
  );

  return (
    <div style={{ position:'fixed', inset:0, background:'#080808', zIndex:9999, overflowY:'auto' }}>
      {panel}
      <svg
        ref={svgRef}
        viewBox={viewBox}
        width={WORLD_W * scale}
        height={DEV2_VIEW_H * scale}
        style={{ display:'block', cursor:'crosshair' }}
        onMouseMove={onMouseMove}
        onMouseUp={() => { dragging.current = null; }}
        onClick={() => setSelected(null)}
      >
        {/* Track image as background reference */}
        <image href={trackUrl} x={0} y={0} width={WORLD_W} height={2909} opacity={0.4} preserveAspectRatio="xMidYMin meet" />

        {/* Viewport boundary guides */}
        <line x1={0} y1={0}            x2={WORLD_W} y2={0}            stroke="rgba(255,255,255,0.35)" strokeWidth={3} />
        <line x1={0} y1={approxViewH}  x2={WORLD_W} y2={approxViewH}  stroke="rgba(255,255,255,0.15)" strokeWidth={2} strokeDasharray="20 10" />
        <text x={10} y={-10}          fill="rgba(255,255,255,0.4)" fontSize={22} fontFamily="monospace">viewport top</text>
        <text x={10} y={approxViewH - 10} fill="rgba(255,255,255,0.25)" fontSize={22} fontFamily="monospace">viewport bottom ~{approxViewH}px</text>

        {/* All paths */}
        {TABS.map(({ key, color }) => (
          <path key={key} d={pathStrs[key]} fill="none" stroke={color}
            strokeWidth={activeTab === key ? 2.5 : 1}
            opacity={activeTab === key ? 1 : 0.25}
          />
        ))}

        {/* Active path controls */}
        {segs.map((seg, i) => {
          const p0    = i === 0 ? startPt : segs[i - 1].end;
          const color = TABS.find(t => t.key === activeTab)!.color;
          const isSel = selected === i;
          return (
            <g key={i}>
              <line x1={p0.x}      y1={p0.y}      x2={seg.cp1.x} y2={seg.cp1.y} stroke="rgba(0,255,100,0.4)"  strokeWidth={1.5} />
              <line x1={seg.end.x} y1={seg.end.y} x2={seg.cp2.x} y2={seg.cp2.y} stroke="rgba(255,160,0,0.4)" strokeWidth={1.5} />
              <circle cx={seg.cp1.x} cy={seg.cp1.y} r={cpR} fill="rgba(0,255,100,0.75)"  stroke="#000" strokeWidth={1}
                onMouseDown={onAnchorDown(`cp1_${i}`)} onMouseUp={() => { dragging.current = null; }} style={{cursor:'grab'}} />
              <circle cx={seg.cp2.x} cy={seg.cp2.y} r={cpR} fill="rgba(255,160,0,0.75)" stroke="#000" strokeWidth={1}
                onMouseDown={onAnchorDown(`cp2_${i}`)} onMouseUp={() => { dragging.current = null; }} style={{cursor:'grab'}} />
              <circle cx={seg.end.x} cy={seg.end.y} r={ptR}
                fill={isSel ? '#fff' : color} stroke="#000" strokeWidth={2}
                onMouseDown={onAnchorDown(`end_${i}`)} onMouseUp={onAnchorUp(i)} style={{cursor:'pointer'}} />
              {isSel && <text x={seg.end.x + 14} y={seg.end.y + 5} fill="#fff" fontSize={20} fontFamily="monospace">{i}</text>}
            </g>
          );
        })}

        {/* START point */}
        <circle cx={startPt.x} cy={startPt.y} r={ptR}
          fill={selected === 'start' ? '#fff' : '#4af'} stroke="#000" strokeWidth={2}
          onMouseDown={onAnchorDown('start')} onMouseUp={onAnchorUp('start')} style={{cursor:'pointer'}} />
        <text x={startPt.x + 14} y={startPt.y + 5} fill="#4af" fontSize={20} fontFamily="monospace">START</text>
      </svg>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
export default function ConclusionCars() {
  if (IS_DEV2) return <Dev2Editor />;
  return <ConclusionCarsMain />;
}
