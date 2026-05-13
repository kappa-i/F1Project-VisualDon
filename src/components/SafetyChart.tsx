import React, { useState } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

// Décès de pilotes lors d'événements F1 (courses + qualifications)
// Source : Wikipedia — Liste des accidents mortels en Formule 1
// Note 1950s : inclut l'Indianapolis 500 (au calendrier F1 1950–1960), qui compte 8 décès à lui seul
const DATA = [
  { decade: '1950s', deces: 15, milestone: 'Aucune protection · Indianapolis 500 au calendrier F1 · Fagioli, Marimon, Ascari, Musso, Collins, Lewis-Evans…' },
  { decade: '1960s', deces: 12, milestone: 'Premières glissières Armco · Von Trips (1961), Bandini — Monaco 1967, Schlesser — France 1968' },
  { decade: '1970s', deces: 10, milestone: 'J. Stewart force la FIA à agir · Nomex + médecins permanents · Rindt, Williamson, Cevert, Peterson' },
  { decade: '1980s', deces: 4,  milestone: 'Monocoque carbone McLaren MP4/1 (1981) · Depailler, Villeneuve, Paletti, De Angelis' },
  { decade: '1990s', deces: 2,  milestone: 'Imola 1994 · Ratzenberger + Senna · révolution réglementaire FIA : 30+ règles en 6 mois' },
  { decade: '2000s', deces: 0,  milestone: 'HANS obligatoire (2003) · barrières TecPro · premier championnat complet sans décès' },
  { decade: '2010s', deces: 1,  milestone: 'Jules Bianchi · accident Suzuka octobre 2014 · décédé juillet 2015 · Halo homologué 2018' },
  { decade: '2020s', deces: 0,  milestone: 'Halo sauve Grosjean à Bahreïn (2020) et Zhou à Silverstone (2022) · structures d\'absorption maximales' },
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

  return (
    <div style={{
      background: 'rgba(5, 5, 5, 0.96)',
      border: '1px solid rgba(232,0,45,0.3)',
      borderLeft: `3px solid ${deaths === 0 ? '#c8a96e' : '#e8002d'}`,
      borderRadius: '2px',
      padding: '16px 20px',
      fontFamily: "'Formula1', sans-serif",
      minWidth: '240px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    }}>
      <div style={{
        fontSize: '9px',
        letterSpacing: '3px',
        color: deaths === 0 ? '#c8a96e' : '#e8002d',
        textTransform: 'uppercase',
        marginBottom: '10px',
        fontWeight: 700,
      }}>
        {label}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>
          Décès pilotes
        </span>
        <span style={{
          fontSize: '28px',
          fontWeight: 700,
          color: deaths === 0 ? '#c8a96e' : '#e8002d',
          letterSpacing: '-0.5px',
        }}>
          {deaths === 0 ? '0' : deaths}
        </span>
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
              tick={{
                fontFamily: "'Formula1', sans-serif",
                fontSize: 8,
                fill: 'rgba(255,255,255,0.25)',
              }}
              tickLine={false}
              axisLine={false}
              domain={[0, 16]}
              ticks={[0, 4, 8, 12, 16]}
              width={52}
              label={{
                value: 'Nb. décès',
                angle: -90,
                position: 'insideLeft',
                offset: 12,
                style: {
                  fontFamily: "'Formula1', sans-serif",
                  fontSize: 8,
                  fill: 'rgba(255,255,255,0.25)',
                  letterSpacing: '1px',
                  textAnchor: 'middle',
                },
              }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            />

            {/* Ligne de référence Imola 1994 */}
            <ReferenceLine
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

            {/* Barres décès */}
            <Bar
              dataKey="deces"
              fill="url(#barGrad)"
              radius={[2, 2, 0, 0]}
              maxBarSize={32}
              onMouseEnter={(_, idx) => setActiveBar(idx)}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Légende */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '14px', height: '3px', backgroundColor: '#e8002d', borderRadius: '2px' }} />
          <span style={{ fontSize: '8px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
            Décès en course · qualifications
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
          Bilan F1 · 1994 — 2026
        </span>
        <span style={{
          fontSize: '17px',
          fontWeight: 700,
          color: '#c8a96e',
          letterSpacing: '0.5px',
        }}>
          1 décès depuis Imola 1994
        </span>
      </div>

      {/* Source */}
      <div style={{
        marginTop: '12px',
        fontSize: '8px',
        letterSpacing: '1px',
        color: 'rgba(255,255,255,0.5)',
      }}>
        Source : <a href="https://fr.wikipedia.org/wiki/Liste_des_accidents_mortels_en_Formule_1" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Wikipedia</a> — Liste des accidents mortels en Formule 1
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
