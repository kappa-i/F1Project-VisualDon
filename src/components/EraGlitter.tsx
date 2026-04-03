import { useState, useEffect } from "react";
import GlitterWarp from "./GlitterWarp";

const ERA_ACCENTS: Record<number, string> = {
  0: '#8a001a',
  1: '#8a001a',
  2: '#c8a96e',
  3: '#e8002d',
  4: '#e8002d',
};

export default function EraGlitter() {
  const [color, setColor] = useState('#8a001a');

  useEffect(() => {
    const handleStep = (e: Event) => {
      const { step } = (e as CustomEvent<{ step: number }>).detail;
      setColor(ERA_ACCENTS[step] ?? '#8a001a');
    };
    window.addEventListener('era-step-change', handleStep);
    return () => window.removeEventListener('era-step-change', handleStep);
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: 0.6 }}>
      <GlitterWarp
        color={color}
        speed={0.8}
        density={18}
        brightness={1.5}
        starSize={0.12}
        turbulence={0.2}
        focalDepth={0.04}
      />
    </div>
  );
}
