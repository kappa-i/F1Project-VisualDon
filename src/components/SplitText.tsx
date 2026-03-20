import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';

type TweenVars = {
  opacity?: number;
  y?: number;
};

type SplitTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  from?: TweenVars;
  to?: TweenVars;
  tag?: keyof JSX.IntrinsicElements;
  active?: boolean;
  onLetterAnimationComplete?: () => void;
};

const SplitText = ({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  tag = 'p',
  active = false,
  onLetterAnimationComplete,
}: SplitTextProps) => {
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const callbackRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const letters = useMemo(() => Array.from(text), [text]);

  useEffect(() => {
    callbackRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (document.fonts.status === 'loaded') {
      setFontsLoaded(true);
      return;
    }

    document.fonts.ready.then(() => {
      setFontsLoaded(true);
    });
  }, []);

  useEffect(() => {
    const targets = lettersRef.current.filter(Boolean);
    if (!targets.length) return;

    animationRef.current?.kill();

    if (!active || !fontsLoaded) {
      gsap.set(targets, from);
      return;
    }

    gsap.set(targets, from);
    animationRef.current = gsap.to(targets, {
      ...to,
      duration,
      ease,
      stagger: delay / 1000,
      force3D: true,
      onComplete: () => callbackRef.current?.(),
    });

    return () => {
      animationRef.current?.kill();
    };
  }, [active, delay, duration, ease, fontsLoaded, from, letters, to]);

  const Tag = tag as keyof JSX.IntrinsicElements;

  return (
    <Tag className={className}>
      {letters.map((letter, index) => (
        <span
          key={`${letter}-${index}`}
          ref={el => {
            if (el) lettersRef.current[index] = el;
          }}
          className="split-char"
          aria-hidden="true"
        >
          {letter === ' ' ? '\u00A0' : letter}
        </span>
      ))}
    </Tag>
  );
};

export default SplitText;
