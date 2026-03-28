import React, { useRef, useCallback } from 'react';

interface CometCardProps {
  children: React.ReactNode;
  rotateDepth?: number;
  translateDepth?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function CometCard({
  children,
  rotateDepth = 17.5,
  translateDepth = 20,
  className,
  style,
}: CometCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      ref.current.style.transform = `perspective(1000px) rotateX(${-y * rotateDepth}deg) rotateY(${x * rotateDepth}deg) translateZ(${translateDepth}px)`;
    },
    [rotateDepth, translateDepth],
  );

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform =
      'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: 'transform 0.18s ease',
        transformStyle: 'preserve-3d',
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
