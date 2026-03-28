import React, { useState } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ReferenceLine,
} from 'recharts';

const DATA = [
  { decade: '1950s', deces: 14, securite: 0,  milestone: 'Aucune protection réelle' },
  { decade: '1960s', deces: 18, securite: 5,  milestone: 'Débuts des glissières Armco' },
  { decade: '1970s', deces: 10, securite: 22, milestone: 'Armco + combinaisons ignifugées' },
  { decade: '1980s', deces: 4,  securite: 48, milestone: 'Monocoque carbone (1981)' },
  { decade: '1990s', deces: 3,  securite: 62, milestone: 'Commission sécurité FIA post-Imola' },
  { decade: '2000s', deces: 0,  securite: 78, milestone: 'HANS device obligatoire (2003)' },
  { decade: '2010s', deces: 1,  securite: 88, milestone: 'Halo introduit (2018)' },
  { decade: '2020s', deces: 0,  securite: 97, milestone: 'Halo sauve Grosjean — 220 km/h (2020)' },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) return null;

  const row = DATA.find(d => d.decade === label);
  const deaths = payload.find(p => p.name === 'deces')?.value ?? 0;
  const safety = payload.find(p => p.name === 'securite')?.value ?? 0;

  return (
    <div style={{
      background: 'rgba(5, 5, 5, 0.96)',
      border: '1px solid rgba(232,0,45,0.3)',
      borderLeft: '3px solid #e8002d',
      borderRadius: '2px',
      padding: '16px 20px',
      fontFamily: "'Formula1', sans-serif",
      minWidth: '240px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    }}>
      <div style={{
        fontSize: '9px',
        letterSpacing: '3px',
        color: '#e8002d',
        textTransform: 'uppercase',
        marginBottom: '10px',
        fontWeight: 700,
      }}>
        {label}
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginBottom: '12px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
            Décès pilotes
          </span>
          <span style={{
            fontSize: '20px',
            fontWeight: 700,
            color: deaths === 0 ? '#c8a96e' : '#e8002d',
            letterSpacing: '-0.5px',
          }}>
            {deaths}
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
            Indice sécurité
          </span>
          <span style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#c8a96e',
            letterSpacing: '-0.5px',
          }}>
            {safety}%
          </span>
        </div>
      </div>

      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        paddingTop: '10px',
        fontSize: '10px',
        lineHeight: 1.6,
        color: 'rgba(224,221,216,0.55)',
        letterSpacing: '0.3px',
      }}>
        {row?.milestone}
      </div>
    </div>
  );
};

export default function SafetyChart() {
  const [activeBar, setActiveBar] = useState<number | null>(null);

  return (
    <div style={{
      background: 'rgba(5, 5, 5, 0.94)',
      backdropFilter: 'blur(28px)',
      WebkitBackdropFilter: 'blur(28px)',
      border: '1px solid rgba(255,255,255,0.06)',
      borderLeft: '3px solid #e8002d',
      borderRadius: '3px',
      padding: '36px 32px 28px',
      fontFamily: "'Formula1', sans-serif",
      color: '#e0ddd8',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Coin accentué */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '40px', height: '40px',
        borderTop: '1px solid #e8002d',
        borderLeft: '1px solid #e8002d',
        opacity: 0.55,
      }} />

      {/* Lueur */}
      <div style={{
        position: 'absolute',
        left: '-80px', top: '-80px',
        width: '240px', height: '240px',
        background: 'radial-gradient(circle, #e8002d14 0%, transparent 68%)',
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
        <span style={{
          fontSize: '11px',
          letterSpacing: '4px',
          color: '#e8002d',
          textTransform: 'uppercase',
          fontWeight: 700,
        }}>
          Ère 06
        </span>
        <span style={{
          fontSize: '11px',
          letterSpacing: '2px',
          color: 'rgba(255,255,255,0.28)',
        }}>
          1950 — 2026
        </span>
      </div>

      {/* Titre */}
      <h3 style={{
        fontSize: '26px',
        fontWeight: 700,
        lineHeight: 1.15,
        marginBottom: '6px',
        letterSpacing: '-0.8px',
        color: '#ffffff',
      }}>
        Le Bilan
      </h3>
      <p style={{
        fontSize: '11px',
        letterSpacing: '1.5px',
        color: 'rgba(255,255,255,0.3)',
        marginBottom: '24px',
        textTransform: 'uppercase',
      }}>
        Décès en course par décennie · F1 1950–2026
      </p>

      {/* Séparateur */}
      <div style={{
        height: '1px',
        background: 'linear-gradient(to right, #e8002d80, transparent)',
        marginBottom: '24px',
      }} />

      {/* Chart */}
      <div style={{ width: '100%', height: '220px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={DATA}
            margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
            onMouseLeave={() => setActiveBar(null)}
          >
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e8002d" stopOpacity={1} />
                <stop offset="100%" stopColor="#6b091d" stopOpacity={0.8} />
              </linearGradient>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#c8a96e" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#c8a96e" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#c8a96e" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#c8a96e" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="rgba(255,255,255,0.04)"
              strokeDasharray="0"
            />

            <XAxis
              dataKey="decade"
              tick={{
                fontFamily: "'Formula1', sans-serif",
                fontSize: 9,
                fill: 'rgba(255,255,255,0.35)',
                letterSpacing: 1,
              }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
              tickMargin={8}
            />

            <YAxis
              yAxisId="deaths"
              tick={{
                fontFamily: "'Formula1', sans-serif",
                fontSize: 8,
                fill: 'rgba(255,255,255,0.25)',
              }}
              tickLine={false}
              axisLine={false}
              domain={[0, 22]}
              ticks={[0, 5, 10, 15, 20]}
              width={32}
            />

            <YAxis
              yAxisId="safety"
              orientation="right"
              tick={{
                fontFamily: "'Formula1', sans-serif",
                fontSize: 8,
                fill: 'rgba(200,169,110,0.4)',
              }}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              ticks={[0, 50, 100]}
              tickFormatter={(v) => `${v}%`}
              width={32}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            />

            {/* Ligne de référence Imola 1994 */}
            <ReferenceLine
              yAxisId="deaths"
              x="1990s"
              stroke="rgba(232,0,45,0.3)"
              strokeDasharray="4 4"
              label={{
                value: 'Imola 1994',
                position: 'insideTopRight',
                fontFamily: "'Formula1', sans-serif",
                fontSize: 8,
                fill: 'rgba(232,0,45,0.55)',
                letterSpacing: 1,
              }}
            />

            {/* Aire indice sécurité */}
            <Area
              yAxisId="safety"
              type="monotone"
              dataKey="securite"
              stroke="url(#lineGrad)"
              strokeWidth={1.5}
              fill="url(#areaGrad)"
              dot={false}
              activeDot={{
                r: 4,
                fill: '#c8a96e',
                stroke: 'rgba(5,5,5,0.8)',
                strokeWidth: 2,
              }}
            />

            {/* Barres décès */}
            <Bar
              yAxisId="deaths"
              dataKey="deces"
              fill="url(#barGrad)"
              radius={[2, 2, 0, 0]}
              maxBarSize={28}
              onMouseEnter={(_, idx) => setActiveBar(idx)}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Légende */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '24px',
        marginTop: '16px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '14px', height: '3px', background: 'url(#barGrad)', backgroundColor: '#e8002d', borderRadius: '2px' }} />
          <span style={{ fontSize: '8px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
            Décès
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '14px', height: '2px', background: '#c8a96e', borderRadius: '1px', opacity: 0.7 }} />
          <span style={{ fontSize: '8px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
            Indice sécurité
          </span>
        </div>
      </div>

      {/* Badge stat */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        background: '#e8002d10',
        border: '1px solid #e8002d28',
        borderRadius: '2px',
        marginTop: '20px',
      }}>
        <span style={{
          fontSize: '8px',
          letterSpacing: '2.5px',
          color: 'rgba(255,255,255,0.3)',
          textTransform: 'uppercase',
        }}>
          Réduction de la mortalité
        </span>
        <span style={{
          fontSize: '17px',
          fontWeight: 700,
          color: '#c8a96e',
          letterSpacing: '0.5px',
        }}>
          −100% depuis 1994
        </span>
      </div>

      {/* Numéro filigrane */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        right: '24px',
        fontSize: '72px',
        fontWeight: 700,
        color: '#e8002d08',
        lineHeight: 1,
        userSelect: 'none',
      }}>
        06
      </div>
    </div>
  );
}
