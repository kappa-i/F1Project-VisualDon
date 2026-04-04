import React from 'react';

/* ─── Helpers ───────────────────────────────────────────────────────────── */

const TEAM_COLOR: Record<string, string> = {
  VER: '#3671C6',
  PIA: '#FF8000',
  RUS: '#27F4D2',
  SAI: '#64C4FF',
  NOR: '#FF8000',
  LEC: '#E8002D',
  HAM: '#27F4D2',
};

const TIRE_CFG: Record<string, { bg: string; fg: string }> = {
  M: { bg: '#FFD700', fg: '#111' },
  H: { bg: '#ffffff', fg: '#111' },
  S: { bg: '#E8002D', fg: '#fff' },
};

/* ── Atoms ──────────────────────────────────────────────────────────────── */

const F1Logo: React.FC<{ inverted?: boolean; size?: number }> = ({ inverted, size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" style={{ flexShrink: 0 }}>
    <rect width="32" height="32" rx="7" fill={inverted ? '#fff' : '#E8002D'} />
    <text
      x="16" y="22"
      textAnchor="middle"
      fill={inverted ? '#E8002D' : '#fff'}
      fontSize="14"
      fontWeight="900"
      fontFamily="Arial Black, sans-serif"
      letterSpacing="-0.5"
    >
      F1
    </text>
  </svg>
);

const RaceTag: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <span style={{
    fontSize: 8,
    letterSpacing: '0.18em',
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: 3,
    border: `1px solid ${dark ? 'rgba(0,0,0,0.22)' : 'rgba(255,255,255,0.2)'}`,
    color: dark ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.45)',
  }}>
    RACE
  </span>
);

const CardHeader: React.FC<{ dark?: boolean }> = ({ dark }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
    <F1Logo inverted={dark} />
    <RaceTag dark={dark} />
  </div>
);

const TireChip: React.FC<{ compound: string }> = ({ compound }) => {
  const t = TIRE_CFG[compound] ?? TIRE_CFG.M;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 18, height: 18, borderRadius: '50%',
      background: t.bg, color: t.fg,
      fontSize: 8, fontWeight: 700, flexShrink: 0,
    }}>
      {compound}
    </span>
  );
};

const TeamDot: React.FC<{ driver: string }> = ({ driver }) => (
  <span style={{
    display: 'inline-block', width: 10, height: 10, borderRadius: '50%',
    background: TEAM_COLOR[driver] ?? '#888', flexShrink: 0,
  }} />
);

/* ── Cards ──────────────────────────────────────────────────────────────── */

const cardBase: React.CSSProperties = {
  background: 'rgba(18,18,18,0.94)',
  backdropFilter: 'blur(18px)',
  WebkitBackdropFilter: 'blur(18px)',
  borderRadius: 14,
  padding: '12px 14px',
  border: '1px solid rgba(255,255,255,0.07)',
  fontFamily: 'inherit',
  color: '#fff',
  overflow: 'hidden',
  boxSizing: 'border-box',
};

/* Card 1 — Starting Grid */
const StartingGridCard: React.FC = () => (
  <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', gap: 8 }}>
    {/* header */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <F1Logo />
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.2 }}>Saudi Arabian GP</div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>Tomorrow, 00:00</div>
      </div>
    </div>
    {/* section label */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em' }}>
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <rect x="0.5" y="0.5" width="3.5" height="3.5" rx="0.5" stroke="currentColor"/>
        <rect x="6" y="0.5" width="3.5" height="3.5" rx="0.5" stroke="currentColor"/>
        <rect x="0.5" y="6" width="3.5" height="3.5" rx="0.5" stroke="currentColor"/>
        <rect x="6" y="6" width="3.5" height="3.5" rx="0.5" stroke="currentColor"/>
      </svg>
      Starting Grid
    </div>
    {/* drivers */}
    {[
      { pos: 1, name: 'Max Verstappen', team: 'Red Bull', color: '#3671C6' },
      { pos: 2, name: 'Oscar Piastri',  team: 'Mclaren',  color: '#FF8000' },
      { pos: 3, name: 'George Russell', team: 'Mercedes', color: '#27F4D2' },
    ].map(d => (
      <div key={d.pos} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', width: 10, textAlign: 'right' }}>{d.pos}.</span>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: d.color, flexShrink: 0, display: 'inline-block' }} />
        <span style={{ fontSize: 10, flex: 1 }}>{d.name}</span>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>{d.team}</span>
      </div>
    ))}
    {/* footer */}
    <div style={{
      display: 'flex', alignItems: 'center', gap: 7,
      paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)',
      marginTop: 2,
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: '50%',
        border: '1.5px solid rgba(255,255,255,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="8" height="8" viewBox="0 0 8 8" fill="white">
          <path d="M2 1l5 3-5 3V1z"/>
        </svg>
      </div>
      <span style={{ fontSize: 10 }}>Watch Live</span>
      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginLeft: 'auto' }}>1h 29m : 15s</span>
    </div>
  </div>
);

/* Card 2 — Watch Live */
const WatchLiveCard: React.FC = () => (
  <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <F1Logo />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700 }}>Saudi Arabian GP</div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>Watch Live · 1h 29m: 15s</div>
      </div>
      <div style={{
        width: 26, height: 26, borderRadius: '50%',
        background: '#E8002D',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="8" height="9" viewBox="0 0 8 9" fill="white">
          <path d="M1.5 1L7 4.5 1.5 8V1z"/>
        </svg>
      </div>
    </div>
    {/* avatars */}
    <div style={{ display: 'flex', gap: 6 }}>
      {['#3671C6','#FF8000','#27F4D2','#E8002D','#FF8000','#64C4FF'].map((c, i) => (
        <div key={i} style={{
          width: 28, height: 28, borderRadius: '50%',
          background: `linear-gradient(135deg, ${c}88, ${c})`,
          border: `1.5px solid rgba(255,255,255,0.12)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, fontWeight: 700, flexShrink: 0, color: '#fff',
        }}>
          {['VER','PIA','RUS','LEC','NOR','SAI'][i]}
        </div>
      ))}
    </div>
  </div>
);

/* Card 3 — Green Flag */
const GreenFlagCard: React.FC = () => (
  <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', gap: 6 }}>
    <CardHeader />
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#00D04E', lineHeight: 1.1, letterSpacing: '0.02em' }}>
          GREEN<br />FLAG
        </div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>Track Clear</div>
      </div>
      <div style={{
        width: 40, height: 40, borderRadius: 8,
        background: '#00D04E',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
          <path d="M3 1v16M3 1h12l-3 5.5L15 13H3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  </div>
);

/* Card 4 — Safety Car */
const SafetyCarCard: React.FC = () => (
  <div style={{ ...cardBase, background: '#E8B800', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: 6 }}>
    <CardHeader dark />
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
      <div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#111', lineHeight: 1.15, letterSpacing: '0.01em' }}>
          SAFETY<br />CAR
        </div>
        <div style={{ fontSize: 9, color: 'rgba(0,0,0,0.5)', marginTop: 4 }}>Lap Incident · Lap 1/50</div>
      </div>
      {/* simplified car silhouette */}
      <svg width="52" height="28" viewBox="0 0 52 28" fill="none" style={{ flexShrink: 0 }}>
        <rect x="4" y="12" width="44" height="10" rx="4" fill="rgba(0,0,0,0.25)"/>
        <rect x="10" y="6" width="26" height="10" rx="3" fill="rgba(0,0,0,0.2)"/>
        <circle cx="13" cy="22" r="5" fill="rgba(0,0,0,0.3)"/>
        <circle cx="39" cy="22" r="5" fill="rgba(0,0,0,0.3)"/>
        <circle cx="13" cy="22" r="2.5" fill="rgba(0,0,0,0.45)"/>
        <circle cx="39" cy="22" r="2.5" fill="rgba(0,0,0,0.45)"/>
      </svg>
    </div>
  </div>
);

/* Card 5 — Race Leaderboard (main large card) */
const LeaderboardCard: React.FC = () => {
  const rows = [
    { pos: 1, drv: 'VER', gap: 'Leader', compound: 'M' },
    { pos: 2, drv: 'PIA', gap: '+0.785', compound: 'M' },
    { pos: 3, drv: 'RUS', gap: '+2.785', compound: 'M' },
    { pos: 4, drv: 'SAI', gap: '+5.785', compound: 'H' },
    { pos: 5, drv: 'NOR', gap: '+0.785', compound: 'M' },
  ];
  return (
    <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <CardHeader />
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, fontWeight: 700 }}>Saudi Arabian GP</span>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>Lap 36 / 50</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {rows.map(r => (
          <div key={r.pos} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', width: 10, textAlign: 'right', flexShrink: 0 }}>{r.pos}</span>
            <TeamDot driver={r.drv} />
            <span style={{ fontSize: 11, fontWeight: 700, width: 28, flexShrink: 0, letterSpacing: '0.04em' }}>{r.drv}</span>
            <span style={{ fontSize: 9, flex: 1, color: r.gap === 'Leader' ? '#fff' : 'rgba(255,255,255,0.55)' }}>{r.gap}</span>
            <TireChip compound={r.compound} />
          </div>
        ))}
      </div>
    </div>
  );
};

/* Card 6 — Mini Standings */
const MiniStandingsCard: React.FC = () => (
  <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', gap: 7 }}>
    <CardHeader />
    {[
      { pos: 1, drv: 'VER', gap: 'Leader', compound: 'M' },
      { pos: 2, drv: 'PIA', gap: '+0.785', compound: 'M' },
    ].map(r => (
      <div key={r.pos} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', width: 10, flexShrink: 0 }}>{r.pos}</span>
        <TeamDot driver={r.drv} />
        <span style={{ fontSize: 11, fontWeight: 700, flex: 1, letterSpacing: '0.04em' }}>{r.drv}</span>
        <span style={{ fontSize: 9, color: r.gap === 'Leader' ? '#fff' : 'rgba(255,255,255,0.5)' }}>{r.gap}</span>
        <TireChip compound={r.compound} />
      </div>
    ))}
  </div>
);

/* Card 7 — Battle */
const BattleCard: React.FC = () => (
  <div style={{ ...cardBase, display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* Red Bull dot */}
      <span style={{ display: 'inline-block', width: 18, height: 18, borderRadius: '50%', background: '#3671C6', flexShrink: 0 }} />
      <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>Battle for first</span>
      <span style={{ display: 'inline-block', width: 18, height: 18, borderRadius: '50%', background: '#FF8000', flexShrink: 0 }} />
    </div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>1.</div>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.04em', lineHeight: 1 }}>VER</div>
        <TireChip compound="M" />
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#E8002D' }}>+0.785</div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>2.</div>
        <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.04em', lineHeight: 1 }}>PIA</div>
        <TireChip compound="M" />
      </div>
    </div>
  </div>
);

/* Card 8 — Red Flag */
const RedFlagCard: React.FC = () => (
  <div style={{ ...cardBase, background: '#C8102E', border: '1px solid rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: 6 }}>
    <CardHeader dark />
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', lineHeight: 1.1, letterSpacing: '0.02em' }}>
          RED<br />FLAG
        </div>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>Session Stopped</div>
      </div>
      {/* stop sign */}
      <div style={{
        width: 38, height: 38, borderRadius: '50%',
        border: '3px solid rgba(255,255,255,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <div style={{ width: 16, height: 2.5, background: 'rgba(255,255,255,0.6)', borderRadius: 2 }} />
      </div>
    </div>
  </div>
);

/* Card 9 — Fastest Lap */
const FastestLapCard: React.FC = () => (
  <div style={{ ...cardBase, background: 'rgba(90,28,180,0.92)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 6 }}>
    <CardHeader />
    <div style={{ fontSize: 9, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.6)' }}>FASTEST LAP</div>
    <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.04em', lineHeight: 1 }}>1:29:359</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 2 }}>
      <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#FF8000' }} />
      <span style={{ fontSize: 11, fontWeight: 700 }}>PIASTRI</span>
    </div>
  </div>
);

/* Card 10 — Driver of the Day */
const DriverOfTheDayCard: React.FC = () => (
  <div style={{ ...cardBase, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: 8, minHeight: 110 }}>
    {/* background gradient */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(135deg, rgba(255,128,0,0.18) 0%, transparent 60%)',
      borderRadius: 14,
      pointerEvents: 'none',
    }} />
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{ fontSize: 8, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>
        DRIVER OF THE DAY
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#FF8000', flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em' }}>OSCAR PIASTRI</span>
      </div>
      {/* simplified helmet shape */}
      <div style={{
        position: 'absolute', right: -14, top: -12,
        width: 70, height: 70, borderRadius: '50% 50% 45% 45%',
        background: 'linear-gradient(140deg, #FF8000 30%, #E86000 100%)',
        opacity: 0.6,
      }} />
    </div>
  </div>
);

/* ── Main layout ────────────────────────────────────────────────────────── */

const F1UICards: React.FC = () => (
  <div
    className="f1-ui-cards"
    style={{
      position: 'absolute',
      top: '50%',
      right: 64,
      transform: 'translateY(-50%)',
      zIndex: 3,
      display: 'grid',
      gridTemplateColumns: '200px 200px 200px',
      gridTemplateRows: 'auto auto auto',
      gap: 8,
      pointerEvents: 'none',
    }}
  >
    {/* Row 1 */}
    <StartingGridCard />
    <WatchLiveCard />
    <GreenFlagCard />

    {/* Row 2 */}
    <SafetyCarCard />
    <LeaderboardCard />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <MiniStandingsCard />
      <FastestLapCard />
    </div>

    {/* Row 3 */}
    <BattleCard />
    <RedFlagCard />
    <DriverOfTheDayCard />
  </div>
);

export default F1UICards;
