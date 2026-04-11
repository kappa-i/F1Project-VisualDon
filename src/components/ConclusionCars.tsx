import React, { useEffect, useRef, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';

import car1Url  from '../assets/1111.webp';
import car2Url  from '../assets/2222.webp';
import car3Url  from '../assets/3333.webp';
import trackUrl from '../assets/track-asset2.webp';

// ── World space = track image natural dimensions ───────────────────────────
// Paths are in IMAGE coordinates:
//   X : 0 → WORLD_W  (full image width)
//   Y : 0 → WORLD_H  (full image height)
// The world container is shifted by scrollTop on each scroll event so that
// cars appear fixed ON the image (not fixed to the viewport).
// Calibrate paths with ?dev2 — the SVG overlays the actual image.
const WORLD_W = 1920;
const WORLD_H = 2909; // track-asset2.webp natural height

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

// ── Paths in IMAGE coordinates — calibrate with ?dev2 ─────────────────────
// For a car to remain visible in the viewport as you scroll:
//   image_y(progress) ≈ progress × maxScroll_world + viewport_offset
// where maxScroll_world = WORLD_H - approxViewH ≈ 1900–2000
// → paths should span from Y≈0–300 (top) to Y≈2000–2900 (bottom)
const INIT_START_CAR1: Pt = {"x":1093,"y":-160};
const INIT_SEGS_CAR1: Seg[] = [
  { cp1:{"x":1054,"y":348},  cp2:{"x":700,"y":930},   end:{"x":693,"y":982}   },
  { cp1:{"x":637,"y":1296},  cp2:{"x":949,"y":1458},  end:{"x":1023,"y":1703} },
  { cp1:{"x":1089,"y":1976}, cp2:{"x":730,"y":2296},  end:{"x":890,"y":2618}  },
];

const INIT_START_CAR2: Pt = {"x":1263,"y":-162};
const INIT_SEGS_CAR2: Seg[] = [
  { cp1:{"x":1079,"y":342},  cp2:{"x":1048,"y":458},  end:{"x":959,"y":694}   },
  { cp1:{"x":866,"y":994},   cp2:{"x":893,"y":1073},  end:{"x":979,"y":1276}  },
  { cp1:{"x":1012,"y":1381}, cp2:{"x":1231,"y":1648}, end:{"x":1127,"y":1857} },
  { cp1:{"x":888,"y":2304},  cp2:{"x":921,"y":2438},  end:{"x":964,"y":2601}  },
];

const INIT_START_CAR3: Pt = {"x":1463,"y":-171};
const INIT_SEGS_CAR3: Seg[] = [
  { cp1:{"x":1389,"y":193},  cp2:{"x":1274,"y":359},  end:{"x":1208,"y":493}  },
  { cp1:{"x":1140,"y":637},  cp2:{"x":1071,"y":724},  end:{"x":1026,"y":933}  },
  { cp1:{"x":1033,"y":1174}, cp2:{"x":1269,"y":1253}, end:{"x":1304,"y":1366} },
  { cp1:{"x":1413,"y":1759}, cp2:{"x":1234,"y":2019}, end:{"x":1148,"y":2179} },
  { cp1:{"x":1102,"y":2264}, cp2:{"x":1009,"y":2372}, end:{"x":1011,"y":2614} },
];

const CAR_SRCS: Record<TabKey, string> = { car1: car1Url, car2: car2Url, car3: car3Url };
const CAR_H      = 250;  // world px
const FADE_START = 0.80;

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
// Cars are in image-space coordinates. The world container (position:fixed) is
// shifted by -scrollTop on each scroll event so cars appear ON the image.
// screen_y = image_y × scale − scrollTop_px  →  cars stick to the circuit.
// ═════════════════════════════════════════════════════════════════════════════
function ConclusionCarsMain() {
  const [scale,   setScale]   = useState(() => window.innerWidth / WORLD_W);
  const [visible, setVisible] = useState(false);

  const car1Ref  = useRef<HTMLImageElement>(null);
  const car2Ref  = useRef<HTMLImageElement>(null);
  const car3Ref  = useRef<HTMLImageElement>(null);
  const carRefs  = [car1Ref, car2Ref, car3Ref] as const;
  const worldRef = useRef<HTMLDivElement>(null);

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

  // Show/hide via events from main.js
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

  // Scroll: animate cars + shift world container so cars stick to the image
  useEffect(() => {
    const section = document.getElementById('s-conclusion');
    if (!section) return;

    const update = () => {
      const max = section.scrollHeight - section.clientHeight;
      if (max <= 0) return;
      const progress = Math.min(1, section.scrollTop / max);

      // Shift the world container up by scrollTop (in world units) so that
      // a car at image_y stays at screen_y = image_y − scrollTop_world
      const scrollTopWorld = section.scrollTop / scale;
      if (worldRef.current) {
        worldRef.current.style.transform =
          `scale(${scale}) translateY(${-scrollTopWorld}px)`;
      }

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
  }, [scale]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 5,
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.3s',
    }}>
      <div ref={worldRef} style={{
        position: 'absolute', top: 0, left: 0,
        width:  `${WORLD_W}px`,
        height: `${WORLD_H}px`,
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
// The SVG path editor is position:absolute INSIDE the scroll container,
// overlaid exactly on the track image → paths scroll with the image.
// A yellow rectangle shows the current viewport position in the image.
// Cars animate in real-time via a fixed overlay with scroll-compensating
// transform (same as production).
// ═════════════════════════════════════════════════════════════════════════════
function Dev2Editor() {
  type PathData = { start: Pt; segs: Seg[] };

  const [paths, setPaths] = useState<Record<TabKey, PathData>>({
    car1: { start: INIT_START_CAR1, segs: INIT_SEGS_CAR1 },
    car2: { start: INIT_START_CAR2, segs: INIT_SEGS_CAR2 },
    car3: { start: INIT_START_CAR3, segs: INIT_SEGS_CAR3 },
  });
  const [activeTab,      setActiveTab]      = useState<TabKey>('car1');
  const [selected,       setSelected]       = useState<number | 'start' | null>(null);
  const [showInfo,       setShowInfo]       = useState(false);
  const [copied,         setCopied]         = useState(false);
  // scrollTopWorld drives the viewport indicator rect (React state → re-render)
  const [scrollTopWorld, setScrollTopWorld] = useState(0);

  const svgRef             = useRef<SVGSVGElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const carWorldRef        = useRef<HTMLDivElement>(null);
  const dragging = useRef<string | null>(null);
  const mdPt     = useRef<{ x: number; y: number } | null>(null);

  const car1Ref = useRef<HTMLImageElement>(null);
  const car2Ref = useRef<HTMLImageElement>(null);
  const car3Ref = useRef<HTMLImageElement>(null);
  const carRefs = [car1Ref, car2Ref, car3Ref] as const;

  const [scale, setScale] = useState(() => window.innerWidth / WORLD_W);
  useEffect(() => {
    const onResize = () => setScale(window.innerWidth / WORLD_W);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Forward wheel events from SVG to scroll container.
  // The SVG (position:absolute, full image height) captures wheel events and
  // prevents them from reaching the scroll container → nothing scrolls.
  // We intercept on the SVG, preventDefault (suppresses native scroll), and
  // manually apply deltaY to the scroll container.
  useEffect(() => {
    const svgEl    = svgRef.current;
    const scrollEl = scrollContainerRef.current;
    if (!svgEl || !scrollEl) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollEl.scrollTop += e.deltaY;
    };
    svgEl.addEventListener('wheel', onWheel, { passive: false });
    return () => svgEl.removeEventListener('wheel', onWheel);
  }, []);

  // Scroll: same logic as production (cars + world transform + viewport indicator)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const update = () => {
      const max = container.scrollHeight - container.clientHeight;
      if (max <= 0) return;
      const progress = Math.min(1, container.scrollTop / max);
      const stw = container.scrollTop / scale;

      if (carWorldRef.current) {
        carWorldRef.current.style.transform = `scale(${scale}) translateY(${-stw}px)`;
      }

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

      setScrollTopWorld(Math.round(stw));
    };
    container.addEventListener('scroll', update, { passive: true });
    update();
    return () => container.removeEventListener('scroll', update);
  }, [scale]);

  const currPath = paths[activeTab];
  const { start: startPt, segs } = currPath;

  const pathStrs = useMemo(() => {
    const r = {} as Record<TabKey, string>;
    (['car1','car2','car3'] as TabKey[]).forEach(k => {
      r[k] = buildPath(paths[k].start, paths[k].segs);
    });
    return r;
  }, [paths]);

  const updPath = (fn: (p: PathData) => PathData) =>
    setPaths(prev => ({ ...prev, [activeTab]: fn(prev[activeTab]) }));

  // svgCoord: SVG top:0 inside relative wrapper (= top of top-margin spacer).
  // viewBox starts at Y=-MARGIN, so we subtract MARGIN to get image coordinates.
  // rect.top = -scrollTop (scroll container is fixed; wrapper scrolls up).
  // y = (clientY + scrollTop) / scale - MARGIN = scrollTopWorld + clientY/scale - MARGIN ✓
  const svgCoord = (e: React.MouseEvent): Pt => {
    const rect = svgRef.current!.getBoundingClientRect();
    return {
      x: Math.round((e.clientX - rect.left) / scale),
      y: Math.round((e.clientY - rect.top)  / scale - MARGIN),
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

  // approxViewH: viewport height in world units (for the viewport indicator rect)
  const approxViewH = Math.round(window.innerHeight / scale);

  // MARGIN: extra space in world units above/below the image so paths can start/end
  // outside the image bounds (cars hidden behind overflow before entering).
  const MARGIN = 1000;

  // viewBox covers [-MARGIN … WORLD_H+MARGIN] on Y so the margin areas are editable.
  const viewBox = `0 ${-MARGIN} ${WORLD_W} ${WORLD_H + 2 * MARGIN}`;

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
          Paths en <b>espace image</b> (Y: 0 → {WORLD_H}).<br/>
          <b style={{color:'#ff0'}}>Rectangle jaune</b> = viewport actuel dans l'image.<br/>
          Les voitures collent à l'image grâce à translateY(-scrollTop).<br/>
          Scrolle pour voir l'anim en temps réel.<br/>
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
    <>
      {/* ── 1. Scrollable container — matches production #s-conclusion ── */}
      <div
        ref={scrollContainerRef}
        style={{
          position: 'fixed', inset: 0,
          height: '100vh', overflowY: 'auto', overflowX: 'hidden',
          background: '#080808', zIndex: 9999,
          msOverflowStyle: 'none', scrollbarWidth: 'none',
        } as React.CSSProperties}
      >
        {/* Relative wrapper so the absolute SVG positions over the full scrollable area */}
        <div style={{ position: 'relative' }}>
          {/* Top margin: MARGIN world units of empty space — paths can start here */}
          <div style={{ height: MARGIN * scale }} />
          <img
            src={trackUrl}
            style={{ display: 'block', width: '100%', height: 'auto', opacity: 0.4 }}
            alt=""
          />
          {/* Bottom margin + footer */}
          <div style={{ height: MARGIN * scale + 80 }} />

          {/* ── 2. SVG path editor — position:absolute, covers top-margin → bottom-margin ── */}
          {/* top:0 = top of relative wrapper = top of top-margin spacer.                     */}
          {/* viewBox Y starts at -MARGIN so svgCoord gives image-space coords (y=0 = image top). */}
          <svg
            ref={svgRef}
            viewBox={viewBox}
            width={WORLD_W * scale}
            height={(WORLD_H + 2 * MARGIN) * scale}
            style={{
              position: 'absolute', top: 0, left: 0,
              display: 'block', cursor: 'crosshair',
            }}
            onMouseMove={onMouseMove}
            onMouseUp={() => { dragging.current = null; }}
            onClick={() => setSelected(null)}
          >
            {/* Yellow rectangle = current viewport position in the full coordinate space */}
            {/* viewBox Y_top_of_viewport = -MARGIN + scrollTopWorld                     */}
            <rect
              x={0} y={-MARGIN + scrollTopWorld}
              width={WORLD_W} height={approxViewH}
              fill="rgba(255,255,0,0.03)"
              stroke="rgba(255,255,0,0.45)" strokeWidth={5}
            />
            <text x={14} y={-MARGIN + scrollTopWorld + 35}
              fill="rgba(255,255,0,0.55)" fontSize={26} fontFamily="monospace">
              viewport ({approxViewH}px)
            </text>

            {/* All paths */}
            {TABS.map(({ key, color }) => (
              <path key={key} d={pathStrs[key]} fill="none" stroke={color}
                strokeWidth={activeTab === key ? 3 : 1.5}
                opacity={activeTab === key ? 1 : 0.3}
              />
            ))}

            {/* Active path controls */}
            {segs.map((seg, i) => {
              const p0    = i === 0 ? startPt : segs[i - 1].end;
              const color = TABS.find(t => t.key === activeTab)!.color;
              const isSel = selected === i;
              return (
                <g key={i}>
                  <line x1={p0.x}      y1={p0.y}      x2={seg.cp1.x} y2={seg.cp1.y} stroke="rgba(0,255,100,0.4)"  strokeWidth={2} />
                  <line x1={seg.end.x} y1={seg.end.y} x2={seg.cp2.x} y2={seg.cp2.y} stroke="rgba(255,160,0,0.4)" strokeWidth={2} />
                  <circle cx={seg.cp1.x} cy={seg.cp1.y} r={cpR} fill="rgba(0,255,100,0.75)"  stroke="#000" strokeWidth={1}
                    onMouseDown={onAnchorDown(`cp1_${i}`)} onMouseUp={() => { dragging.current = null; }} style={{cursor:'grab'}} />
                  <circle cx={seg.cp2.x} cy={seg.cp2.y} r={cpR} fill="rgba(255,160,0,0.75)" stroke="#000" strokeWidth={1}
                    onMouseDown={onAnchorDown(`cp2_${i}`)} onMouseUp={() => { dragging.current = null; }} style={{cursor:'grab'}} />
                  <circle cx={seg.end.x} cy={seg.end.y} r={ptR}
                    fill={isSel ? '#fff' : color} stroke="#000" strokeWidth={2}
                    onMouseDown={onAnchorDown(`end_${i}`)} onMouseUp={onAnchorUp(i)} style={{cursor:'pointer'}} />
                  {isSel && <text x={seg.end.x + 14} y={seg.end.y + 5} fill="#fff" fontSize={22} fontFamily="monospace">{i}</text>}
                </g>
              );
            })}

            {/* START point */}
            <circle cx={startPt.x} cy={startPt.y} r={ptR}
              fill={selected === 'start' ? '#fff' : '#4af'} stroke="#000" strokeWidth={2}
              onMouseDown={onAnchorDown('start')} onMouseUp={onAnchorUp('start')} style={{cursor:'pointer'}} />
            <text x={startPt.x + 14} y={startPt.y + 5} fill="#4af" fontSize={22} fontFamily="monospace">START</text>
          </svg>
        </div>
      </div>

      {/* ── 3. Live car animation overlay — same as production ── */}
      <div style={{
        position: 'fixed', top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 10000,
      }}>
        <div ref={carWorldRef} style={{
          position: 'absolute', top: 0, left: 0,
          width:  `${WORLD_W}px`,
          height: `${WORLD_H}px`,
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
                offsetPath:   `path('${pathStrs[key]}')`,
                offsetRotate: 'auto -90deg',
              } as React.CSSProperties}
            />
          ))}
        </div>
      </div>

      {/* ── 4. Control panel ── */}
      {panel}
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
export default function ConclusionCars() {
  if (IS_DEV2) return <Dev2Editor />;
  return <ConclusionCarsMain />;
}
