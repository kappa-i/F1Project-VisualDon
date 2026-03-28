import React, { useState, useEffect, useRef } from 'react';
import { CometCard } from './CometCard';

interface EraStep {
  period: string;
  title: string;
  desc: string;
  stat: string;
  tag: string;
  side: 'left' | 'right';
  accent: string;
  statLabel: string;
}

const ERA_STEPS: EraStep[] = [
  {
    period: '1950 — 1960',
    title: "L'ère des pionniers",
    desc: "Les pilotes s'élancent sans ceinture de sécurité, sans arceau, sans combinaison ignifugée. La mort fait partie du spectacle — acceptée, banalisée par tous.",
    stat: '≈ 2 décès / saison',
    tag: '01',
    side: 'left',
    accent: '#8a001a',
    statLabel: 'Mortalité moyenne',
  },
  {
    period: '1960 — 1970',
    title: 'La décennie noire',
    desc: "Nürburgring, Spa-Francorchamps, Rouen — des pistes de 22 km sans glissières ni zones de dégagement. Jim Clark, Lorenzo Bandini, Jochen Rindt. Les podiums côtoient les nécrologies.",
    stat: '≈ 3 décès / saison',
    tag: '02',
    side: 'right',
    accent: '#8a001a',
    statLabel: 'Mortalité moyenne',
  },
  {
    period: '1970 — 1994',
    title: 'Les premières règles',
    desc: "Jackie Stewart contraint la FIA à légiférer. Combinaisons ignifugées, glissières Armco, médecins permanents sur les circuits. La mort recule — lentement, sans disparaître.",
    stat: 'Réglementation FIA active',
    tag: '03',
    side: 'left',
    accent: '#c8a96e',
    statLabel: 'Statut réglementaire',
  },
  {
    period: 'Imola · 1994',
    title: 'Le week-end qui a tout changé',
    desc: "Roland Ratzenberger le samedi. Ayrton Senna le dimanche. Deux décès en 24 heures. La F1 se réveille brutalement et accélère sa mutation sécuritaire sans précédent.",
    stat: 'Dernier décès en course',
    tag: '04',
    side: 'right',
    accent: '#e8002d',
    statLabel: 'Jalon historique',
  },
  {
    period: '1994 — 2026',
    title: 'La révolution de la survie',
    desc: "Cellule de survie carbone, HANS device, barrières SAFER, et le Halo en 2018. Grosjean survit à 220 km/h en feu (2020). Zhou se retourne à Silverstone (2022). La SF-26 est 20× plus sûre.",
    stat: '0 décès en course',
    tag: '05',
    side: 'left',
    accent: '#c8a96e',
    statLabel: 'Bilan depuis Imola',
  },
];

// Progress thresholds at which each step appears (0–1)
const STEP_THRESHOLDS = [0.08, 0.26, 0.44, 0.62, 0.80];

export default function EraTimeline() {
  const [activeStep, setActiveStep] = useState(-1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const activeStepRef = useRef(-1);

  useEffect(() => {
    const handleProgress = (e: Event) => {
      const { progress } = (e as CustomEvent<{ progress: number }>).detail;
      setScrollProgress(progress);

      let newStep = -1;
      for (let i = STEP_THRESHOLDS.length - 1; i >= 0; i--) {
        if (progress >= STEP_THRESHOLDS[i]) { newStep = i; break; }
      }

      if (newStep !== activeStepRef.current) {
        activeStepRef.current = newStep;
        setActiveStep(newStep);
      }
    };

    const handleReset = () => {
      activeStepRef.current = -1;
      setActiveStep(-1);
      setScrollProgress(0);
    };

    window.addEventListener('era-scroll-progress', handleProgress);
    window.addEventListener('era-reset', handleReset);
    return () => {
      window.removeEventListener('era-scroll-progress', handleProgress);
      window.removeEventListener('era-reset', handleReset);
    };
  }, []);

  const step = activeStep >= 0 ? ERA_STEPS[activeStep] : null;
  const fromLeft = step?.side === 'left';

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 10,
      overflow: 'hidden',
    }}>
      {/* Top label */}
      <div style={{
        position: 'absolute',
        top: '36px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        pointerEvents: 'none',
        opacity: scrollProgress < 0.06 ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}>
        <div style={{
          fontSize: '9px',
          letterSpacing: '4px',
          color: 'rgba(255,255,255,0.35)',
          fontFamily: "'Formula1', sans-serif",
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          L'ère dangereuse · 1950 — 2026
        </div>
        <div style={{
          fontSize: '9px',
          letterSpacing: '2px',
          color: 'rgba(232, 0, 45, 0.6)',
          fontFamily: "'Formula1', sans-serif",
        }}>
          ↓ Scrollez pour explorer l'histoire
        </div>
      </div>

      {/* Step indicator dots (right side) */}
      <div style={{
        position: 'absolute',
        right: '28px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        pointerEvents: 'none',
        opacity: scrollProgress > 0.04 ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}>
        {ERA_STEPS.map((s, i) => (
          <div key={i} style={{
            width: i === activeStep ? '20px' : '5px',
            height: '5px',
            borderRadius: '3px',
            background: i === activeStep
              ? s.accent
              : i < activeStep
                ? 'rgba(255,255,255,0.35)'
                : 'rgba(255,255,255,0.12)',
            transition: 'all 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          }} />
        ))}
      </div>

      {/* Progress bar (bottom) */}
      <div style={{
        position: 'absolute',
        bottom: '32px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '160px',
        opacity: scrollProgress > 0.04 ? 0.7 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
      }}>
        <div style={{
          fontSize: '8px',
          letterSpacing: '3px',
          color: 'rgba(255,255,255,0.3)',
          fontFamily: "'Formula1', sans-serif",
          textAlign: 'center',
          marginBottom: '6px',
          textTransform: 'uppercase',
        }}>
          {step ? `${step.period}` : 'Explorez'}
        </div>
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', position: 'relative', overflow: 'hidden' }}>
          <div style={{
            position: 'absolute',
            left: 0, top: 0, bottom: 0,
            width: `${scrollProgress * 100}%`,
            background: 'linear-gradient(to right, #8a001a, #e8002d)',
            transition: 'width 0.1s linear',
          }} />
        </div>
      </div>

      {/* Active card */}
      {step && (
        <div style={{
          position: 'absolute',
          left: fromLeft ? '4%' : 'auto',
          right: fromLeft ? 'auto' : '4%',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'auto',
          width: 'clamp(280px, 36vw, 420px)',
        }}>
          <div
            key={activeStep}
            className={fromLeft ? 'era-card-enter-left' : 'era-card-enter-right'}
          >
            <CometCard rotateDepth={12} translateDepth={16}>
              <div style={{
                background: 'rgba(6, 6, 6, 0.92)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(255,255,255,0.07)',
                ...(fromLeft
                  ? { borderLeft: `3px solid ${step.accent}` }
                  : { borderRight: `3px solid ${step.accent}` }
                ),
                borderRadius: '3px',
                padding: '26px 24px 22px',
                fontFamily: "'Formula1', sans-serif",
                color: '#e0ddd8',
                position: 'relative',
                overflow: 'hidden',
              }}>

                {/* Corner bracket */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  ...(fromLeft ? { left: 0 } : { right: 0 }),
                  width: '32px',
                  height: '32px',
                  borderTop: `1px solid ${step.accent}`,
                  ...(fromLeft
                    ? { borderLeft: `1px solid ${step.accent}` }
                    : { borderRight: `1px solid ${step.accent}` }
                  ),
                  opacity: 0.5,
                }} />

                {/* Subtle background glow */}
                <div style={{
                  position: 'absolute',
                  ...(fromLeft ? { left: '-60px' } : { right: '-60px' }),
                  top: '-60px',
                  width: '180px',
                  height: '180px',
                  background: `radial-gradient(circle, ${step.accent}18 0%, transparent 70%)`,
                  pointerEvents: 'none',
                }} />

                {/* Header row */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '14px',
                }}>
                  <span style={{
                    fontSize: '9px',
                    letterSpacing: '3px',
                    color: step.accent,
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}>
                    Ère {step.tag}
                  </span>
                  <span style={{
                    fontSize: '9px',
                    letterSpacing: '1.5px',
                    color: 'rgba(255,255,255,0.3)',
                  }}>
                    {step.period}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 700,
                  lineHeight: 1.2,
                  marginBottom: '12px',
                  letterSpacing: '-0.3px',
                  color: '#ffffff',
                }}>
                  {step.title}
                </h3>

                {/* Divider */}
                <div style={{
                  height: '1px',
                  background: `linear-gradient(to ${fromLeft ? 'right' : 'left'}, ${step.accent}70, transparent)`,
                  marginBottom: '14px',
                }} />

                {/* Description */}
                <p style={{
                  fontSize: '11.5px',
                  lineHeight: 1.75,
                  color: 'rgba(224, 221, 216, 0.7)',
                  marginBottom: '20px',
                  letterSpacing: '0.2px',
                }}>
                  {step.desc}
                </p>

                {/* Stat badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 12px',
                  background: `${step.accent}12`,
                  border: `1px solid ${step.accent}30`,
                  borderRadius: '2px',
                }}>
                  <span style={{
                    fontSize: '8px',
                    letterSpacing: '2px',
                    color: 'rgba(255,255,255,0.35)',
                    textTransform: 'uppercase',
                  }}>
                    {step.statLabel}
                  </span>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: step.accent,
                    letterSpacing: '0.5px',
                  }}>
                    {step.stat}
                  </span>
                </div>
              </div>
            </CometCard>
          </div>
        </div>
      )}
    </div>
  );
}
