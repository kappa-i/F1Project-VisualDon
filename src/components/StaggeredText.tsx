import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { motion, Transition, Easing } from "motion/react";

type MotionStyle = Record<string, string | number>;
type SegmentBy = "chars" | "words" | "lines";
type StaggerDirection = "forward" | "reverse" | "center";

export interface StaggeredTextHandle {
  replay: () => void;
  exit: () => void;
}

export interface StaggeredTextProps {
  text: string;
  style?: React.CSSProperties;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  segmentBy?: SegmentBy;
  separator?: string;
  delay?: number;
  duration?: number;
  easing?: Easing | Easing[];
  direction?: "top" | "bottom" | "left" | "right";
  blur?: boolean;
  from?: MotionStyle;
  to?: MotionStyle | MotionStyle[];
  staggerDirection?: StaggerDirection;
  onAnimationComplete?: () => void;
  onExitComplete?: () => void;
}

const buildKeyframes = (
  from: MotionStyle,
  steps: MotionStyle[],
): Record<string, Array<string | number>> => {
  const keys = new Set<string>([
    ...Object.keys(from),
    ...steps.flatMap((step) => Object.keys(step)),
  ]);
  const keyframes: Record<string, Array<string | number>> = {};
  keys.forEach((key) => {
    keyframes[key] = [from[key], ...steps.map((step) => step[key])];
  });
  return keyframes;
};

const StaggeredText = forwardRef<StaggeredTextHandle, StaggeredTextProps>(
  (
    {
      text,
      style,
      as: Tag = "p",
      segmentBy = "words",
      separator,
      delay = 70,
      duration = 0.55,
      easing = (t: number) => t,
      direction = "top",
      blur = true,
      from,
      to,
      staggerDirection = "forward",
      onAnimationComplete,
      onExitComplete,
    },
    ref,
  ) => {
    const rootRef = useRef<HTMLElement | null>(null);
    const [hasEnteredView, setHasEnteredView] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useImperativeHandle(ref, () => ({
      replay: () => {
        setIsExiting(false);
        setHasEnteredView(false);
        requestAnimationFrame(() => setHasEnteredView(true));
      },
      exit: () => setIsExiting(true),
    }));

    useEffect(() => {
      if (!rootRef.current) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setHasEnteredView(true);
            setIsExiting(false);
          }
        },
        { threshold: 0.1 },
      );
      observer.observe(rootRef.current);
      return () => observer.disconnect();
    }, []);

    const defaultFrom = useMemo<MotionStyle>(() => {
      const base: MotionStyle = { opacity: 0 };
      if (direction === "top" || direction === "bottom") {
        base.y = direction === "top" ? -20 : 20;
      } else {
        base.x = direction === "left" ? -20 : 20;
      }
      if (blur) base.filter = "blur(8px)";
      return base;
    }, [direction, blur]);

    const defaultTo = useMemo<MotionStyle[]>(() => {
      const axisKey = direction === "left" || direction === "right" ? "x" : "y";
      if (!blur) return [{ opacity: 1, [axisKey]: 0 }];
      const overshoot = direction === "top" || direction === "left" ? 4 : -4;
      return [
        { opacity: 0.7, [axisKey]: overshoot, filter: "blur(4px)" },
        { opacity: 1, [axisKey]: 0, filter: "blur(0px)" },
      ];
    }, [direction, blur]);

    const fromSnapshot = useMemo<MotionStyle>(() => from ?? defaultFrom, [from, defaultFrom]);
    const toSnapshots = useMemo<MotionStyle[]>(() => {
      if (!to) return defaultTo;
      return Array.isArray(to) ? to : [to];
    }, [to, defaultTo]);

    const stepCount = toSnapshots.length + 1;
    const times = useMemo(
      () => Array.from({ length: stepCount }, (_, i) => i / (stepCount - 1)),
      [stepCount],
    );

    const { rowsSegments, totalSegments } = useMemo(() => {
      const rows = separator ? text.split(separator) : text.split(/\r?\n/);
      const rowsSegments: string[][] = rows.map((row) =>
        segmentBy === "chars" ? row.split("") : segmentBy === "lines" ? [row] : row.split(" "),
      );
      const total = rowsSegments.reduce((s, r) => s + r.length, 0);
      return { rowsSegments, totalSegments: total };
    }, [text, segmentBy, separator]);

    if (!text) return null;

    const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

    const getStaggerDelay = (index: number, total: number): number => {
      switch (staggerDirection) {
        case "reverse": return ((total - 1 - index) * delay) / 1000;
        case "center": {
          const mid = (total - 1) / 2;
          return (Math.abs(index - mid) * delay) / 1000;
        }
        default: return (index * delay) / 1000;
      }
    };

    const hasMultipleRows = rowsSegments.length > 1;
    let globalIndex = 0;

    return (
      <Tag
        ref={rootRef as React.RefObject<HTMLParagraphElement>}
        style={{
          display: hasMultipleRows || segmentBy === "lines" ? "block" : "inline-flex",
          flexWrap: "wrap",
          whiteSpace: "pre-wrap",
          ...style,
        }}
      >
        {rowsSegments.map((rowSegs, rowIndex) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {rowSegs.map((segment, segIndex) => {
              const gi = globalIndex++;
              const isLast = gi === totalSegments - 1;
              const transition: Transition = {
                duration,
                times,
                delay: getStaggerDelay(gi, totalSegments),
                ease: easing,
              };
              return (
                <motion.span
                  key={`seg-${rowIndex}-${segIndex}`}
                  initial={fromSnapshot}
                  animate={isExiting ? fromSnapshot : hasEnteredView ? animateKeyframes : fromSnapshot}
                  transition={transition}
                  onAnimationComplete={
                    isLast
                      ? () => (isExiting ? onExitComplete?.() : onAnimationComplete?.())
                      : undefined
                  }
                  style={{ display: "inline-block", willChange: "transform, filter, opacity" }}
                >
                  {segmentBy === "chars" ? (segment === " " ? "\u00A0" : segment) : segment}
                  {segmentBy === "words" && segIndex < rowSegs.length - 1 && "\u00A0"}
                </motion.span>
              );
            })}
            {rowIndex < rowsSegments.length - 1 && segmentBy !== "lines" && (
              <br key={`br-${rowIndex}`} />
            )}
          </React.Fragment>
        ))}
      </Tag>
    );
  },
);

StaggeredText.displayName = "StaggeredText";
export default StaggeredText;
