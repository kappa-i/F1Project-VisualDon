import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import CTA5 from './CTA5.tsx';

const DECADE_DATA = [
  { label: '1950s', deaths: 14, safety: 0 },
  { label: '1960s', deaths: 18, safety: 5 },
  { label: '1970s', deaths: 10, safety: 22 },
  { label: '1980s', deaths: 4, safety: 48 },
  { label: '1990s', deaths: 3, safety: 62 },
  { label: '2000s', deaths: 0, safety: 78 },
  { label: '2010s', deaths: 1, safety: 88 },
  { label: '2020s', deaths: 0, safety: 97 },
];

function SafetyBars() {
  return (
    <div className="hero-safety-chart" aria-hidden="true">
      {DECADE_DATA.map((item) => (
        <div className="hero-safety-chart__col" key={item.label}>
          <div className="hero-safety-chart__bars">
            <div
              className="hero-safety-chart__bar hero-safety-chart__bar--deaths"
              style={{ height: `${Math.max(8, item.deaths * 8)}px` }}
            />
            <div
              className="hero-safety-chart__bar hero-safety-chart__bar--safety"
              style={{ height: `${Math.max(12, item.safety * 1.35)}px` }}
            />
          </div>
          <div className="hero-safety-chart__label">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function HeroSafetyIntro() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    const handleStepChange = (event: Event) => {
      const nextStep = (event as CustomEvent<{ step?: number }>).detail?.step ?? -1;
      setActiveStep(nextStep);
    };

    window.addEventListener('hero-step-change', handleStepChange as EventListener);
    return () => window.removeEventListener('hero-step-change', handleStepChange as EventListener);
  }, []);

  useEffect(() => {
    if (!rootRef.current) return;

    const root = rootRef.current;
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (activeStep < 0) {
      timeline.to(root, {
        autoAlpha: 0,
        y: 24,
        duration: 0.45,
        pointerEvents: 'none',
      });
      return () => timeline.kill();
    }

    const animatedNodes = root.querySelectorAll('.hero-safety-intro__animate');
    const bars = root.querySelectorAll('.hero-safety-chart__bar');

    gsap.set(root, { pointerEvents: 'none' });
    gsap.set(bars, { transformOrigin: 'center bottom', scaleY: 0 });

    timeline
      .to(root, { autoAlpha: 1, y: 0, duration: 0.45 }, 0)
      .fromTo(
        animatedNodes,
        { autoAlpha: 0, y: 32 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06 },
        0.05,
      )
      .to(bars, { scaleY: 1, duration: 0.75, stagger: 0.035 }, 0.18);

    return () => timeline.kill();
  }, [activeStep]);

  if (activeStep < 0) {
    return <div className="hero-safety-intro" ref={rootRef} />;
  }

  return (
    <div className="hero-safety-intro" ref={rootRef}>
      {activeStep === 0 ? (
        <div className="hero-safety-intro__shell">
          <div className="hero-safety-intro__copy">
            <p className="hero-safety-intro__eyebrow hero-safety-intro__animate">
              Introduction
            </p>
            <h2 className="hero-safety-intro__title hero-safety-intro__animate">
              La vitesse a continue d&apos;augmenter.
              <br />
              La mortalite, elle, a chute.
            </h2>
            <p className="hero-safety-intro__lead hero-safety-intro__animate">
              Avant d&apos;entrer dans les accidents, les voitures et les circuits, on pose le paradoxe
              central du site: la F1 moderne va plus vite, mais protege mieux.
            </p>
          </div>

          <div className="hero-safety-intro__panel">
            <div className="hero-safety-intro__stats hero-safety-intro__animate">
              <article className="hero-safety-intro__stat">
                <div className="hero-safety-intro__stat-value">49</div>
                <p className="hero-safety-intro__stat-label">deces pilotes recenses avant 2000</p>
              </article>
              <article className="hero-safety-intro__stat">
                <div className="hero-safety-intro__stat-value">97%</div>
                <p className="hero-safety-intro__stat-label">indice securite projete pour les annees 2020</p>
              </article>
              <article className="hero-safety-intro__stat">
                <div className="hero-safety-intro__stat-value">220</div>
                <p className="hero-safety-intro__stat-label">km/h lors du crash de Grosjean en 2020</p>
              </article>
            </div>

            <div className="hero-safety-intro__chart-wrap hero-safety-intro__animate">
              <div className="hero-safety-intro__chart-header">
                <span>Deces pilotes</span>
                <span>Indice securite</span>
              </div>
              <SafetyBars />
            </div>
          </div>
        </div>
      ) : (
        <div className="hero-safety-intro__cta-shell hero-safety-intro__animate">
          <CTA5 />
        </div>
      )}
    </div>
  );
}
