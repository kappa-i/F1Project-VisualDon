import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import CTA5 from './CTA5.tsx';

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
      <div className="hero-safety-intro__cta-shell hero-safety-intro__animate">
        <CTA5 />
      </div>
    </div>
  );
}
