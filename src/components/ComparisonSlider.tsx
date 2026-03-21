"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useGSAP } from '@gsap/react';
import { GripVertical, GripHorizontal } from 'lucide-react';

gsap.registerPlugin(Draggable, useGSAP);

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeAlt?: string;
  afterAlt?: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforePosition?: string;
  afterPosition?: string;
  initialPosition?: number;
  orientation?: 'horizontal' | 'vertical';
  dividerWidth?: number;
  dividerColor?: string;
  handleColor?: string;
  handleSize?: number;
  showLabels?: boolean;
  showPercentage?: boolean;
  ariaLabel?: string;
  className?: string;
  imageClassName?: string;
}

export default function ComparisonSlider({
  beforeImage,
  afterImage,
  beforeAlt = 'Avant',
  afterAlt = 'Apres',
  beforeLabel = 'Avant',
  afterLabel = 'Apres',
  beforePosition = 'center',
  afterPosition = 'center',
  initialPosition = 50,
  orientation = 'horizontal',
  dividerWidth = 3,
  dividerColor = 'rgba(232, 0, 45, 0.95)',
  handleColor = '#ffffff',
  handleSize = 54,
  showLabels = true,
  showPercentage = false,
  ariaLabel = 'Comparaison avant et apres',
  className,
  imageClassName,
}: ComparisonSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const beforeRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const percentageRef = useRef<HTMLSpanElement>(null);
  const draggableRef = useRef<Draggable | null>(null);
  const currentPositionRef = useRef(initialPosition);
  const [isDragging, setIsDragging] = useState(false);

  const isHorizontal = orientation === 'horizontal';

  useGSAP(
    () => {
      const container = containerRef.current;
      const slider = sliderRef.current;
      const beforeLayer = beforeRef.current;
      const afterLayer = afterRef.current;
      if (!container || !slider || !beforeLayer || !afterLayer) return;

      const updateClip = (rawValue: number) => {
        const rect = container.getBoundingClientRect();
        const limit = isHorizontal ? rect.width : rect.height;
        const value = Math.max(0, Math.min(limit, rawValue));
        const percentage = limit === 0 ? initialPosition : (value / limit) * 100;
        currentPositionRef.current = percentage;

        if (percentageRef.current) {
          percentageRef.current.textContent = `${Math.round(percentage)}%`;
        }

        if (isHorizontal) {
          gsap.set(slider, { x: value, y: 0 });
          gsap.set(beforeLayer, {
            clipPath: `inset(0px ${Math.max(0, rect.width - value)}px 0px 0px)`,
          });
          gsap.set(afterLayer, {
            clipPath: `inset(0px 0px 0px ${value}px)`,
          });
        } else {
          gsap.set(slider, { x: 0, y: value });
          gsap.set(beforeLayer, {
            clipPath: `inset(0px 0px ${Math.max(0, rect.height - value)}px 0px)`,
          });
          gsap.set(afterLayer, {
            clipPath: `inset(${value}px 0px 0px 0px)`,
          });
        }
      };

      const setFromPercentage = (percentage: number) => {
        const rect = container.getBoundingClientRect();
        const limit = isHorizontal ? rect.width : rect.height;
        updateClip((percentage / 100) * limit);
      };

      setFromPercentage(initialPosition);

      const instances = Draggable.create(slider, {
        type: isHorizontal ? 'x' : 'y',
        bounds: container,
        onPress: () => setIsDragging(true),
        onDrag: function () {
          updateClip(isHorizontal ? this.x : this.y);
        },
        onRelease: () => setIsDragging(false),
        onThrowUpdate: function () {
          updateClip(isHorizontal ? this.x : this.y);
        },
      });

      draggableRef.current = instances[0] ?? null;

      return () => {
        draggableRef.current?.kill();
        draggableRef.current = null;
      };
    },
    { scope: containerRef, dependencies: [beforeImage, afterImage, initialPosition, orientation] },
  );

  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current;
      const slider = sliderRef.current;
      const beforeLayer = beforeRef.current;
      const afterLayer = afterRef.current;
      if (!container || !slider || !beforeLayer || !afterLayer) return;

      draggableRef.current?.applyBounds(container);
      const rect = container.getBoundingClientRect();
      const limit = isHorizontal ? rect.width : rect.height;
      const value = (currentPositionRef.current / 100) * limit;

      if (isHorizontal) {
        gsap.set(slider, { x: value, y: 0 });
        gsap.set(beforeLayer, { clipPath: `inset(0px ${Math.max(0, rect.width - value)}px 0px 0px)` });
        gsap.set(afterLayer, { clipPath: `inset(0px 0px 0px ${value}px)` });
      } else {
        gsap.set(slider, { x: 0, y: value });
        gsap.set(beforeLayer, { clipPath: `inset(0px 0px ${Math.max(0, rect.height - value)}px 0px)` });
        gsap.set(afterLayer, { clipPath: `inset(${value}px 0px 0px 0px)` });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isHorizontal]);

  const icon = isHorizontal
    ? <GripVertical size={16} strokeWidth={2.2} />
    : <GripHorizontal size={16} strokeWidth={2.2} />;

  return (
    <div
      className={cx('comparison-slider', className)}
      role="region"
      aria-label={ariaLabel}
    >
      <div ref={containerRef} className="comparison-slider__viewport">
        <div ref={beforeRef} className="comparison-slider__layer">
          <img
            src={beforeImage}
            alt={beforeAlt}
            className={cx('comparison-slider__image', imageClassName)}
            style={{ objectPosition: beforePosition }}
            draggable={false}
          />
          {showLabels ? (
            <span className="comparison-slider__label comparison-slider__label--before">
              {beforeLabel}
            </span>
          ) : null}
        </div>

        <div ref={afterRef} className="comparison-slider__layer">
          <img
            src={afterImage}
            alt={afterAlt}
            className={cx('comparison-slider__image', imageClassName)}
            style={{ objectPosition: afterPosition }}
            draggable={false}
          />
          {showLabels ? (
            <span className="comparison-slider__label comparison-slider__label--after">
              {afterLabel}
            </span>
          ) : null}
        </div>

        <div
          ref={sliderRef}
          className={cx(
            'comparison-slider__handle-track',
            isHorizontal ? 'is-horizontal' : 'is-vertical',
          )}
        >
          <div
            className="comparison-slider__divider"
            style={{
              [isHorizontal ? 'width' : 'height']: `${dividerWidth}px`,
              background: dividerColor,
              boxShadow: `0 0 32px ${dividerColor}`,
            }}
          />
          <div
            className={cx(
              'comparison-slider__handle',
              isDragging && 'is-dragging',
            )}
            style={{
              width: `${handleSize}px`,
              height: `${handleSize}px`,
              backgroundColor: handleColor,
              color: '#050505',
              boxShadow: `0 0 0 1px rgba(255,255,255,0.14), 0 10px 40px rgba(0,0,0,0.45), 0 0 26px ${dividerColor}`,
            }}
          >
            {icon}
          </div>
        </div>

        {showPercentage ? (
          <span ref={percentageRef} className="comparison-slider__percentage">
            {Math.round(initialPosition)}%
          </span>
        ) : null}
      </div>
    </div>
  );
}
