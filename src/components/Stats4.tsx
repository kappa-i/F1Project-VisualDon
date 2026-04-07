import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import pilot1Url from '../assets/pilot1.png';
import logo1Url from '../assets/logos-slider-optimized/L1.png';
import logo2Url from '../assets/logos-slider-optimized/L2.png';
import logo3Url from '../assets/logos-slider-optimized/L3.png';
import logo4Url from '../assets/logos-slider-optimized/L4.png';
import logo5Url from '../assets/logos-slider-optimized/L5.png';
import logo6Url from '../assets/logos-slider-optimized/L6.png';
import logo7Url from '../assets/logos-slider-optimized/L7.png';

const stats = [
  {
    label: 'Records processed',
    value: 'Nous savions tous que nous pouvions mourir a chaque course.',
    highlight: false,
    citation: 'Jacky Ickx',
  },
];

const FONT = 'ui-sans-serif, system-ui, -apple-system, sans-serif';
const FONT_F1 = 'Formula1, sans-serif';
const CARD_LAYOUTS = {
  left: ['180px', '180px'],
  right: ['230px', '130px'],
};
const TEAM_LOGOS = [
  { name: 'Logo 1', src: logo1Url },
  { name: 'Logo 2', src: logo2Url },
  { name: 'Logo 3', src: logo3Url },
  { name: 'Logo 4', src: logo4Url },
  { name: 'Logo 5', src: logo5Url },
  { name: 'Logo 6', src: logo6Url },
  { name: 'Logo 7', src: logo7Url },
];

function ChevronSweep() {
  const dots = Array.from({ length: 11 }, (_, index) => index);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
        opacity: 0.32,
      }}
    >
      {[0, 1, 2].map((row) => (
        <div
          key={row}
          style={{
            position: 'absolute',
            top: `${14 + row * 23}%`,
            left: '-34%',
            width: '54%',
            height: '42%',
            animation: `stats4-chevron-sweep 4.1s linear ${row * 0.16}s infinite`,
            filter: 'blur(0.2px)',
          }}
        >
          <svg
            viewBox="0 0 180 84"
            preserveAspectRatio="none"
            style={{ width: '100%', height: '100%' }}
          >
            {dots.map((index) => {
              const t = index / (dots.length - 1);
              const x = 10 + t * 92;
              const yTop = 10 + t * 32;
              const yBottom = 74 - t * 32;
              const radius = 3.1 + t * 1.8;

              return (
                <React.Fragment key={index}>
                  <circle cx={x} cy={yTop} r={radius} fill="#8fd3ff" />
                  <circle cx={x} cy={yBottom} r={radius} fill="#8fd3ff" />
                </React.Fragment>
              );
            })}
          </svg>
        </div>
      ))}
    </div>
  );
}

function LogoMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const cycleWidthRef = useRef(0);
  const offsetRef = useRef(0);
  const rafRef = useRef(0);

  const SPEED = 42; // px/s

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const measure = () => {
      const widths = TEAM_LOGOS.map((_, i) => itemRefs.current[i]?.getBoundingClientRect().width ?? 0);
      if (widths.every(w => w > 0)) {
        cycleWidthRef.current = widths.reduce((s, w) => s + w, 0);
      }
    };

    const ro = new ResizeObserver(measure);
    ro.observe(container);
    measure();

    let lastTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(now - lastTime, 50); // cap delta pour eviter les gros sauts
      lastTime = now;

      if (cycleWidthRef.current > 0) {
        offsetRef.current += SPEED * (dt / 1000);
        if (offsetRef.current >= cycleWidthRef.current) {
          offsetRef.current -= cycleWidthRef.current;
        }
        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  // 2 copies suffisent pour le loop seamless
  const allLogos = [...TEAM_LOGOS, ...TEAM_LOGOS];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.08 }}
      style={{
        width: 'min(100%, 520px)',
        alignSelf: 'flex-start',
      }}
    >
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            width: 'max-content',
            padding: '12px 0',
            willChange: 'transform',
          }}
        >
          {allLogos.map((team, index) => (
            <div
              key={`${index}-${team.name}`}
              ref={node => {
                if (index < TEAM_LOGOS.length) itemRefs.current[index] = node;
              }}
              style={{
                flex: '0 0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '148px',
                padding: '0 12px',
              }}
            >
              <img
                src={team.src}
                alt={team.name}
                style={{
                  display: 'block',
                  width: 'auto',
                  height: '42px',
                  maxWidth: '160px',
                  objectFit: 'contain',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Stats4() {
  const handleDiscoverClick = () => {
    window.dispatchEvent(new CustomEvent('hero-next-step'));
  };

  return (
    <section
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'stretch',
        padding: '64px',
        background: 'transparent',
        fontFamily: FONT,
        boxSizing: 'border-box',
        zIndex: 2,
        pointerEvents: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(320px, 360px)',
          gap: '48px',
          alignItems: 'stretch',
        }}
      >
        {/* ── Left column ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Title – top left */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              margin: 0,
              fontSize: 'clamp(34px, 4.2vw, 62px)',
              fontWeight: 700,
              letterSpacing: '0.03em',
              color: '#fff',
              lineHeight: 1.18,
              fontFamily: FONT_F1,
              textShadow: '0 6px 18px rgba(0, 0, 0, 0.55)',
            }}
          >
            L&apos;histoire de la<br />sécurité en <span style={{ color: '#e10600' }}>F1</span>
          </motion.h2>

          {/* Description + Button – bottom left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <LogoMarquee />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                margin: 0,
                fontSize: 'clamp(15px, 1.2vw, 18px)',
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.7,
                maxWidth: '420px',
                fontFamily: FONT,
              }}
            >
              Peut-on aller plus vite en étant plus en sécurité&nbsp;?
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                borderRadius: '9999px',
                background: '#fff',
                color: '#08080b',
                fontWeight: 500,
                fontSize: '15px',
                border: 'none',
                cursor: 'pointer',
                width: 'fit-content',
                fontFamily: FONT,
                transition: 'background 0.2s',
                pointerEvents: 'auto',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e5e5e5')}
              onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
              onClick={handleDiscoverClick}
            >
              Découvrir
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </div>

        {/* ── Right column – stats at the bottom ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
          }}
        >
          <motion.div
            key={stats[0].label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              position: 'relative',
              width: 'min(100%, 360px)',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.08)',
              padding: '24px',
              minHeight: CARD_LAYOUTS.right[0],
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              overflow: 'hidden',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}
          >
            <ChevronSweep />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 2,
                pointerEvents: 'none',
                backgroundImage: `url(${pilot1Url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: 0.72,
              }}
            />

            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.16) 1px, transparent 0)',
                backgroundSize: '14px 14px',
                zIndex: 0,
                maskImage: 'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.82) 34%, rgba(0,0,0,0.42) 68%, rgba(0,0,0,0.1) 100%)',
                WebkitMaskImage:
                  'linear-gradient(135deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.82) 34%, rgba(0,0,0,0.42) 68%, rgba(0,0,0,0.1) 100%)',
              }}
            />

            <div
              style={{
                position: 'relative',
                zIndex: 3,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                gap: '16px',
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 'clamp(14px, 1.08vw, 18px)',
                  fontWeight: 500,
                  letterSpacing: '0.02em',
                  color: '#fff',
                  fontFamily: FONT_F1,
                  lineHeight: 1.16,
                  maxWidth: '55%',
                }}
              >
                {`« ${stats[0].value} »`}
              </p>

              <p
                style={{
                  margin: 0,
                  alignSelf: 'flex-end',
                  fontSize: 'clamp(15px, 1.08vw, 18px)',
                  lineHeight: 1.2,
                  color: '#8fd3ff',
                  fontFamily: FONT_F1,
                  fontWeight: 700,
                  textAlign: 'right',
                  textShadow: '0 0 14px rgba(143, 211, 255, 0.45)',
                }}
              >
                {stats[0].citation}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
