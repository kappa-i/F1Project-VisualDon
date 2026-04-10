"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
} from 'motion/react';
import type { PanInfo } from 'motion/react';

function cn(...classes: (string | undefined | false | null | 0)[]) {
  return classes.filter(Boolean).join(' ');
}

export interface AnimatedListItem {
  id: string | number;
  content: React.ReactNode;
}

export interface AnimatedListProps {
  items: AnimatedListItem[];
  duration?: number;
  easing?: [number, number, number, number];
  autoAddDelay?: number;
  maxItems?: number;
  startFrom?: 'top' | 'center' | 'bottom';
  animationType?: 'slide' | 'fade' | 'scale' | 'bounce' | 'blur';
  enterFrom?: 'top' | 'bottom' | 'left' | 'right';
  pauseOnHover?: boolean;
  hoverEffect?: 'none' | 'scale';
  clickEffect?: 'none' | 'ripple' | 'press';
  fadeEdges?: boolean;
  fadeEdgeSize?: number;
  fadeColor?: string;
  swipeToDismiss?: boolean;
  onDismiss?: (item: AnimatedListItem) => void;
  onItemClick?: (item: AnimatedListItem) => void;
  itemGap?: number;
  className?: string;
  renderItem?: (item: AnimatedListItem) => React.ReactNode;
  height?: string | number;
  onScrollStateChange?: (state: { atTop: boolean; atBottom: boolean }) => void;
}

const Ripple = ({
  x,
  y,
  onComplete,
}: {
  x: number;
  y: number;
  onComplete: () => void;
}) => (
  <motion.span
    className="animated-list__ripple"
    style={{ left: x, top: y, x: '-50%', y: '-50%' }}
    initial={{ width: 0, height: 0, opacity: 0.5 }}
    animate={{ width: 300, height: 300, opacity: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
    onAnimationComplete={onComplete}
  />
);

const AnimatedListItemComponent = ({
  item,
  itemRenderer,
  hoverEffect,
  clickEffect,
  swipeToDismiss,
  onDismiss,
  onItemClick,
}: {
  item: AnimatedListItem;
  itemRenderer: (item: AnimatedListItem) => React.ReactNode;
  hoverEffect: string;
  clickEffect: string;
  swipeToDismiss: boolean;
  onDismiss?: (item: AnimatedListItem) => void;
  onItemClick?: (item: AnimatedListItem) => void;
}) => {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const rippleIdRef = useRef(0);
  const itemRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0]);
  const rotateZ = useTransform(x, [-150, 0, 150], [-10, 0, 10]);
  const swipeIndicatorOpacity = useTransform(x, [-100, -50, 50, 100], [1, 0, 0, 1]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 100 && swipeToDismiss) {
      onDismiss?.(item);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (clickEffect === 'ripple' && itemRef.current) {
      const rect = itemRef.current.getBoundingClientRect();
      const rippleX = e.clientX - rect.left;
      const rippleY = e.clientY - rect.top;
      const id = rippleIdRef.current++;
      setRipples(prev => [...prev, { id, x: rippleX, y: rippleY }]);
    }
    onItemClick?.(item);
  };

  const removeRipple = (id: number) => {
    setRipples(prev => prev.filter(ripple => ripple.id !== id));
  };

  return (
    <motion.div
      ref={itemRef}
      className={cn(
        'animated-list__item-shell',
        onItemClick && 'animated-list__item-shell--clickable',
      )}
      drag={swipeToDismiss ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.5}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      onMouseDown={() => clickEffect === 'press' && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      animate={{ scale: isPressed ? 0.97 : 1 }}
      whileHover={hoverEffect === 'scale' ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.15 }}
    >
      {swipeToDismiss ? (
        <motion.div className="animated-list__swipe-indicator" style={{ opacity: swipeIndicatorOpacity }}>
          <span>Dismiss</span>
        </motion.div>
      ) : null}

      <motion.div
        className="animated-list__item-body"
        style={swipeToDismiss ? { x, opacity, rotateZ } : undefined}
      >
        {itemRenderer(item)}
      </motion.div>

      {ripples.map(ripple => (
        <Ripple
          key={ripple.id}
          x={ripple.x}
          y={ripple.y}
          onComplete={() => removeRipple(ripple.id)}
        />
      ))}
    </motion.div>
  );
};

export default function AnimatedList({
  items: initialItems,
  duration = 0.4,
  easing = [0.25, 0.46, 0.45, 0.94],
  autoAddDelay = 2000,
  maxItems = 10,
  startFrom = 'center',
  animationType = 'slide',
  enterFrom = 'top',
  pauseOnHover = false,
  hoverEffect = 'none',
  clickEffect = 'none',
  fadeEdges = true,
  fadeEdgeSize = 80,
  fadeColor,
  swipeToDismiss = false,
  onDismiss,
  onItemClick,
  itemGap = 12,
  className,
  renderItem,
  height = '600px',
  onScrollStateChange,
}: AnimatedListProps) {
  const [items, setItems] = useState<AnimatedListItem[]>(() => initialItems);
  const itemIndexRef = useRef(initialItems.length);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setItems(initialItems);
    itemIndexRef.current = initialItems.length;
  }, [initialItems]);

  const reportScrollState = useCallback(() => {
    const scrollEl = scrollRef.current;
    if (!scrollEl || !onScrollStateChange) return;

    const maxScrollTop = Math.max(0, scrollEl.scrollHeight - scrollEl.clientHeight);
    const atTop = scrollEl.scrollTop <= 1;
    const atBottom = scrollEl.scrollTop >= maxScrollTop - 1;
    onScrollStateChange({ atTop, atBottom });
  }, [onScrollStateChange]);

  useEffect(() => {
    reportScrollState();
  }, [items, reportScrollState]);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (autoAddDelay <= 0 || initialItems.length === 0) {
      return;
    }

    intervalRef.current = setInterval(() => {
      if (isPaused) return;

      setItems(prevItems => {
        const sourceItem = initialItems[itemIndexRef.current % initialItems.length];
        const newItem: AnimatedListItem = {
          id: `${sourceItem.id}-${itemIndexRef.current}`,
          content: sourceItem.content,
        };
        itemIndexRef.current += 1;

        const updatedItems = [newItem, ...prevItems];
        return updatedItems.slice(0, maxItems);
      });
    }, autoAddDelay);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoAddDelay, initialItems, isPaused, maxItems]);

  const handleDismiss = useCallback((item: AnimatedListItem) => {
    setItems(prev => prev.filter(listItem => listItem.id !== item.id));
    onDismiss?.(item);
  }, [onDismiss]);

  const itemRenderer = renderItem || ((item: AnimatedListItem) => (
    <div className="animated-list__item-default">{item.content}</div>
  ));

  const getInitialAnimation = () => {
    const base: Record<string, number | string> = { height: 0, opacity: 0 };

    if (enterFrom === 'left') base.x = -50;
    else if (enterFrom === 'right') base.x = 50;
    else if (enterFrom === 'bottom') base.y = 30;
    else base.y = -30;

    if (animationType === 'scale') base.scale = 0.8;
    if (animationType === 'blur') base.filter = 'blur(10px)';

    return base;
  };

  const getAnimateState = () => {
    const base: Record<string, number | string> = {
      height: 'auto',
      opacity: 1,
      x: 0,
      y: 0,
    };

    if (animationType === 'scale') base.scale = 1;
    if (animationType === 'blur') base.filter = 'blur(0px)';

    return base;
  };

  const getExitAnimation = () => {
    const base: Record<string, number | string> = {
      height: 0,
      opacity: 0,
      y: 20,
    };

    if (animationType === 'scale') base.scale = 0.8;
    if (animationType === 'blur') base.filter = 'blur(10px)';

    return base;
  };

  const getTransition = () => {
    const baseTransition = {
      duration,
      ease: easing,
    };

    if (animationType === 'bounce') {
      return {
        ...baseTransition,
        type: 'spring' as const,
        bounce: 0.4,
        stiffness: 300,
        damping: 20,
      };
    }

    return baseTransition;
  };

  const alignmentClass =
    startFrom === 'center'
      ? 'animated-list__items--center'
      : startFrom === 'bottom'
        ? 'animated-list__items--bottom'
        : '';

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    event.stopPropagation();

    const scrollEl = scrollRef.current;
    if (!scrollEl) return;

    const maxScrollTop = scrollEl.scrollHeight - scrollEl.clientHeight;
    if (maxScrollTop <= 0) return;

    const softenedDelta = event.deltaY * 0.35;
    const nextScrollTop = Math.max(0, Math.min(maxScrollTop, scrollEl.scrollTop + softenedDelta));
    scrollEl.scrollTop = nextScrollTop;
    reportScrollState();
    event.preventDefault();
  };

  return (
    <div className={cn('animated-list', className)} style={{ height }}>
      {fadeEdges ? (
        <>
          <div
            className="animated-list__fade animated-list__fade--top"
            style={{
              height: fadeEdgeSize,
              background: `linear-gradient(to bottom, ${fadeColor || 'var(--surface, #0a0a0a)'} 0%, transparent 100%)`,
            }}
          />
          <div
            className="animated-list__fade animated-list__fade--bottom"
            style={{
              height: fadeEdgeSize,
              background: `linear-gradient(to top, ${fadeColor || 'var(--surface, #0a0a0a)'} 0%, transparent 100%)`,
            }}
          />
        </>
      ) : null}

      <div
        ref={scrollRef}
        className="animated-list__scroll"
        onWheel={handleWheel}
        onScroll={reportScrollState}
        onMouseEnter={() => pauseOnHover && setIsPaused(true)}
        onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      >
        <ul
          className={cn('animated-list__items', alignmentClass)}
          style={{ gap: `${itemGap}px` }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {items.map(item => (
              <motion.li
                key={item.id}
                layout
                initial={getInitialAnimation()}
                animate={getAnimateState()}
                exit={getExitAnimation()}
                transition={getTransition()}
                style={{ overflow: 'visible', willChange: 'transform, opacity, height' }}
              >
                <AnimatedListItemComponent
                  item={item}
                  itemRenderer={itemRenderer}
                  hoverEffect={hoverEffect}
                  clickEffect={clickEffect}
                  swipeToDismiss={swipeToDismiss}
                  onDismiss={handleDismiss}
                  onItemClick={onItemClick}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}
