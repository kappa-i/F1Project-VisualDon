import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';

// ── World dimensions ──────────────────────────────────────────────────────
const WORLD_W = 2400;
const WORLD_H = 1800;

// ── Data types ────────────────────────────────────────────────────────────
type Pt  = { x: number; y: number };
type Seg = { cp1: Pt; cp2: Pt; end: Pt };

// ── Initial path (from user-calibrated dev2 session) ─────────────────────
const INIT_START: Pt = { x: 282, y: 405 };
const INIT_SEGS: Seg[] = [
  { cp1:{x:243,y:303},   cp2:{x:521,y:246},   end:{x:517,y:375}   },
  { cp1:{x:533,y:469},   cp2:{x:511,y:673},   end:{x:638,y:726}   },
  { cp1:{x:844,y:749},   cp2:{x:748,y:371},   end:{x:828,y:334}   },
  { cp1:{x:984,y:297},   cp2:{x:1198,y:315},  end:{x:1247,y:374}  },
  { cp1:{x:1312,y:446},  cp2:{x:2134,y:1263}, end:{x:2016,y:1319} },
  { cp1:{x:1989,y:1548}, cp2:{x:1675,y:1489}, end:{x:1443,y:1495} },
  { cp1:{x:1235,y:1499}, cp2:{x:1552,y:720},  end:{x:1067,y:883}  },
  { cp1:{x:1043,y:901},  cp2:{x:996,y:955},   end:{x:979,y:1000}  },
  { cp1:{x:945,y:1091},  cp2:{x:1008,y:1284}, end:{x:940,y:1507}  },
  { cp1:{x:701,y:1535},  cp2:{x:549,y:1536},  end:{x:505,y:1497}  },
  { cp1:{x:461,y:1458},  cp2:{x:174,y:1585},  end:{x:323,y:1289}  },
  { cp1:{x:816,y:1297},  cp2:{x:811,y:925},   end:{x:306,y:947}   },
  { cp1:{x:226,y:907},   cp2:{x:257,y:501},   end:{x:255,y:477}   },
];

function buildPath(start: Pt, segs: Seg[]): string {
  let d = `M ${start.x} ${start.y}`;
  segs.forEach(s => { d += ` C ${s.cp1.x} ${s.cp1.y} ${s.cp2.x} ${s.cp2.y} ${s.end.x} ${s.end.y}`; });
  return d + ' Z';
}

// ── Cars config ───────────────────────────────────────────────────────────
const CARS = [
  { src: '/racetrack/car1.png', baseOffset:  0.00 },
  { src: '/racetrack/car2.png', baseOffset:  0.04 },
  { src: '/racetrack/car3.png', baseOffset: -0.04 },
];

function wrap(v: number) { return ((v % 1) + 1) % 1; }
const CAM_LERP = 0.055;

// ── De Casteljau split at t=0.5 ──────────────────────────────────────────
function midPt(a: Pt, b: Pt): Pt { return { x: Math.round((a.x+b.x)/2), y: Math.round((a.y+b.y)/2) }; }
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

// ── URL flag ─────────────────────────────────────────────────────────────
const IS_DEV2 = new URLSearchParams(location.search).has('dev2');

// ── Shared button style helper ────────────────────────────────────────────
function btnStyle(color: string, disabled = false): React.CSSProperties {
  return {
    flex: 1,
    background: disabled ? 'rgba(255,255,255,0.06)' : color,
    color: disabled ? 'rgba(255,255,255,0.3)' : '#fff',
    border: 'none', borderRadius: 6,
    padding: '7px 10px', cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'monospace', fontSize: 11, letterSpacing: 0.3,
    opacity: disabled ? 0.5 : 1,
  };
}

// ═════════════════════════════════════════════════════════════════════════
// DEV2 EDITOR
// ═════════════════════════════════════════════════════════════════════════
function Dev2Editor() {
  const [startPt,  setStartPt]  = useState<Pt>(INIT_START);
  const [segs,     setSegs]     = useState<Seg[]>(INIT_SEGS);
  const [selected, setSelected] = useState<number | 'start' | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [copied,   setCopied]   = useState(false);

  const svgRef      = useRef<SVGSVGElement>(null);
  const dragging    = useRef<string | null>(null);
  const mdPt        = useRef<{ x: number; y: number } | null>(null); // mousedown position
  const carsRef     = useRef<(HTMLImageElement | null)[]>([null, null, null]);

  const pathStr = useMemo(() => buildPath(startPt, segs), [startPt, segs]);

  // ── Scale world to fit viewport ─────────────────────────────────────
  const [dim, setDim] = useState({ scale: 1, ox: 0, oy: 0 });
  useEffect(() => {
    const calc = () => {
      const s = Math.min(window.innerWidth / WORLD_W, window.innerHeight / WORLD_H) * 0.96;
      setDim({ scale: s, ox: (window.innerWidth - WORLD_W * s) / 2, oy: (window.innerHeight - WORLD_H * s) / 2 });
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  // ── Update cars when path changes ──────────────────────────────────
  useEffect(() => {
    carsRef.current.forEach((car, i) => {
      if (!car) return;
      car.style.setProperty('offset-path', `path('${pathStr}')`);
      car.style.setProperty('offset-rotate', 'auto -90deg');
      car.style.setProperty('offset-distance', (wrap(CARS[i].baseOffset) * 100).toFixed(2) + '%');
    });
  }, [pathStr]);

  // ── SVG world coords ───────────────────────────────────────────────
  const svgCoord = (e: React.MouseEvent): Pt => {
    const rect = svgRef.current!.getBoundingClientRect();
    return {
      x: Math.round((e.clientX - rect.left) / dim.scale),
      y: Math.round((e.clientY - rect.top)  / dim.scale),
    };
  };

  // ── Drag handlers ──────────────────────────────────────────────────
  const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging.current) return;
    const pt  = svgCoord(e);
    const key = dragging.current;

    if (key === 'start') {
      const dx = pt.x - startPt.x, dy = pt.y - startPt.y;
      setStartPt(pt);
      setSegs(prev => {
        const next = prev.map(s => ({...s,cp1:{...s.cp1},cp2:{...s.cp2},end:{...s.end}}));
        const last = next[next.length - 1];
        last.end = { x: last.end.x + dx, y: last.end.y + dy };
        return next;
      });
      return;
    }

    const [kind, idxStr] = key.split('_');
    const i = parseInt(idxStr);
    setSegs(prev => {
      const next = prev.map(s => ({...s,cp1:{...s.cp1},cp2:{...s.cp2},end:{...s.end}}));
      if (kind === 'end') {
        const dx = pt.x - next[i].end.x, dy = pt.y - next[i].end.y;
        next[i].end = pt;
        next[i].cp2 = { x: next[i].cp2.x + dx, y: next[i].cp2.y + dy };
        if (i + 1 < next.length) next[i+1].cp1 = { x: next[i+1].cp1.x + dx, y: next[i+1].cp1.y + dy };
      } else if (kind === 'cp1') {
        next[i].cp1 = pt;
      } else {
        next[i].cp2 = pt;
      }
      return next;
    });
  };

  const onAnchorDown = (key: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    dragging.current = key;
    mdPt.current = { x: e.clientX, y: e.clientY };
  };

  const onAnchorUp = (selIdx: number | 'start') => (e: React.MouseEvent) => {
    e.stopPropagation(); // empêche le SVG onClick de désélectionner
    if (mdPt.current) {
      const moved = Math.abs(e.clientX - mdPt.current.x) + Math.abs(e.clientY - mdPt.current.y);
      if (moved < 5) setSelected(prev => prev === selIdx ? null : selIdx);
    }
    dragging.current = null;
    mdPt.current = null;
  };

  const onSvgUp   = () => { dragging.current = null; };
  const onSvgClick = () => { setSelected(null); }; // clic sur fond vide → désélectionner

  // ── Ajouter au début (premier segment) ────────────────────────────
  const addAtStart = () => {
    setSegs(prev => {
      const next = [...prev];
      const [a, b] = splitSeg(startPt, next[0]);
      next.splice(0, 1, a, b);
      return next;
    });
  };

  // ── Ajouter à la fin (dernier segment) ────────────────────────────
  const addAtEnd = () => {
    setSegs(prev => {
      const next = [...prev];
      const idx  = next.length - 1;
      const p0   = next.length > 1 ? next[idx - 1].end : startPt;
      const [a, b] = splitSeg(p0, next[idx]);
      next.splice(idx, 1, a, b);
      return next;
    });
  };

  // ── Ajouter avant l'ancre sélectionnée ────────────────────────────
  const addBefore = () => {
    setSegs(prev => {
      const next = [...prev];
      const i    = selected as number;
      const p0   = i === 0 ? startPt : next[i - 1].end;
      const [a, b] = splitSeg(p0, next[i]);
      next.splice(i, 1, a, b);
      return next;
    });
  };

  // ── Ajouter après l'ancre sélectionnée ────────────────────────────
  const addAfter = () => {
    setSegs(prev => {
      const next    = [...prev];
      const i       = selected as number;
      const nextIdx = (i + 1) % next.length;
      const p0      = next[i].end;
      const [a, b]  = splitSeg(p0, next[nextIdx]);
      next.splice(nextIdx, 1, a, b);
      return next;
    });
  };

  // ── Supprimer l'ancre sélectionnée ────────────────────────────────
  const removePoint = () => {
    if (selected === null || selected === 'start' || segs.length <= 3) return;
    const i = selected as number;
    setSegs(prev => {
      const next = [...prev];
      if (i === 0) {
        next.splice(0, 1);
      } else {
        const merged: Seg = { cp1: next[i-1].cp1, cp2: next[i].cp2, end: next[i].end };
        next.splice(i - 1, 2, merged);
      }
      return next;
    });
    setSelected(null);
  };

  // ── Reset Bézier : remet les 2 poignées de l'ancre sélectionnée ───
  // cp2 de seg[i] + cp1 de seg[i+1] → positions 2/3 et 1/3 linéaires
  const resetBezier = () => {
    if (selected === null || selected === 'start') return;
    const i = selected as number;
    setSegs(prev => {
      const next = prev.map(s => ({...s, cp1:{...s.cp1}, cp2:{...s.cp2}, end:{...s.end}}));
      const anchor  = next[i].end;
      const prevAnchor = i === 0 ? startPt : next[i - 1].end;
      const nextSeg    = next[(i + 1) % next.length];
      const nextAnchor = nextSeg.end;
      // cp2 of seg[i]: 2/3 from prevAnchor to anchor (linear exit)
      next[i].cp2 = {
        x: Math.round(prevAnchor.x + (anchor.x - prevAnchor.x) * 2/3),
        y: Math.round(prevAnchor.y + (anchor.y - prevAnchor.y) * 2/3),
      };
      // cp1 of seg[i+1]: 1/3 from anchor to nextAnchor (linear entry)
      const ni = (i + 1) % next.length;
      next[ni].cp1 = {
        x: Math.round(anchor.x + (nextAnchor.x - anchor.x) * 1/3),
        y: Math.round(anchor.y + (nextAnchor.y - anchor.y) * 1/3),
      };
      return next;
    });
  };

  // ── Copy ───────────────────────────────────────────────────────────
  const copyData = () => {
    const out = `=== SVG PATH ===\n${pathStr}\n\n=== JSON ===\n${JSON.stringify({ start: startPt, segs }, null, 2)}`;
    navigator.clipboard.writeText(out).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const { scale, ox, oy } = dim;
  const displayW = WORLD_W * scale;
  const displayH = WORLD_H * scale;
  const ptR = 12, cpR = 8;
  const canRemove = selected !== null && selected !== 'start' && segs.length > 3;

  // ── Panel via portal → truly fixed, immune to GSAP transform ──────
  const panel = createPortal(
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 99999,
      background: 'rgba(8,8,8,0.95)', border: '1px solid #e8002d',
      borderRadius: 10, padding: '16px 18px', fontFamily: 'monospace',
      fontSize: 12, color: '#fff', display: 'flex', flexDirection: 'column', gap: 10,
      minWidth: 240, boxShadow: '0 0 30px rgba(232,0,45,0.2)',
    }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ color:'#e8002d', fontWeight:'bold', letterSpacing:2, fontSize:11 }}>
          DEV2 · PATH EDITOR
        </span>
        <button onClick={() => setShowInfo(v => !v)} title="Comment ça marche ?" style={{
          width:22, height:22, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.3)',
          background: showInfo ? 'rgba(232,0,45,0.3)' : 'rgba(255,255,255,0.08)',
          color:'#fff', cursor:'pointer', fontSize:12, fontWeight:'bold',
          fontFamily:'serif', lineHeight:'20px', padding:0,
        }}>i</button>
      </div>

      {/* Info panel */}
      {showInfo && (
        <div style={{
          background:'rgba(255,255,255,0.05)', borderRadius:6,
          padding:'10px 12px', fontSize:11, lineHeight:1.75, color:'rgba(255,255,255,0.8)',
        }}>
          <b style={{color:'#4af'}}>● Ancre bleue / START</b><br/>
          Drag = déplace le point + ses handles.<br/>
          Clic = sélectionne pour +/−.<br/><br/>
          <b style={{color:'rgba(0,255,100,0.9)'}}>● cp1 vert</b> = handle d'entrée de la courbe<br/>
          <b style={{color:'rgba(255,160,0,0.9)'}}>● cp2 orange</b> = handle de sortie de la courbe<br/><br/>
          <b style={{color:'#1d6fa4'}}>+ Au début / À la fin</b> (sans sélection) : coupe le 1er ou dernier segment.<br/>
          <b style={{color:'#1d6fa4'}}>+ Avant / Après</b> (ancre sélectionnée) : coupe le segment qui arrive ou part de l'ancre.<br/>
          <b style={{color:'#7c3aed'}}>↺ Reset Bézier</b> : remet cp1 + cp2 de l'ancre sélectionnée à une position linéaire neutre.<br/><br/>
          <b style={{color:'#fff'}}>− Supprimer</b> : fusionne le segment sélectionné avec le précédent. Min 3 points.
        </div>
      )}

      {/* Legend */}
      <div style={{ display:'flex', flexDirection:'column', gap:5, fontSize:11 }}>
        <span><span style={{color:'#4af'}}>●</span> Ancre — drag (déplace) / clic (sélect)</span>
        <span><span style={{color:'rgba(0,255,100,0.9)'}}>●</span> cp1 — entrée courbe</span>
        <span><span style={{color:'rgba(255,160,0,0.9)'}}>●</span> cp2 — sortie courbe</span>
      </div>

      {/* Selected indicator */}
      <div style={{
        fontSize: 11, padding: '6px 10px', borderRadius: 6,
        background: selected !== null ? 'rgba(232,0,45,0.15)' : 'rgba(255,255,255,0.05)',
        color: selected !== null ? '#ff6680' : 'rgba(255,255,255,0.35)',
      }}>
        {selected === null        ? 'Aucun point — clic sur une ancre pour sélectionner'
          : selected === 'start' ? 'START sélectionné — clic ailleurs pour désélectionner'
          : `Ancre ${(selected as number) + 1}/${segs.length} — clic ailleurs pour désélectionner`}
      </div>

      {/* Boutons contextuels */}
      {selected === null && (
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={addAtStart} style={btnStyle('#1d6fa4')}>+ Au début</button>
          <button onClick={addAtEnd}   style={btnStyle('#22c55e')}>+ À la fin</button>
        </div>
      )}

      {selected === 'start' && (
        <div style={{
          fontSize:11, color:'rgba(255,160,0,0.85)', lineHeight:1.6,
          padding:'6px 10px', borderRadius:6, background:'rgba(255,160,0,0.08)',
        }}>
          🔒 Point départ verrouillé.<br/>
          Déplaçable par drag uniquement.
        </div>
      )}

      {typeof selected === 'number' && (
        <>
          <div style={{ display:'flex', gap:8 }}>
            <button onClick={addBefore} style={btnStyle('#1d6fa4')}>+ Avant</button>
            <button onClick={addAfter}  style={btnStyle('#22c55e')}>+ Après</button>
            <button onClick={removePoint} disabled={!canRemove} style={btnStyle('#e8002d', !canRemove)}>
              − Suppr.
            </button>
          </div>
          <button onClick={resetBezier} style={{ ...btnStyle('#7c3aed'), flex:'none' }}>
            ↺ Reset Bézier (cp1 + cp2)
          </button>
        </>
      )}

      <div style={{ height:1, background:'rgba(255,255,255,0.08)' }} />

      {/* Copy */}
      <button onClick={copyData} style={{ ...btnStyle(copied ? '#22c55e' : '#555'), flex:'none' }}>
        {copied ? '✓ Copié dans le presse-papier' : 'Copy path data →'}
      </button>
      <div style={{ fontSize:10, color:'rgba(255,255,255,0.3)', lineHeight:1.5 }}>
        Colle le résultat dans le chat
      </div>
    </div>,
    document.body
  );

  return (
    <div style={{ position:'absolute', inset:0, background:'#111', overflow:'hidden' }}>
      {panel}

      {/* ── Scene ─────────────────────────────────────────────────── */}
      <div style={{ position:'absolute', left:ox, top:oy, width:displayW, height:displayH }}>

        <img src="/racetrack/track.jpg" alt="" draggable={false}
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'fill' }} />

        {CARS.map((cfg, i) => (
          <img key={i} ref={el => { carsRef.current[i] = el; }} src={cfg.src} alt="" draggable={false}
            style={{
              position:'absolute', top:0, left:0,
              width: 72 / scale, height:'auto',
              offsetDistance:'0%', transformOrigin:'center center',
              pointerEvents:'none', filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.8))',
            }} />
        ))}

        {/* ── Editable SVG ───────────────────────────────────────── */}
        <svg
          ref={svgRef}
          width={displayW} height={displayH}
          viewBox={`0 0 ${WORLD_W} ${WORLD_H}`}
          style={{ position:'absolute', inset:0, overflow:'visible', cursor: dragging.current ? 'grabbing' : 'crosshair' }}
          onMouseMove={onMouseMove}
          onMouseUp={onSvgUp}
          onMouseLeave={onSvgUp}
          onClick={onSvgClick}
        >
          {/* Live path */}
          <path d={pathStr} fill="none" stroke="rgba(255,80,0,0.85)" strokeWidth={8} strokeDasharray="28 10" />

          {/* Handle lines */}
          {segs.map((seg, i) => {
            const prev = i === 0 ? startPt : segs[i-1].end;
            return (
              <g key={i}>
                <line x1={prev.x}    y1={prev.y}    x2={seg.cp1.x} y2={seg.cp1.y}
                  stroke="rgba(0,255,100,0.45)" strokeWidth={2} strokeDasharray="8 4" />
                <line x1={seg.end.x} y1={seg.end.y} x2={seg.cp2.x} y2={seg.cp2.y}
                  stroke="rgba(255,160,0,0.45)" strokeWidth={2} strokeDasharray="8 4" />
              </g>
            );
          })}

          {/* cp1 handles (green) */}
          {segs.map((seg, i) => (
            <circle key={`cp1-${i}`} cx={seg.cp1.x} cy={seg.cp1.y} r={cpR}
              fill="rgba(0,255,100,0.85)" stroke="#fff" strokeWidth={2} style={{ cursor:'grab' }}
              onMouseDown={onAnchorDown(`cp1_${i}`)}
              onMouseUp={() => { dragging.current = null; }} />
          ))}

          {/* cp2 handles (orange) */}
          {segs.map((seg, i) => (
            <circle key={`cp2-${i}`} cx={seg.cp2.x} cy={seg.cp2.y} r={cpR}
              fill="rgba(255,160,0,0.85)" stroke="#fff" strokeWidth={2} style={{ cursor:'grab' }}
              onMouseDown={onAnchorDown(`cp2_${i}`)}
              onMouseUp={() => { dragging.current = null; }} />
          ))}

          {/* START anchor */}
          <g>
            <circle cx={startPt.x} cy={startPt.y} r={ptR}
              fill={selected === 'start' ? '#e8002d' : 'white'}
              stroke={selected === 'start' ? '#fff' : '#e8002d'} strokeWidth={3}
              style={{ cursor:'grab' }}
              onMouseDown={onAnchorDown('start')}
              onMouseUp={onAnchorUp('start')}
              onClick={e => e.stopPropagation()} />
            <text x={startPt.x} y={startPt.y - ptR - 6} textAnchor="middle"
              fill="white" fontSize={18} fontWeight="bold" style={{ pointerEvents:'none' }}>START</text>
          </g>

          {/* Segment anchors */}
          {segs.map((seg, i) => (
            <g key={`end-${i}`}>
              {selected === i && (
                <circle cx={seg.end.x} cy={seg.end.y} r={ptR + 7}
                  fill="none" stroke="#e8002d" strokeWidth={2} opacity={0.6} />
              )}
              <circle cx={seg.end.x} cy={seg.end.y} r={ptR}
                fill={selected === i ? '#e8002d' : '#4af'} stroke="#fff" strokeWidth={2}
                style={{ cursor:'grab' }}
                onMouseDown={onAnchorDown(`end_${i}`)}
                onMouseUp={onAnchorUp(i)}
                onClick={e => e.stopPropagation()} />
              <text x={seg.end.x} y={seg.end.y - ptR - 5} textAnchor="middle"
                fill={selected === i ? '#e8002d' : '#4af'} fontSize={16} fontWeight="bold"
                style={{ pointerEvents:'none' }}>{i + 1}</text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// NORMAL MODE
// ═════════════════════════════════════════════════════════════════════════
export default function RaceTrack() {
  if (IS_DEV2) return <Dev2Editor />;

  const TRACK_PATH = buildPath(INIT_START, INIT_SEGS);

  const worldRef    = useRef<HTMLDivElement>(null);
  const svgPathRef  = useRef<SVGPathElement>(null);
  const carsRef     = useRef<(HTMLImageElement | null)[]>([null, null, null]);
  const camRef      = useRef({ x: 0, y: 0, initialised: false });
  const progressRef = useRef(0);
  const rafRef      = useRef<number>(0);

  useEffect(() => {
    carsRef.current.forEach(car => {
      if (!car) return;
      car.style.setProperty('offset-path', `path('${TRACK_PATH}')`);
      car.style.setProperty('offset-rotate', 'auto -90deg');
      car.style.setProperty('offset-distance', '0%');
    });
  }, []);

  const updateCars = useCallback((progress: number) => {
    carsRef.current.forEach((car, i) => {
      if (!car) return;
      const overtake = Math.sin(progress * Math.PI * 2 + i * 2.1) * 0.025;
      const d = wrap(progress + CARS[i].baseOffset + overtake);
      car.style.setProperty('offset-distance', (d * 100).toFixed(2) + '%');
    });
  }, []);

  const tick = useCallback(() => {
    const svg   = svgPathRef.current;
    const world = worldRef.current;
    if (svg && world) {
      const pt = svg.getPointAtLength(progressRef.current * svg.getTotalLength());
      const targetX = -(pt.x - window.innerWidth  / 2);
      const targetY = -(pt.y - window.innerHeight / 2);
      if (!camRef.current.initialised) {
        camRef.current.x = targetX;
        camRef.current.y = targetY;
        camRef.current.initialised = true;
      } else {
        camRef.current.x += (targetX - camRef.current.x) * CAM_LERP;
        camRef.current.y += (targetY - camRef.current.y) * CAM_LERP;
      }
      world.style.transform = `translate(${camRef.current.x.toFixed(1)}px,${camRef.current.y.toFixed(1)}px)`;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { progress } = (e as CustomEvent<{ progress: number }>).detail;
      progressRef.current = progress;
      updateCars(progress);
    };
    window.addEventListener('data-anim-progress', handler);
    return () => window.removeEventListener('data-anim-progress', handler);
  }, [updateCars]);

  return (
    <div className="rt-viewport">
      <svg aria-hidden style={{ position:'absolute', width:0, height:0, overflow:'visible', pointerEvents:'none' }}>
        <path ref={svgPathRef} d={TRACK_PATH} fill="none" />
      </svg>
      <div className="rt-world" ref={worldRef} style={{ width: WORLD_W, height: WORLD_H }}>
        <img className="rt-track" src="/racetrack/track.jpg" alt="" draggable={false} />
        {CARS.map((cfg, i) => (
          <img key={i} ref={el => { carsRef.current[i] = el; }}
            className={`rt-car rt-car--${i+1}`} src={cfg.src} alt="" draggable={false} />
        ))}
      </div>
      <div className="rt-scroll-hint">
        <span>Scroll pour faire courir les voitures</span>
        <div className="rt-scroll-arrow" />
      </div>
    </div>
  );
}
