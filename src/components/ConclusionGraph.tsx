import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { Zap, Skull, TrendingUp, TrendingDown } from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const DECADES = ['1950s', '1960s', '1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];
const N = DECADES.length;

interface SeriesDef {
  id: string;
  label: string;
  sublabel: string;
  unit: string;
  color: string;
  glow: string; // r,g,b for rgba()
  Icon: React.ElementType;
  values: number[];
  milestones: string[];
  inverted?: boolean; // down = good (ex: mortalité)
}

const SERIES: SeriesDef[] = [
  {
    id: 'speed',
    label: 'Vitesse max',
    sublabel: 'Moy. qualifs Monza',
    unit: 'km/h',
    color: '#e8002d',
    glow: '232,0,45',
    Icon: Zap,
    // Jolpica (api.jolpi.ca) pour 1990s–2020s · archives historiques pour 1950s–1980s
    // 1990s: Alesi Ferrari 1994 pole 1:23.844 → 249 km/h · 1995 pole 1:24.462 → 247 km/h
    // 2000s: M. Schumacher Ferrari 2003 pole 1:20.963 → 258 km/h · 2005 pole 1:20.878 → 258 km/h
    // 2010s: Hamilton 2010 1:21.962 → 254 km/h · Leclerc 2019 1:19.307 → 263 km/h (record)
    // 2020s: Sainz Ferrari 2023 pole 1:20.294 → 259 km/h · 2022 pole 1:20.161 → 260 km/h
    values: [195, 215, 237, 243, 249, 258, 254, 260],
    milestones: [
      'Fangio · Mercedes W196 · ~195 km/h moy. Monza',
      'Clark · Lotus 25 · ~215 km/h · Monza 1963',
      'Peterson · layout actuel (5.793 km) depuis 1972',
      'Piquet · Brabham BT52 turbo · ~243 km/h · 1983',
      'Alesi · Ferrari · pole 1:23.844 → 249 km/h · 1994',
      'Schumacher · Ferrari · pole 1:20.963 → 258 km/h · 2003',
      'Leclerc · Ferrari · pole 1:19.307 → 263 km/h · 2019',
      'Sainz · Ferrari · pole 1:20.294 → 259 km/h · 2023',
    ],
  },
  {
    id: 'mortality',
    label: 'Décès / décennie',
    sublabel: 'En compétition F1',
    unit: 'décès',
    color: '#e8e5e0',
    glow: '232,229,224',
    Icon: Skull,
    inverted: true,
    // Décès en compétition F1 par décennie (courses + qualifs WC) :
    // 1950s : 5 (Fagioli, Marimon, Musso, Collins, Lewis-Evans)
    // 1960s : 8 (Bristow, Stacey, von Trips, de Beaufort, Taylor, Bandini, Clark, Schlesser) ← pic
    // 1970s : 8 (Courage, Rindt, Williamson, Cevert, Koinigg, Donohue, Pryce, Peterson)
    // 1980s : 2 (Villeneuve, Paletti) · 1990s : 2 (Ratzenberger, Senna)
    // 2000s : 0 · 2010s : 1 (Bianchi) · 2020s : 0
    values: [5, 8, 8, 2, 2, 0, 1, 0],
    milestones: [
      '5 décès · Musso, Collins, Lewis-Evans · 1958',
      '8 décès · decade la plus meurtrière · von Trips, Clark',
      '8 décès · Cevert, Williamson, Peterson · Monza 1978',
      '2 décès · Villeneuve, Paletti · 1982',
      '2 décès · Ratzenberger & Senna · Imola 1994',
      '0 décès · HANS device généralisé · 2003',
      '1 décès · Jules Bianchi · Suzuka 2014',
      '0 décès · Grosjean survive · Bahreïn 2020',
    ],
  },
];

// ─── SVG Geometry ─────────────────────────────────────────────────────────────

const VW = 800, VH = 330;
const P = { t: 16, r: 20, b: 42, l: 20 };
const GW = VW - P.l - P.r;
const GH = VH - P.t - P.b;

function normalize(vals: number[]): number[] {
  const mn = Math.min(...vals), mx = Math.max(...vals), rng = mx - mn || 1;
  return vals.map(v => (v - mn) / rng);
}

function calcPts(vals: number[]) {
  return normalize(vals).map((v, i) => ({
    x: P.l + (i / (N - 1)) * GW,
    y: P.t + GH - v * GH,
  }));
}

function buildCurve(pts: { x: number; y: number }[]): string {
  if (!pts.length) return '';
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cx = pts[i].x + (pts[i + 1].x - pts[i].x) * 0.5;
    d += ` C ${cx} ${pts[i].y} ${cx} ${pts[i + 1].y} ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  return d;
}

function buildFill(pts: { x: number; y: number }[]): string {
  if (!pts.length) return '';
  const bot = P.t + GH;
  let d = `M ${pts[0].x} ${bot} L ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cx = pts[i].x + (pts[i + 1].x - pts[i].x) * 0.5;
    d += ` C ${cx} ${pts[i].y} ${cx} ${pts[i + 1].y} ${pts[i + 1].x} ${pts[i + 1].y}`;
  }
  d += ` L ${pts[pts.length - 1].x} ${bot} Z`;
  return d;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ConclusionGraph() {
  const [hovSeries, setHovSeries] = useState<string | null>(null);
  const [hovPt, setHovPt] = useState<{ sid: string; idx: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const allPts   = useMemo(() => Object.fromEntries(SERIES.map(s => [s.id, calcPts(s.values)])),   []);
  const allCurves = useMemo(() => Object.fromEntries(SERIES.map(s => [s.id, buildCurve(allPts[s.id])])), [allPts]);
  const allFills  = useMemo(() => Object.fromEntries(SERIES.map(s => [s.id, buildFill(allPts[s.id])])),  [allPts]);

  // Opacity helpers
  const lineOp  = (id: string) => hovSeries ? (hovSeries === id ? 1 : 0.1) : 0.82;
  const fillOp  = (id: string) => hovSeries ? (hovSeries === id ? 0.45 : 0.02) : 0.15;
  const dotOp   = (id: string, i: number) => {
    if (!hovSeries) return 0.75;
    if (hovSeries !== id) return 0.05;
    return hovPt?.sid === id && hovPt?.idx === i ? 1 : 0.55;
  };

  // Trend calculation (vs previous decade)
  const getTrend = (s: SeriesDef, idx: number) => {
    if (idx === 0) return null;
    const prev = s.values[idx - 1], curr = s.values[idx];
    if (prev === 0) return null;
    const pct = ((curr - prev) / Math.abs(prev)) * 100;
    return { pct: Math.abs(pct), up: pct >= 0 };
  };

  // Tooltip geometry
  const TW = 300, TH = 160;
  const tSeries = hovPt ? SERIES.find(s => s.id === hovPt.sid) : null;
  const tPt     = hovPt && tSeries ? allPts[tSeries.id][hovPt.idx] : null;
  let tx = 0, ty = 0;
  if (tPt) {
    tx = Math.min(Math.max(tPt.x - TW / 2, P.l), VW - P.r - TW);
    ty = tPt.y < 148 ? tPt.y + 18 : tPt.y - TH - 16;
  }

  return (
    <div ref={ref}>
    <div style={{
      background: 'rgba(4,4,6,0.96)',
      backdropFilter: 'blur(32px)',
      WebkitBackdropFilter: 'blur(32px)',
      border: '1px solid rgba(255,255,255,0.055)',
      borderLeft: '3px solid #e8002d',
      borderRadius: 3,
      padding: '24px 24px 16px',
      fontFamily: "'Formula1', 'Arial Narrow', Arial, sans-serif",
      color: '#e0ddd8',
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
    }}>

      {/* Corner accents */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 36, height: 36,
        borderTop: '1px solid #e8002d', borderLeft: '1px solid #e8002d', opacity: 0.5, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, right: 0, width: 36, height: 36,
        borderBottom: '1px solid rgba(255,255,255,0.07)', borderRight: '1px solid rgba(255,255,255,0.07)',
        opacity: 0.5, pointerEvents: 'none' }} />

      {/* BG glow top-left */}
      <div style={{ position: 'absolute', left: -70, top: -70, width: 200, height: 200,
        background: 'radial-gradient(circle, rgba(232,0,45,0.09) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 }}>
        <span style={{ fontSize: 10, letterSpacing: '4px', color: '#e8002d', textTransform: 'uppercase', fontWeight: 700 }}>
          07 · Synthèse
        </span>
        <span style={{ fontSize: 10, letterSpacing: '2px', color: 'rgba(255,255,255,0.55)' }}>1950 — 2026</span>
      </div>

      <h3 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.1, marginBottom: 3, letterSpacing: '-0.5px', color: '#fff' }}>
        Plus vite, plus en vie
      </h3>
      <p style={{ fontSize: 9, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.60)', marginBottom: 13, textTransform: 'uppercase' }}>
        Vitesse moy. Monza · Décès en compétition · F1 1950–2026
      </p>
      <div style={{ height: 1, background: 'linear-gradient(to right, rgba(232,0,45,0.55), transparent)', marginBottom: 8 }} />

      {/* ── SVG Chart ── */}
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        style={{ width: '100%', overflow: 'visible', display: 'block' }}
        onMouseLeave={() => { setHovSeries(null); setHovPt(null); }}
      >
        <defs>
          {SERIES.map(s => (
            <React.Fragment key={s.id}>
              <linearGradient id={`cg-fill-${s.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor={s.color} stopOpacity="0.22" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0" />
              </linearGradient>
              <filter id={`cg-glow-${s.id}`} x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </React.Fragment>
          ))}
        </defs>

        {/* Horizontal grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
          <line key={i}
            x1={P.l} y1={P.t + v * GH} x2={P.l + GW} y2={P.t + v * GH}
            stroke="rgba(255,255,255,0.04)" strokeWidth={1}
          />
        ))}

        {/* Vertical grid (decades) */}
        {DECADES.map((_, i) => {
          const x = P.l + (i / (N - 1)) * GW;
          return (
            <line key={i} x1={x} y1={P.t} x2={x} y2={P.t + GH}
              stroke="rgba(255,255,255,0.025)" strokeWidth={1} strokeDasharray="3 6"
            />
          );
        })}

        {/* Gradient fills */}
        {SERIES.map((s, si) => (
          <motion.path key={`fill-${s.id}`}
            d={allFills[s.id]}
            fill={`url(#cg-fill-${s.id})`}
            style={{ pointerEvents: 'none' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: inView ? fillOp(s.id) : 0 }}
            transition={{ duration: 0.5, delay: inView ? 1.6 + si * 0.18 : 0 }}
          />
        ))}

        {/* Lines (animated draw) */}
        {SERIES.map((s, si) => (
          <g key={`line-${s.id}`}>
            <motion.path
              d={allCurves[s.id]}
              stroke={s.color}
              strokeWidth={hovSeries === s.id ? 3 : 2}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ pointerEvents: 'none' }}
              filter={hovSeries === s.id ? `url(#cg-glow-${s.id})` : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: inView ? 1 : 0,
                opacity: inView ? lineOp(s.id) : 0,
              }}
              transition={{
                pathLength: { duration: 1.7, ease: 'easeInOut', delay: si * 0.2 },
                opacity: { duration: 0.25 },
              }}
            />
            {/* Invisible wide path for hover detection */}
            <path
              d={allCurves[s.id]}
              stroke="transparent"
              strokeWidth={20}
              fill="none"
              style={{ cursor: 'crosshair' }}
              onMouseEnter={() => setHovSeries(s.id)}
              onMouseLeave={() => { if (!hovPt || hovPt.sid !== s.id) setHovSeries(null); }}
            />
          </g>
        ))}

        {/* Dots */}
        {SERIES.map(s =>
          allPts[s.id].map((p, idx) => {
            const active = hovPt?.sid === s.id && hovPt?.idx === idx;
            return (
              <g key={`${s.id}-${idx}`}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => { setHovSeries(s.id); setHovPt({ sid: s.id, idx }); }}
                onMouseLeave={() => { setHovSeries(null); setHovPt(null); }}
              >
                {/* Hit area */}
                <circle cx={p.x} cy={p.y} r={15} fill="transparent" />

                {/* Glow ring on active */}
                <AnimatePresence>
                  {active && (
                    <motion.circle cx={p.x} cy={p.y} r={11} fill={s.color}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 0.22, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                      style={{ filter: 'blur(7px)', pointerEvents: 'none' }}
                    />
                  )}
                </AnimatePresence>

                {/* Visible dot */}
                <motion.circle cx={p.x} cy={p.y} r={4}
                  fill={s.color}
                  stroke="rgba(4,4,6,0.9)"
                  strokeWidth={1.5}
                  style={{ pointerEvents: 'none', transformBox: 'fill-box' as any, transformOrigin: 'center' }}
                  animate={{
                    scale: active ? 1.5 : 1,
                    opacity: inView ? dotOp(s.id, idx) : 0,
                  }}
                  transition={{
                    scale: { type: 'spring', stiffness: 420, damping: 22 },
                    opacity: { duration: 0.2 },
                  }}
                />
              </g>
            );
          })
        )}

        {/* ── Left Y-axis: Vitesse (km/h) ── */}
        {(() => {
          const mn = 195, mx = 260;
          const ticks = [200, 220, 240, 260];
          const yFor = (v: number) => P.t + GH - ((v - mn) / (mx - mn)) * GH;
          return (
            <g>
              <text
                x={P.l - 36} y={P.t + GH / 2}
                fill="rgba(232,0,45,0.6)" fontSize={7} textAnchor="middle"
                fontFamily="'Formula1', sans-serif" letterSpacing={1.5}
                transform={`rotate(-90, ${P.l - 36}, ${P.t + GH / 2})`}
              >KM/H</text>
              {ticks.map(v => (
                <React.Fragment key={v}>
                  <line x1={P.l - 4} y1={yFor(v)} x2={P.l} y2={yFor(v)}
                    stroke="rgba(232,0,45,0.3)" strokeWidth={0.5} />
                  <text x={P.l - 7} y={yFor(v) + 3}
                    fill="rgba(232,0,45,0.7)" fontSize={8} textAnchor="end"
                    fontFamily="'Formula1', sans-serif">
                    {v}
                  </text>
                </React.Fragment>
              ))}
            </g>
          );
        })()}

        {/* ── Right Y-axis: Décès ── */}
        {(() => {
          const mn = 0, mx = 8;
          const ticks = [0, 2, 4, 6, 8];
          const yFor = (v: number) => P.t + GH - ((v - mn) / (mx - mn)) * GH;
          return (
            <g>
              <text
                x={P.l + GW + 36} y={P.t + GH / 2}
                fill="rgba(232,229,224,0.55)" fontSize={7} textAnchor="middle"
                fontFamily="'Formula1', sans-serif" letterSpacing={1.5}
                transform={`rotate(90, ${P.l + GW + 36}, ${P.t + GH / 2})`}
              >DÉCÈS</text>
              {ticks.map(v => (
                <React.Fragment key={v}>
                  <line x1={P.l + GW} y1={yFor(v)} x2={P.l + GW + 4} y2={yFor(v)}
                    stroke="rgba(232,229,224,0.25)" strokeWidth={0.5} />
                  <text x={P.l + GW + 7} y={yFor(v) + 3}
                    fill="rgba(232,229,224,0.65)" fontSize={8} textAnchor="start"
                    fontFamily="'Formula1', sans-serif">
                    {v}
                  </text>
                </React.Fragment>
              ))}
            </g>
          );
        })()}

        {/* X-axis decade labels */}
        {DECADES.map((d, i) => (
          <text key={i}
            x={P.l + (i / (N - 1)) * GW} y={VH - 5}
            textAnchor="middle"
            fill="rgba(255,255,255,0.55)"
            fontSize={8.5}
            letterSpacing={0.8}
            fontFamily="'Formula1', sans-serif"
          >
            {d}
          </text>
        ))}

        {/* ── Tooltip ── */}
        <AnimatePresence>
          {hovPt && tSeries && tPt && (() => {
            const trend = getTrend(tSeries, hovPt.idx);
            const TrendIcon = trend?.up ? TrendingUp : TrendingDown;
            // Pour les séries inversées (mortalité), down = good
            const trendGood = tSeries.inverted ? !trend?.up : trend?.up;
            const trendColor = trendGood ? '#00ff87' : '#e8002d';

            return (
              <foreignObject key={`tt-${hovPt.sid}-${hovPt.idx}`}
                x={tx} y={ty}
                width={TW} height={TH + 32}
                style={{ overflow: 'visible', pointerEvents: 'none' }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.88, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.88, y: -3 }}
                  transition={{ duration: 0.13 }}
                  style={{
                    background: 'rgba(4,4,6,0.99)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderLeft: `3px solid ${tSeries.color}`,
                    borderRadius: 2,
                    padding: '14px 16px',
                    boxShadow: `0 16px 48px rgba(0,0,0,0.85), 0 0 28px rgba(${tSeries.glow},0.22)`,
                    fontFamily: "'Formula1', Arial, sans-serif",
                    pointerEvents: 'none',
                    width: TW,
                  }}
                >
                  {/* Series label + icon */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7 }}>
                    <tSeries.Icon size={12} color={tSeries.color} />
                    <span style={{
                      fontSize: 9, letterSpacing: 2.5, color: tSeries.color,
                      textTransform: 'uppercase', fontWeight: 700,
                    }}>
                      {tSeries.label} · {tSeries.sublabel}
                    </span>
                  </div>

                  {/* Value + trend */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <div>
                      <span style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-0.8px', lineHeight: 1 }}>
                        {tSeries.values[hovPt.idx]}
                      </span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginLeft: 5 }}>
                        {tSeries.unit}
                      </span>
                    </div>
                    {trend && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <TrendIcon size={12} color={trendColor} />
                        <span style={{ fontSize: 12, fontWeight: 700, color: trendColor }}>
                          {trend.up ? '+' : '−'}{trend.pct.toFixed(0)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Decade */}
                  <div style={{
                    fontSize: 10, letterSpacing: 2,
                    color: 'rgba(255,255,255,0.60)', textTransform: 'uppercase', marginBottom: 9,
                  }}>
                    {DECADES[hovPt.idx]}
                  </div>

                  {/* Milestone text */}
                  <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.07)',
                    paddingTop: 7,
                    fontSize: 11,
                    lineHeight: 1.5,
                    color: 'rgba(220,218,214,0.85)',
                  }}>
                    {tSeries.milestones[hovPt.idx]}
                  </div>
                </motion.div>
              </foreignObject>
            );
          })()}
        </AnimatePresence>
      </svg>

      {/* ── Legend ── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '5px 18px',
        marginTop: 8, paddingTop: 9,
        borderTop: '1px solid rgba(255,255,255,0.05)',
        alignItems: 'center', justifyContent: 'space-between',
      }}>
        {SERIES.map(s => {
          const active = !hovSeries || hovSeries === s.id;
          return (
            <button key={s.id}
              onMouseEnter={() => setHovSeries(s.id)}
              onMouseLeave={() => setHovSeries(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'none', border: 'none', padding: '3px 0',
                cursor: 'pointer',
                opacity: active ? 1 : 0.22,
                transition: 'opacity 0.2s ease',
              }}
            >
              <s.Icon size={9} color={s.color} />
              <div style={{ width: 16, height: 2, background: s.color, borderRadius: 1 }} />
              <span style={{ fontSize: 7.5, letterSpacing: 2, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase' }}>
                {s.label}
              </span>
            </button>
          );
        })}
        <span style={{ fontSize: 7, letterSpacing: 1.5, color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
          Accidents normalisés par nombre de courses · source <a href="https://api.jolpi.ca" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Jolpica API</a>
        </span>
      </div>

      {/* Watermark */}
      <div style={{
        position: 'absolute', bottom: 14, right: 18,
        fontSize: 64, fontWeight: 700,
        color: 'rgba(232,0,45,0.05)',
        lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
      }}>
        07
      </div>
    </div>
    </div>
  );
}
