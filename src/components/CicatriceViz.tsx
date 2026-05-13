import React, { useState, useMemo, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useInView } from 'motion/react';
import rawData from '../../data/crashs/f1_accidents_1950_2025.json';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Incident {
  numero: string;
  pilote: string;
  ecurie: string;
  tours: string;
  raison: string;
  depart: string;
}

interface RaceEntry {
  annee: number;
  course: string;
  url: string;
  nb_incidents: number;
  incidents: Incident[];
}

interface DotInfo {
  year: number;
  race: string;
  incident: Incident;
}

interface ColData {
  year: number;
  x: number;
  color: string;
  dots: DotInfo[];
  races: number;
  rate: number;
}

type ViewMode = 'absolut' | 'rate';

// ── Static data from Jolpica API ───────────────────────────────────────────────

const RACE_COUNTS: Record<number, number> = {
  1980: 14, 1981: 15, 1982: 16, 1983: 15, 1984: 16, 1985: 16,
  1986: 16, 1987: 16, 1988: 16, 1989: 16, 1990: 16, 1991: 16,
  1992: 16, 1993: 16, 1994: 16, 1995: 17, 1996: 16, 1997: 17,
  1998: 16, 1999: 16, 2000: 17, 2001: 17, 2002: 17, 2003: 16,
  2004: 18, 2005: 19, 2006: 18, 2007: 17, 2008: 18, 2009: 17,
  2010: 19, 2011: 19, 2012: 20, 2013: 19, 2014: 19, 2015: 19,
  2016: 21, 2017: 20, 2018: 21, 2019: 21, 2020: 17, 2021: 22,
  2022: 22, 2023: 22, 2024: 24, 2025: 24,
};

// Years with known data gaps (too few incidents to be credible)
const DATA_GAP_YEARS = new Set([1981, 1982, 1983, 1984, 1985, 2002, 2005, 2008]);

// ── Color ──────────────────────────────────────────────────────────────────────

function dotColor(year: number): string {
  if (year <= 1994) return '#e8002d';
  const t = Math.min(1, (year - 1994) / 31);
  const r = Math.round(232 + t * 23);
  const g = Math.round(t * 255);
  const b = Math.round(45 + t * 210);
  const a = +(1 - t * 0.72).toFixed(2);
  return `rgba(${r},${g},${b},${a})`;
}

function reasonLabel(raison: string): string {
  const r = raison.toLowerCase();
  if (r.includes('collision')) return 'Collision';
  if (r.includes('spun') || r.includes('spin')) return 'Tête-à-queue';
  if (r.includes('accident')) return 'Accident';
  if (r.includes('damage')) return 'Dommages';
  return raison;
}

// ── Layout ────────────────────────────────────────────────────────────────────

const VW        = 1600;
const PAD_X     = 72;
const DOT_R     = 5;
const DOT_GAP   = 7.5;
const YEAR_FROM = 1980;
const YEAR_TO   = 2025;
const TICKS     = [1980, 1984, 1988, 1992, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022, 2025];

function toX(year: number): number {
  return PAD_X + ((year - YEAR_FROM) / (YEAR_TO - YEAR_FROM)) * (VW - PAD_X * 2);
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function CicatriceViz() {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.08 });

  const [mode,    setMode]    = useState<ViewMode>('absolut');
  const [tooltip, setTooltip] = useState<{ sx: number; sy: number; info: DotInfo } | null>(null);
  const [hovYear, setHovYear] = useState<number | null>(null);
  const [hovRateCol,   setHovRateCol]   = useState<number | null>(null);
  const [rateTooltipPos, setRateTooltipPos] = useState<{ x: number; y: number } | null>(null);

  // ── Process data ────────────────────────────────────────────────────────────

  const { cols, total, maxCount, worstYear, maxRate, safestYear, worstRateYear } = useMemo(() => {
    const data = rawData as RaceEntry[];
    const byYear = new Map<number, DotInfo[]>();

    for (const race of data) {
      if (race.annee < YEAR_FROM) continue;
      if (!race.incidents?.length) continue;
      if (!byYear.has(race.annee)) byYear.set(race.annee, []);
      for (const inc of race.incidents) {
        byYear.get(race.annee)!.push({ year: race.annee, race: race.course, incident: inc });
      }
    }

    let maxCount = 0, worstYear = 1992;
    let maxRate = 0, worstRateYear = 1992;
    let minRate = Infinity, safestYear = 2019;

    byYear.forEach((dots, y) => {
      if (dots.length > maxCount) { maxCount = dots.length; worstYear = y; }
      const races = RACE_COUNTS[y] ?? 16;
      const rate = dots.length / races;
      const credible = !DATA_GAP_YEARS.has(y) && dots.length >= 8;
      if (credible) {
        if (rate > maxRate) { maxRate = rate; worstRateYear = y; }
        // Safest year only in modern era (post-1994 safety revolution)
        if (y > 1994 && rate < minRate) { minRate = rate; safestYear = y; }
      }
    });

    const total = Array.from(byYear.values()).reduce((s, d) => s + d.length, 0);

    const cols: ColData[] = Array.from(byYear.entries())
      .sort(([a], [b]) => a - b)
      .map(([year, dots]) => {
        const races = RACE_COUNTS[year] ?? 16;
        return { year, dots, x: toX(year), color: dotColor(year), races, rate: dots.length / races };
      });

    return { cols, total, maxCount, worstYear, maxRate, safestYear, worstRateYear };
  }, []);

  const colH   = maxCount * DOT_GAP + 16;
  const svgH   = colH + 44;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const onDotEnter  = useCallback((info: DotInfo, e: React.MouseEvent) => {
    setHovYear(info.year);
    setTooltip({ sx: e.clientX, sy: e.clientY, info });
  }, []);
  const onDotMove   = useCallback((e: React.MouseEvent) => {
    setTooltip(p => p ? { ...p, sx: e.clientX, sy: e.clientY } : null);
  }, []);
  const onDotLeave  = useCallback(() => { setHovYear(null); setTooltip(null); }, []);

  // ── Stats by mode ───────────────────────────────────────────────────────────

  const statsRows = mode === 'absolut'
    ? [
        { label: 'Accidents enregistrés',  value: total.toLocaleString() },
        { label: 'Année record (brut)',    value: `${worstYear} — ${maxCount} accidents` },
        { label: 'Collisions (sur total)', value: '566 / 1 102' },
        { label: 'Rupture historique',     value: 'Imola · 1er mai 1994', accent: true },
      ]
    : [
        { label: 'Pire taux normalisé',    value: `${worstRateYear} — ${cols.find(c=>c.year===worstRateYear)?.rate.toFixed(2)} acc./course` },
        { label: 'Meilleur taux (post-94)',value: `${safestYear} — ${cols.find(c=>c.year===safestYear)?.rate.toFixed(2)} acc./course` },
        { label: 'Réduction depuis 1992',  value: `−${Math.round((1 - (cols.find(c=>c.year===2024)?.rate ?? 1) / maxRate) * 100)}%`, accent: true },
        { label: 'Source',                 value: 'Jolpica / Ergast API' },
      ];

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div
      ref={ref}
      style={{
        width: '100%', height: '100%',
        background: '#050505',
        display: 'flex', flexDirection: 'column',
        padding: '48px 64px 36px',
        boxSizing: 'border-box',
        fontFamily: "'Formula1', sans-serif",
        color: '#e0ddd8',
        overflow: 'hidden', position: 'relative',
      }}
    >

      {/* Corner accent */}
      <div style={{
        position: 'absolute', top: 0, left: 0,
        width: 36, height: 36,
        borderTop: '1px solid #e8002d', borderLeft: '1px solid #e8002d',
        opacity: 0.5, pointerEvents: 'none',
      }} />

      {/* BG glow */}
      <div style={{
        position: 'absolute', left: -60, top: -60, width: 280, height: 280,
        background: 'radial-gradient(circle, rgba(232,0,45,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', marginBottom: 24, flexShrink: 0,
      }}>
        <div>
          <div style={{
            fontSize: 10, letterSpacing: '4px', color: '#e8002d',
            textTransform: 'uppercase', fontWeight: 700, marginBottom: 10,
          }}>
            05 · Données brutes
          </div>
          <h2 style={{
            fontSize: 'clamp(26px, 2.8vw, 44px)', fontWeight: 700,
            lineHeight: 1, letterSpacing: '-1px', margin: 0, color: '#fff',
          }}>
            La Cicatrice
          </h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={mode}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.22 }}
              style={{
                fontSize: 10, letterSpacing: '2px',
                color: 'rgba(255,255,255,0.55)',
                marginTop: 10, textTransform: 'uppercase',
              }}
            >
              {mode === 'absolut'
                ? `${total.toLocaleString()} accidents enregistrés · chaque point = un pilote retiré · 1980 — 2025`
                : <>Accidents normalisés par nombre de courses · source <a href="https://api.jolpi.ca" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Jolpica API</a></>}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Right: toggle + legend */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, flexShrink: 0 }}>

          {/* Toggle */}
          <div style={{
            display: 'flex', gap: 2,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 3, padding: 3,
          }}>
            {(['absolut', 'rate'] as ViewMode[]).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  fontSize: 8, letterSpacing: '2px',
                  textTransform: 'uppercase', fontFamily: "'Formula1', sans-serif",
                  padding: '7px 16px', borderRadius: 2, cursor: 'pointer', border: 'none',
                  background: mode === m ? '#e8002d' : 'transparent',
                  color: mode === m ? '#fff' : 'rgba(255,255,255,0.35)',
                  transition: 'all 0.18s ease',
                  fontWeight: mode === m ? 700 : 400,
                }}
              >
                {m === 'absolut' ? 'Incidents bruts' : 'Taux / course'}
              </button>
            ))}
          </div>

          {/* Color legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 8, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
              Ère danger.
            </span>
            <div style={{
              width: 64, height: 2,
              background: 'linear-gradient(to right, #e8002d, rgba(255,255,255,0.3))',
              borderRadius: 1,
            }} />
            <span style={{ fontSize: 8, letterSpacing: '1.5px', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
              Moderne
            </span>
          </div>
        </div>
      </div>

      {/* ── SVG ─────────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
        <svg viewBox={`0 0 ${VW} ${svgH}`} style={{ width: '100%', height: '100%' }}>
          <defs>
            <filter id="cic-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Baseline */}
          <line x1={PAD_X} y1={colH + 2} x2={VW - PAD_X} y2={colH + 2}
            stroke="rgba(255,255,255,0.05)" strokeWidth={0.5} />

          {/* Grid + annotations */}
          {TICKS.map(y => {
            const x = toX(y);
            const is94 = y === 1994;
            const is18 = y === 2018;
            return (
              <React.Fragment key={y}>
                <line x1={x} y1={0} x2={x} y2={colH + 2}
                  stroke={is94 ? 'rgba(232,0,45,0.9)' : is18 ? 'rgba(200,169,110,0.85)' : 'rgba(255,255,255,0.04)'}
                  strokeWidth={is94 || is18 ? 1.5 : 0.5}
                  strokeDasharray={is94 || is18 ? '4 8' : undefined}
                />
                {is94 && (
                  <text x={x + 8} y={24} fill="rgba(232,0,45,0.9)"
                    fontSize={14} fontFamily="'Formula1', sans-serif" letterSpacing={2}>
                    IMOLA 1994
                  </text>
                )}
                {is18 && (
                  <text x={x + 8} y={24} fill="rgba(200,169,110,0.85)"
                    fontSize={14} fontFamily="'Formula1', sans-serif" letterSpacing={2}>
                    HALO 2018
                  </text>
                )}
              </React.Fragment>
            );
          })}

          {/* ── MODE ABSOLUT : dot columns ── */}
          {mode === 'absolut' && (
            <>
              {hovYear !== null && (() => {
                const col = cols.find(c => c.year === hovYear);
                if (!col) return null;
                return <rect x={col.x - 8} y={0} width={16} height={colH + 2}
                  fill="rgba(255,255,255,0.025)" rx={2} style={{ pointerEvents: 'none' }} />;
              })()}

              {cols.map((col, ci) => (
                <motion.g key={`dot-${col.year}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                  transition={{ duration: 0.6, delay: inView ? ci * 0.018 : 0, ease: [0.16, 1, 0.3, 1] }}
                  filter={hovYear === col.year && col.year <= 1994 ? 'url(#cic-glow)' : undefined}
                >
                  {col.dots.map((info, di) => (
                    <circle key={di}
                      cx={col.x} cy={colH - di * DOT_GAP} r={DOT_R}
                      fill={col.color} style={{ cursor: 'crosshair' }}
                      onMouseEnter={e => onDotEnter(info, e)}
                      onMouseMove={onDotMove}
                      onMouseLeave={onDotLeave}
                    />
                  ))}
                </motion.g>
              ))}
            </>
          )}

          {/* ── MODE RATE : bar chart ── */}
          {mode === 'rate' && (() => {
            const colStep = (VW - PAD_X * 2) / (YEAR_TO - YEAR_FROM);
            const barW    = Math.max(16, colStep * 0.68);
            const hitW    = colStep; // full column width as hit area

            return cols.map((col, ci) => {
              const uncertain = DATA_GAP_YEARS.has(col.year);
              const barH      = col.rate > 0 ? (col.rate / maxRate) * (colH - 24) : 2;
              const isHov     = hovRateCol === col.year;

              return (
                <motion.g
                  key={`rate-${col.year}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                  transition={{ duration: 0.55, delay: inView ? ci * 0.016 : 0, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* ── Wide invisible hit area (full column) ── */}
                  <rect
                    x={col.x - hitW / 2} y={0}
                    width={hitW} height={colH + 2}
                    fill="rgba(0,0,0,0.001)"
                    pointerEvents="all"
                    style={{ cursor: 'crosshair' }}
                    onMouseEnter={(e) => { setHovRateCol(col.year); setRateTooltipPos({ x: e.clientX, y: e.clientY }); }}
                    onMouseMove={(e)  => setRateTooltipPos({ x: e.clientX, y: e.clientY })}
                    onMouseLeave={()  => { setHovRateCol(null); setRateTooltipPos(null); }}
                  />

                  {/* ── Bar fill ── */}
                  <motion.rect
                    x={col.x - barW / 2}
                    width={barW}
                    fill={col.color}
                    rx={1}
                    opacity={uncertain ? (isHov ? 0.35 : 0.2) : (isHov ? 0.9 : 0.6)}
                    initial={{ height: 0, y: colH }}
                    animate={inView
                      ? { height: barH, y: colH - barH }
                      : { height: 0, y: colH }
                    }
                    transition={{ duration: 0.7, delay: inView ? ci * 0.016 : 0, ease: [0.16, 1, 0.3, 1] }}
                    style={{ pointerEvents: 'none' }}
                  />

                  {/* ── Top cap line ── */}
                  <motion.line
                    x1={col.x - barW / 2} x2={col.x + barW / 2}
                    y1={colH - barH} y2={colH - barH}
                    stroke={col.color}
                    strokeWidth={isHov ? 2 : 1}
                    strokeDasharray={uncertain ? '3 3' : undefined}
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: uncertain ? 0.35 : 1 } : { opacity: 0 }}
                    transition={{ duration: 0.3, delay: inView ? ci * 0.016 + 0.4 : 0 }}
                    style={{ pointerEvents: 'none' }}
                  />

                  {/* ── Active column highlight ── */}
                  {isHov && (
                    <rect
                      x={col.x - hitW / 2} y={0}
                      width={hitW} height={colH + 2}
                      fill="rgba(255,255,255,0.03)"
                      rx={2}
                      style={{ pointerEvents: 'none' }}
                    />
                  )}
                </motion.g>
              );
            });
          })()}

          {/* ── Y-axis absolut mode ── */}
          {mode === 'absolut' && (() => {
            const step = Math.ceil(maxCount / 5);
            const ticks = Array.from({ length: Math.ceil(maxCount / step) + 1 }, (_, i) => i * step).filter(v => v <= maxCount);
            return (
              <g>
                <text
                  x={PAD_X - 46} y={colH / 2}
                  fill="rgba(255,255,255,0.32)"
                  fontSize={8.5} textAnchor="middle"
                  fontFamily="'Formula1', sans-serif" letterSpacing={1.5}
                  transform={`rotate(-90, ${PAD_X - 46}, ${colH / 2})`}
                >
                  ACCIDENTS / SAISON
                </text>
                {ticks.map(v => {
                  const ty = colH - v * DOT_GAP;
                  return (
                    <React.Fragment key={v}>
                      <line x1={PAD_X - 5} y1={ty} x2={PAD_X} y2={ty}
                        stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
                      <text x={PAD_X - 9} y={ty + 3}
                        fill="rgba(255,255,255,0.38)" fontSize={8} textAnchor="end"
                        fontFamily="'Formula1', sans-serif">
                        {v}
                      </text>
                    </React.Fragment>
                  );
                })}
              </g>
            );
          })()}

          {/* ── Y-axis rate mode ── */}
          {mode === 'rate' && (() => {
            const step = maxRate > 2 ? 0.5 : 0.25;
            const ticks: number[] = [];
            for (let v = 0; v <= maxRate * 1.02; v += step) {
              ticks.push(Math.round(v * 100) / 100);
            }
            const yForRate = (r: number) => colH - (r / maxRate) * (colH - 24);
            return (
              <g>
                <text
                  x={PAD_X - 46} y={colH / 2}
                  fill="rgba(255,255,255,0.32)"
                  fontSize={8.5} textAnchor="middle"
                  fontFamily="'Formula1', sans-serif" letterSpacing={1.5}
                  transform={`rotate(-90, ${PAD_X - 46}, ${colH / 2})`}
                >
                  ACC. / COURSE
                </text>
                {ticks.map(v => {
                  const ty = yForRate(v);
                  return (
                    <React.Fragment key={v}>
                      <line x1={PAD_X - 5} y1={ty} x2={PAD_X} y2={ty}
                        stroke="rgba(255,255,255,0.12)" strokeWidth={0.5} />
                      <text x={PAD_X - 9} y={ty + 3}
                        fill="rgba(255,255,255,0.38)" fontSize={8} textAnchor="end"
                        fontFamily="'Formula1', sans-serif">
                        {v.toFixed(1)}
                      </text>
                    </React.Fragment>
                  );
                })}
              </g>
            );
          })()}

          {/* X-axis labels */}
          {TICKS.map(y => (
            <text key={`lbl-${y}`} x={toX(y)} y={svgH - 8}
              fill={y === 1994 ? 'rgba(232,0,45,0.75)' : 'rgba(255,255,255,0.50)'}
              fontSize={9} textAnchor="middle"
              fontFamily="'Formula1', sans-serif" letterSpacing={0.5}>
              {y}
            </text>
          ))}
        </svg>
      </div>

      {/* ── Stats row ───────────────────────────────────────────────────────── */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        marginTop: 12, paddingTop: 16,
        borderTop: '1px solid rgba(255,255,255,0.05)',
        flexShrink: 0,
      }}>
        <AnimatePresence mode="wait">
          {statsRows.map((s, i) => (
            <motion.div key={`${mode}-${i}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, delay: i * 0.04 }}
              style={{
                paddingLeft: i > 0 ? 24 : 0,
                borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.05)' : undefined,
              }}
            >
              <div style={{
                fontSize: 7.5, letterSpacing: '2.5px',
                color: 'rgba(255,255,255,0.22)',
                textTransform: 'uppercase', marginBottom: 6,
              }}>
                {s.label}
              </div>
              <div style={{
                fontSize: 13, fontWeight: 700,
                color: s.accent ? '#e8002d' : '#e0ddd8',
                letterSpacing: '0.3px',
              }}>
                {s.value}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Watermark */}
      <div style={{
        position: 'absolute', bottom: 20, right: 24,
        fontSize: 72, fontWeight: 700,
        color: 'rgba(232,0,45,0.04)',
        lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
      }}>
        05
      </div>

      {/* ── Tooltip mode rate (portal → hors section GSAP) ─────────────────── */}
      {mode === 'rate' && hovRateCol !== null && rateTooltipPos && (() => {
        const col = cols.find(c => c.year === hovRateCol);
        if (!col) return null;
        const uncertain = DATA_GAP_YEARS.has(col.year);
        return createPortal(
          <div style={{
            position: 'fixed',
            left: rateTooltipPos.x + 16,
            top: Math.max(12, rateTooltipPos.y - 130),
            background: 'rgba(4,4,6,0.98)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderLeft: `3px solid ${col.color}`,
            borderRadius: 2, padding: '14px 18px',
            pointerEvents: 'none', zIndex: 9999,
            fontFamily: "'Formula1', sans-serif",
            minWidth: 200,
            boxShadow: '0 16px 48px rgba(0,0,0,0.9)',
          }}>
            <div style={{ fontSize: 9, letterSpacing: '3px', color: col.year <= 1994 ? '#e8002d' : 'rgba(200,169,110,0.8)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 10 }}>
              Saison {col.year}
            </div>
            {uncertain ? (
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', fontStyle: 'italic' }}>
                Données partielles
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
                  <span style={{ fontSize: 36, fontWeight: 700, color: '#fff', letterSpacing: '-1px', lineHeight: 1 }}>
                    {col.rate.toFixed(2)}
                  </span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '1px' }}>
                    acc./course
                  </span>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { label: 'Accidents', value: col.dots.length.toString() },
                    { label: 'Courses',   value: `${col.races} GP` },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: 9, letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
                        {row.label}
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'rgba(224,221,216,0.8)' }}>
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>,
          document.body
        );
      })()}

      {/* ── Tooltip mode absolut (portal → hors section GSAP) ───────────────── */}
      {mode === 'absolut' && tooltip && createPortal(
        <div style={{
          position: 'fixed',
          left: tooltip.sx + 16,
          top: Math.max(12, tooltip.sy - 150),
          background: 'rgba(4,4,6,0.98)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderLeft: `3px solid ${tooltip.info.year <= 1994 ? '#e8002d' : 'rgba(255,255,255,0.3)'}`,
          borderRadius: 2, padding: '12px 16px',
          pointerEvents: 'none', zIndex: 9999,
          fontFamily: "'Formula1', sans-serif",
          minWidth: 240,
          boxShadow: '0 16px 48px rgba(0,0,0,0.9)',
        }}>
          <div style={{
            fontSize: 8, letterSpacing: '3px',
            color: tooltip.info.year <= 1994 ? '#e8002d' : 'rgba(200,169,110,0.8)',
            textTransform: 'uppercase', fontWeight: 700, marginBottom: 9,
          }}>
            {tooltip.info.year} · {tooltip.info.race}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#fff', marginBottom: 3, letterSpacing: '-0.3px' }}>
            {tooltip.info.incident.pilote}
          </div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 12, letterSpacing: '0.5px' }}>
            #{tooltip.info.incident.numero} · {tooltip.info.incident.ecurie}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
            {[
              { label: 'Cause',  value: reasonLabel(tooltip.info.incident.raison) },
              { label: 'Tour',   value: tooltip.info.incident.tours === '0' ? 'Avant le départ' : `Tour ${tooltip.info.incident.tours}` },
              { label: 'Grille', value: tooltip.info.incident.depart ? `P${tooltip.info.incident.depart}` : '—' },
            ].map(row => (
              <div key={row.label} style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'baseline', marginBottom: 6,
              }}>
                <span style={{ fontSize: 8, letterSpacing: '2px', color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase' }}>
                  {row.label}
                </span>
                <span style={{ fontSize: 10, color: 'rgba(224,221,216,0.65)', maxWidth: '60%', textAlign: 'right' }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
