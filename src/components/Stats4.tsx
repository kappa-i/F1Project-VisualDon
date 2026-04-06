import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const stats = [
  { label: 'Data queries daily',  value: '8.7B+',  highlight: false },
  { label: 'Active databases',    value: '2,400+', highlight: false },
  { label: 'Records processed',   value: '142B+',  highlight: false },
  { label: '24H query speed',     value: '<5ms',   highlight: true  },
];

const FONT = 'ui-sans-serif, system-ui, -apple-system, sans-serif';
const FONT_F1 = 'Formula1, sans-serif';

export default function Stats4() {
  const handleDiscoverClick = () => {
    window.dispatchEvent(new CustomEvent('hero-next-step'));
  };

  return (
    <section
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'stretch',
        padding: '64px',
        background: 'transparent',
        fontFamily: FONT,
        boxSizing: 'border-box',
        zIndex: 2,
        pointerEvents: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '48px',
          alignItems: 'stretch',
        }}
      >
        {/* ── Left column ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Title – top left */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              margin: 0,
              fontSize: 'clamp(36px, 4.5vw, 68px)',
              fontWeight: 700,
              letterSpacing: '0.03em',
              color: '#fff',
              lineHeight: 0.95,
              fontFamily: FONT_F1,
            }}
          >
            L&apos;histoire de la<br />sécurité en F1
          </motion.h2>

          {/* Description + Button – bottom left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                margin: 0,
                fontSize: 'clamp(15px, 1.2vw, 18px)',
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.7,
                maxWidth: '420px',
                fontFamily: FONT,
              }}
            >
              Peut-on aller plus vite en étant plus en sécurité&nbsp;?
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: '9999px',
                background: '#fff',
                color: '#08080b',
                fontWeight: 500,
                fontSize: '15px',
                border: 'none',
                cursor: 'pointer',
                width: 'fit-content',
                fontFamily: FONT,
                transition: 'background 0.2s',
                pointerEvents: 'auto',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e5e5e5')}
              onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
              onClick={handleDiscoverClick}
            >
              Découvrir
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </div>

        {/* ── Right column – stats at the bottom ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                style={{
                  position: 'relative',
                  borderRadius: '24px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '24px',
                  minHeight: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  background: 'rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  overflow: 'hidden',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
                }}
              >
                {/* Dotted background */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage:
                      'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
                    backgroundSize: '14px 14px',
                    zIndex: 0,
                  }}
                />

                {/* Content */}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    height: '100%',
                    gap: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '13px',
                        color: stat.highlight ? '#22c55e' : 'rgba(255,255,255,0.45)',
                        fontFamily: FONT,
                      }}
                    >
                      {stat.label}
                    </p>
                    {stat.highlight && (
                      <span style={{ position: 'relative', display: 'inline-flex', width: '8px', height: '8px' }}>
                        <span className="stats4-ping" />
                        <span
                          style={{
                            position: 'relative',
                            display: 'inline-flex',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: '#22c55e',
                          }}
                        />
                      </span>
                    )}
                  </div>

                  <p
                    style={{
                      margin: 0,
                      fontSize: 'clamp(34px, 3.2vw, 52px)',
                      fontWeight: 700,
                      letterSpacing: '0.02em',
                      color: stat.highlight ? '#22c55e' : '#fff',
                      fontFamily: FONT_F1,
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
