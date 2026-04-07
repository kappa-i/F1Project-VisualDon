import React from "react";
import { gsap } from "gsap";

export interface TextScatterProps {
  text?: string;
  velocity?: number;
  rotation?: number;
  scale?: number;
  returnAfter?: number;
  duration?: number;
  style?: React.CSSProperties;
  charStyle?: React.CSSProperties;
}

const TextScatter: React.FC<TextScatterProps> = ({
  text = "",
  velocity = 200,
  rotation = 90,
  scale = 1,
  returnAfter = 1,
  duration = 2,
  style,
  charStyle,
}) => {
  const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = centerX - e.clientX;
    const dy = centerY - e.clientY;

    const angle = Math.atan2(dy, dx);
    const force = velocity * (0.8 + Math.random() * 0.4);

    gsap.to(target, {
      x: Math.cos(angle) * force,
      y: Math.sin(angle) * force,
      rotation: (Math.random() - 0.5) * rotation * 2,
      scale,
      duration,
      ease: "power4.out",
      overwrite: "auto",
      onComplete: () => {
        gsap.to(target, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          duration,
          delay: returnAfter,
          ease: "elastic.out(1, 0.3)",
          overwrite: "auto",
        });
      },
    });
  };

  return (
    <span style={{ display: "inline", ...style }}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          onMouseEnter={handleMouseEnter}
          style={{
            display: "inline-block",
            willChange: "transform",
            cursor: "default",
            ...charStyle,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
};

export default TextScatter;
