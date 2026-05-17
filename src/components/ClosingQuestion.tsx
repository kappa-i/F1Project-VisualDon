import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const PHRASES = [
  { text: 'Décennie après décennie, des pilotes mouraient.', isQuestion: false },
  { text: 'Le monde regardait. Et on continuait.', isQuestion: false },
  { text: 'Imola, 1994.\nRatzenberger le samedi. Senna le dimanche.', isQuestion: false },
  { text: "Il a fallu perdre le meilleur\npour décider que c'était trop.", isQuestion: false },
  { text: "Pourquoi faut-il qu'un homme meure\npour qu'on protège les suivants ?", isQuestion: true },
];

const PHRASE_SCROLL = 420;
const TOTAL_HEIGHT  = (PHRASES.length - 1) * PHRASE_SCROLL + 700 + 120;

export default function ClosingQuestion() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx]   = useState(-1);

  useEffect(() => {
    const sectionEl = document.getElementById('s-conclusion');
    if (!sectionEl) return;

    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const relativeScroll = sectionEl.scrollTop - container.offsetTop;
      if (relativeScroll < 0) { setActiveIdx(-1); return; }
      setActiveIdx(Math.min(PHRASES.length - 1, Math.floor(relativeScroll / PHRASE_SCROLL)));
    };

    sectionEl.addEventListener('scroll', handleScroll, { passive: true });
    return () => sectionEl.removeEventListener('scroll', handleScroll);
  }, []);

  const active = activeIdx >= 0 ? PHRASES[activeIdx] : null;

  return (
    <div
      ref={containerRef}
      style={{ height: TOTAL_HEIGHT, position: 'relative', background: '#0e0e0e', width: '100%' }}
    >
      {/* bande rouge en haut */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: 1, background: 'rgba(255,255,255,0.06)',
      }} />

      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0e0e0e',
      }}>
        {/* accent gauche */}
        <motion.div
          animate={{ opacity: activeIdx >= 0 ? 1 : 0, scaleY: activeIdx >= 0 ? 1 : 0.3 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute', left: 56, top: '50%', translateY: '-50%',
            width: 2, height: 72,
            background: 'linear-gradient(to bottom, transparent, #e8002d 40%, #e8002d 60%, transparent)',
            transformOrigin: 'center',
          }}
        />

        {/* numéro de phrase en watermark */}
        <AnimatePresence>
          {activeIdx >= 0 && (
            <motion.span
              key={`n-${activeIdx}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.04 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                right: 48, bottom: '15%',
                fontSize: 200, fontWeight: 700, lineHeight: 1,
                color: '#fff',
                fontFamily: "'Formula1', sans-serif",
                userSelect: 'none', pointerEvents: 'none',
              }}
            >
              {String(activeIdx + 1).padStart(2, '0')}
            </motion.span>
          )}
        </AnimatePresence>

        {/* texte principal */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: active?.isQuestion ? 840 : 660, padding: '0 64px', width: '100%' }}>
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {active.isQuestion && (
                  <div style={{
                    width: 28, height: 2,
                    background: '#e8002d',
                    marginBottom: 28,
                  }} />
                )}
                <p style={{
                  margin: 0,
                  fontFamily: "'Formula1', 'Arial Narrow', Arial, sans-serif",
                  fontSize: active.isQuestion ? 'clamp(1.65rem, 2.8vw, 2.6rem)' : 'clamp(1.2rem, 2vw, 1.9rem)',
                  fontWeight: active.isQuestion ? 700 : 400,
                  color: active.isQuestion ? '#fff' : 'rgba(255,255,255,0.60)',
                  lineHeight: 1.38,
                  letterSpacing: active.isQuestion ? '-0.025em' : '-0.01em',
                  whiteSpace: 'pre-line',
                  textShadow: active.isQuestion ? '0 22px 66px rgba(0,0,0,0.28)' : 'none',
                }}>
                  {active.text}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
