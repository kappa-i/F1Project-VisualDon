import React, { useState, useEffect, useRef } from 'react';
import SafetyChart from './SafetyChart';

interface EraStep {
  period: string;
  title: string;
  desc: string;
  stat: string;
  tag: string;
  side: 'left' | 'right';
  accent: string;
  statLabel: string;
  isChart?: boolean;
}

const ERA_STEPS: EraStep[] = [
  {
    period: '1950 — 1960',
    title: "L'ère des pionniers",
    desc: "Les pilotes s'élancent sans ceinture de sécurité, sans arceau, sans combinaison ignifugée. La mort fait partie du spectacle — acceptée, banalisée par tous. On court sur des circuits publics avec des voitures à réservoir ouvert.",
    stat: '≈ 2 décès / saison',
    tag: '01',
    side: 'left',
    accent: '#8a001a',
    statLabel: 'Mortalité moyenne',
  },
  {
    period: '1960 — 1970',
    title: 'La décennie noire',
    desc: "Nürburgring, Spa-Francorchamps, Rouen — des pistes de 22 km sans glissières ni zones de dégagement. Jim Clark, Lorenzo Bandini, Jochen Rindt. Les podiums côtoient les nécrologies. La F1 est en guerre contre elle-même.",
    stat: '≈ 3 décès / saison',
    tag: '02',
    side: 'right',
    accent: '#8a001a',
    statLabel: 'Mortalité moyenne',
  },
  {
    period: '1970 — 1994',
    title: 'Les premières règles',
    desc: "Jackie Stewart, triple champion du monde, contraint la FIA à légiférer. Combinaisons ignifugées, glissières Armco, médecins permanents. La mort recule — lentement, sans disparaître. Une première victoire sur l'inacceptable.",
    stat: 'Réglementation FIA active',
    tag: '03',
    side: 'left',
    accent: '#c8a96e',
    statLabel: 'Statut réglementaire',
  },
  {
    period: 'Imola · 1994',
    title: 'Le week-end qui a tout changé',
    desc: "Roland Ratzenberger le samedi. Ayrton Senna le dimanche. Deux décès en 24 heures sur le même circuit. La F1 se réveille brutalement. Un choc collectif qui déclenche une révolution sécuritaire sans précédent dans le sport automobile.",
    stat: 'Dernier décès en course',
    tag: '04',
    side: 'right',
    accent: '#e8002d',
    statLabel: 'Jalon historique',
  },
  {
    period: '1950 — 2026',
    title: 'Le Bilan de la Sécurité',
    desc: '',
    stat: '−100% depuis 1994',
    tag: '05',
    side: 'left',
    accent: '#e8002d',
    statLabel: 'Réduction de la mortalité',
    isChart: true,
  },
];

// Total era pages = 6 (1 intro + 5 steps). Step index: -1 = intro, 0–4 = cards
const ERA_TOTAL_STEPS = ERA_STEPS.length;

export default function EraTimeline() {
  const [activeStep, setActiveStep] = useState(-1);
  const [displayStep, setDisplayStep] = useState(-1);
  const [isMorphing, setIsMorphing] = useState(false);
  const activeStepRef = useRef(-1);

  useEffect(() => {
    if (activeStep < 0) {
      setDisplayStep(-1);
      setIsMorphing(false);
      return;
    }

    if (displayStep < 0) {
      setDisplayStep(activeStep);
      setIsMorphing(false);
      return;
    }

    if (activeStep === displayStep) return;

    setIsMorphing(true);

    const swapTimer = window.setTimeout(() => {
      setDisplayStep(activeStep);
    }, 160);

    const settleTimer = window.setTimeout(() => {
      setIsMorphing(false);
    }, 380);

    return () => {
      window.clearTimeout(swapTimer);
      window.clearTimeout(settleTimer);
    };
  }, [activeStep, displayStep]);

  useEffect(() => {
    const handleStepChange = (e: Event) => {
      const { step } = (e as CustomEvent<{ step: number }>).detail;
      if (step !== activeStepRef.current) {
        activeStepRef.current = step;
        setActiveStep(step);
      }
    };

    window.addEventListener('era-step-change', handleStepChange);
    return () => window.removeEventListener('era-step-change', handleStepChange);
  }, []);

  const step = displayStep >= 0 && displayStep < ERA_STEPS.length ? ERA_STEPS[displayStep] : null;
  const fromLeft = step?.side === 'left';

  // Progress: -1 = 0%, step 0 = 20%, …, step 4 = 100%
  const progressPct = activeStep < 0 ? 0 : (activeStep + 1) / ERA_TOTAL_STEPS;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      zIndex: 10,
      overflow: 'hidden',
    }}>

      {/* Intro hint — visible avant la première carte */}
      <div style={{
        position: 'absolute',
        top: '38px',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        pointerEvents: 'none',
        opacity: activeStep < 0 ? 1 : 0,
        transition: 'opacity 0.5s ease',
        whiteSpace: 'nowrap',
      }}>
        <div style={{
          fontSize: '9px',
          letterSpacing: '4px',
          color: 'rgba(255,255,255,0.3)',
          fontFamily: "'Formula1', sans-serif",
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          L'ère dangereuse · 1950 — 2026
        </div>
        <div style={{
          fontSize: '9px',
          letterSpacing: '2px',
          color: 'rgba(232, 0, 45, 0.55)',
          fontFamily: "'Formula1', sans-serif",
        }}>
          ↓ Scrollez pour explorer l'histoire
        </div>
      </div>

      {/* Indicateur d'étape — côté droit */}
      <div style={{
        position: 'absolute',
        right: '32px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none',
        opacity: activeStep >= 0 ? 1 : 0,
        transition: 'opacity 0.5s ease',
      }}>
        {ERA_STEPS.map((s, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexDirection: 'row-reverse',
            }}
          >
            {/* Label période — toujours réservé pour éviter le saut de layout */}
            <div style={{
              width: '130px',
              textAlign: 'right',
              overflow: 'hidden',
            }}>
              <span style={{
                display: 'block',
                fontSize: i === activeStep ? '11px' : '9px',
                letterSpacing: '1.5px',
                color: i === activeStep ? s.accent : i < activeStep ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.15)',
                fontFamily: "'Formula1', sans-serif",
                whiteSpace: 'nowrap',
                transition: 'all 0.5s ease',
              }}>
                {s.period}
              </span>
              {i === activeStep && (
                <span style={{
                  display: 'block',
                  fontSize: '9px',
                  letterSpacing: '3px',
                  color: 'rgba(255,255,255,0.35)',
                  fontFamily: "'Formula1', sans-serif",
                  marginTop: '2px',
                  textTransform: 'uppercase',
                }}>
                  {s.tag} / {ERA_STEPS.length.toString().padStart(2,'0')}
                </span>
              )}
            </div>

            {/* Trait */}
            <div style={{
              width: i === activeStep ? '36px' : '10px',
              height: i === activeStep ? '3px' : '2px',
              borderRadius: '2px',
              background: i === activeStep
                ? s.accent
                : i < activeStep
                  ? 'rgba(255,255,255,0.3)'
                  : 'rgba(255,255,255,0.08)',
              transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
              flexShrink: 0,
            }} />
          </div>
        ))}
      </div>

      {/* Barre de progression bas */}
      <div style={{
        position: 'absolute',
        bottom: '28px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '200px',
        opacity: activeStep >= 0 ? 0.85 : 0,
        transition: 'opacity 0.5s ease',
        pointerEvents: 'none',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '7px',
        }}>
          <span style={{
            fontSize: '8px',
            letterSpacing: '3px',
            color: 'rgba(255,255,255,0.3)',
            fontFamily: "'Formula1', sans-serif",
            textTransform: 'uppercase',
          }}>
            {step ? step.period : ''}
          </span>
          <span style={{
            fontSize: '8px',
            letterSpacing: '2px',
            color: 'rgba(255,255,255,0.25)',
            fontFamily: "'Formula1', sans-serif",
          }}>
            {activeStep + 1} / {ERA_TOTAL_STEPS}
          </span>
        </div>
        <div style={{
          height: '1px',
          background: 'rgba(255,255,255,0.08)',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '1px',
        }}>
          <div style={{
            position: 'absolute',
            left: 0, top: 0, bottom: 0,
            width: `${progressPct * 100}%`,
            background: step
              ? `linear-gradient(to right, ${step.accent}80, ${step.accent})`
              : 'linear-gradient(to right, #8a001a, #e8002d)',
            transition: 'width 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
          }} />
        </div>
      </div>

      {/* Carte active */}
      {step && !step.isChart && (
        <div style={{
          position: 'absolute',
          left: fromLeft ? '4%' : 'auto',
          right: fromLeft ? 'auto' : '4%',
          top: '50%',
          transform: `translateY(-50%) translateX(${isMorphing ? (fromLeft ? '-14px' : '14px') : '0'}) scale(${isMorphing ? 0.985 : 1})`,
          pointerEvents: 'auto',
          width: 'clamp(400px, 46vw, 620px)',
          opacity: isMorphing ? 0.74 : 1,
          transition: 'left 0.35s ease, right 0.35s ease, transform 0.35s ease, opacity 0.22s ease',
        }}>
          <div style={{
            background: 'rgba(5, 5, 5, 0.94)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.06)',
            ...(fromLeft
              ? { borderLeft: `3px solid ${step.accent}` }
              : { borderRight: `3px solid ${step.accent}` }
            ),
            borderRadius: '3px',
            padding: '40px 36px 32px',
            fontFamily: "'Formula1', sans-serif",
            color: '#e0ddd8',
            position: 'relative',
            overflow: 'hidden',
            transition: 'border-color 0.35s ease',
          }}>

            {/* Coin accentué */}
            <div style={{
              position: 'absolute',
              top: 0,
              ...(fromLeft ? { left: 0 } : { right: 0 }),
              width: '40px',
              height: '40px',
              borderTop: `1px solid ${step.accent}`,
              ...(fromLeft
                ? { borderLeft: `1px solid ${step.accent}` }
                : { borderRight: `1px solid ${step.accent}` }
              ),
              opacity: 0.55,
              transition: 'border-color 0.35s ease',
            }} />

            <div style={{
              position: 'absolute',
              ...(fromLeft ? { left: '-80px' } : { right: '-80px' }),
              top: '-80px',
              width: '240px',
              height: '240px',
              background: `radial-gradient(circle, ${step.accent}14 0%, transparent 68%)`,
              pointerEvents: 'none',
              transition: 'background 0.35s ease',
            }} />

            <div style={{
              opacity: isMorphing ? 0.82 : 1,
              transform: `translateY(${isMorphing ? '6px' : '0'})`,
              transition: 'opacity 0.22s ease, transform 0.22s ease',
            }}>
              {/* En-tête */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '22px',
              }}>
                <span style={{
                  fontSize: '11px',
                  letterSpacing: '4px',
                  color: step.accent,
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  transition: 'color 0.35s ease',
                }}>
                  Ère {step.tag}
                </span>
                <span style={{
                  fontSize: '11px',
                  letterSpacing: '2px',
                  color: 'rgba(255,255,255,0.28)',
                }}>
                  {step.period}
                </span>
              </div>

              {/* Titre */}
              <h3 style={{
                fontSize: '32px',
                fontWeight: 700,
                lineHeight: 1.15,
                marginBottom: '20px',
                letterSpacing: '-0.8px',
                color: '#ffffff',
              }}>
                {step.title}
              </h3>

              {/* Séparateur */}
              <div style={{
                height: '1px',
                background: `linear-gradient(to ${fromLeft ? 'right' : 'left'}, ${step.accent}80, transparent)`,
                marginBottom: '16px',
                transition: 'background 0.35s ease',
              }} />

              {/* Description */}
              <p style={{
                fontSize: '14.5px',
                lineHeight: 1.85,
                color: 'rgba(224, 221, 216, 0.72)',
                marginBottom: '28px',
                letterSpacing: '0.1px',
              }}>
                {step.desc}
              </p>

              {/* Badge stat */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 20px',
                background: `${step.accent}10`,
                border: `1px solid ${step.accent}28`,
                borderRadius: '2px',
                transition: 'background 0.35s ease, border-color 0.35s ease',
              }}>
                <span style={{
                  fontSize: '8px',
                  letterSpacing: '2.5px',
                  color: 'rgba(255,255,255,0.3)',
                  textTransform: 'uppercase',
                }}>
                  {step.statLabel}
                </span>
                <span style={{
                  fontSize: '17px',
                  fontWeight: 700,
                  color: step.accent,
                  letterSpacing: '0.5px',
                  transition: 'color 0.35s ease',
                }}>
                  {step.stat}
                </span>
              </div>
            </div>

            {/* Numéro d'étape en filigrane */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              ...(fromLeft ? { right: '24px' } : { left: '24px' }),
              fontSize: '72px',
              fontWeight: 700,
              color: `${step.accent}08`,
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
              userSelect: 'none',
              transition: 'color 0.35s ease',
            }}>
              {step.tag}
            </div>
          </div>
        </div>
      )}

      {/* Carte graphique — étape 05 */}
      {step && step.isChart && (
        <div style={{
          position: 'absolute',
          left: '4%',
          top: '50%',
          transform: `translateY(-50%) scale(${isMorphing ? 0.985 : 1})`,
          pointerEvents: 'auto',
          width: 'clamp(480px, 52vw, 720px)',
          opacity: isMorphing ? 0.78 : 1,
          transition: 'transform 0.35s ease, opacity 0.22s ease',
        }}>
          <SafetyChart />
        </div>
      )}
    </div>
  );
}
