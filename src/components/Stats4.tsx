import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import TextScatter from './TextScatter';
import StaggeredText, { StaggeredTextHandle } from './StaggeredText';
import pil1Url from '../assets/Pil1.png';
import pil2Url from '../assets/Pil2.png';
import pil3Url from '../assets/Pil3.png';
import logo1Url from '../assets/logos-slider-optimized/L1.png';
import logo2Url from '../assets/logos-slider-optimized/L2.png';
import logo3Url from '../assets/logos-slider-optimized/L3.png';
import logo4Url from '../assets/logos-slider-optimized/L4.png';
import logo5Url from '../assets/logos-slider-optimized/L5.png';
import logo6Url from '../assets/logos-slider-optimized/L6.png';

const slides = [
  {
    value: 'Nous savions tous que nous pouvions mourir à chaque course.',
    citation: 'Jacky Ickx',
    color: '#8fd3ff',
    glow: 'rgba(143, 211, 255, 0.45)',
    image: pil1Url,
  },
  {
    value: 'La mort fait partie du métier. On l\'accepte ou on arrête.',
    citation: 'Niki Lauda',
    color: '#ff6b6b',
    glow: 'rgba(255, 107, 107, 0.45)',
    image: pil2Url,
  },
  {
    value: 'Chaque matin de Grand Prix, je me demandais si c\'était mon dernier.',
    citation: 'James Hunt',
    color: '#ffa94d',
    glow: 'rgba(255, 169, 77, 0.45)',
    image: pil3Url,
  },
];

const FONT = "'Inter', ui-sans-serif, system-ui, sans-serif";
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
];

const skeletonStyle = `
  @keyframes skeleton-sweep {
    0%   { transform: translateX(-100%); opacity: 0; }
    12%  { opacity: 1; }
    88%  { opacity: 1; }
    100% { transform: translateX(250%); opacity: 0; }
  }
  @keyframes arrow-bg-spin {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes arrow-glow-pulse {
    0%, 100% { box-shadow: 0 0 10px 2px rgba(225,6,0,0.55), 0 2px 12px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.12); }
    50%       { box-shadow: 0 0 22px 6px rgba(225,6,0,0.85), 0 4px 18px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.18); }
  }

`;

function ChevronSweep({ color = '#8fd3ff' }: { color?: string }) {
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
                  <circle cx={x} cy={yTop} r={radius} fill={color} />
                  <circle cx={x} cy={yBottom} r={radius} fill={color} />
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

  const SPEED = 36; // px/s

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
                minWidth: '128px',
                padding: '0 20px',
              }}
            >
              <img
                src={team.src}
                alt={team.name}
                style={{
                  display: 'block',
                  width: 'auto',
                  height: '39px',
                  maxWidth: '148px',
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
  const [ctaSkeletonRun, setCtaSkeletonRun] = useState(0);
  const [ctaSkeletonVisible, setCtaSkeletonVisible] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const staggerRef = useRef<StaggeredTextHandle>(null);

  useEffect(() => {
    // Exit text 1.2s before slide change
    const exitId = setTimeout(() => staggerRef.current?.exit(), 8800);
    const slideId = setTimeout(() => {
      setSlideIndex(i => (i + 1) % slides.length);
    }, 10000);
    return () => { clearTimeout(exitId); clearTimeout(slideId); };
  }, [slideIndex]);

  // Replay stagger animation on each new slide
  useEffect(() => {
    staggerRef.current?.replay();
  }, [slideIndex]);

  const triggerCtaSkeleton = () => {
    setCtaSkeletonVisible(true);
    setCtaSkeletonRun((run) => run + 1);
  };

  const handleDiscoverClick = () => {
    window.dispatchEvent(new CustomEvent('hero-next-step'));
  };

  return (
    <>
    <style>{skeletonStyle}</style>
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
              textShadow: '0 10px 24px rgba(0, 0, 0, 0.48), 0 3px 10px rgba(0, 0, 0, 0.24)',
            }}
          >
            <TextScatter text="L'histoire de la" velocity={180} rotation={80} returnAfter={0.8} duration={1.8} />
            <br />
            <TextScatter text="sécurité en " velocity={180} rotation={80} returnAfter={0.8} duration={1.8} />
            <TextScatter text="F1" velocity={180} rotation={80} returnAfter={0.8} duration={1.8} charStyle={{ color: '#e10600' }} />
          </motion.h2>

          {/* Description + Button – bottom left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <LogoMarquee />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                margin: 0,
                marginBottom: '15px',
                fontSize: 'clamp(12px, 0.96vw, 15px)',
                color: '#9d9d9d',
                lineHeight: 1.85,
                maxWidth: '420px',
                fontFamily: FONT,
              }}
            >
              De l’ère des gladiateurs aux monoplaces ultra-sécurisées d’aujourd’hui, laissez-vous guider à travers une exploration interactive de l’évolution de la sécurité en Formule 1.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={handleDiscoverClick}
              onMouseEnter={triggerCtaSkeleton}
              onMouseLeave={() => setCtaSkeletonVisible(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                padding: '2px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.17)',
                width: 'fit-content',
                cursor: 'pointer',
                pointerEvents: 'auto',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {ctaSkeletonVisible ? (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)',
                  animation: 'skeleton-sweep 1.1s ease-out 1',
                  borderRadius: '12px',
                }} key={ctaSkeletonRun} onAnimationEnd={() => setCtaSkeletonVisible(false)} />
              ) : null}
              <button
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '10px 22px',
                  borderRadius: '10px',
                  background: '#0000008a',
                  color: '#fff',
                  fontWeight: 500,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: FONT,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  transformOrigin: 'left center',
                }}
              >
                <span>Scrollez pour démarrer...</span>
              </button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginLeft: '8px', marginRight: '-2px', flexShrink: 0, color: '#fff', order: -1 }}
                aria-hidden="true"
              >
                <rect x="5" y="2" width="14" height="20" rx="7" />
                <path d="M12 6v4" />
              </svg>
            </motion.div>
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
          <div
            style={{
              position: 'relative',
              width: 'min(100%, 360px)',
              borderRadius: '28px',
              boxShadow: '0 30px 90px rgba(0,0,0,0.34), 0 0 65px rgba(0,0,0,0.18)',
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.12 }}
              transition={{ duration: 0.5, delay: 0.2, scale: { duration: 0.25, ease: 'easeOut' } }}
              style={{
                position: 'relative',
                width: '100%',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '24px',
                transformOrigin: 'bottom right',
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
            
            <AnimatePresence mode="wait">
              <motion.div
                key={slideIndex + '-bg'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                style={{ position: 'absolute', inset: 0, zIndex: 1 }}
              >
                <ChevronSweep color={slides[slideIndex].color} />
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={slideIndex + '-img'}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 0.72, x: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.5 } }}
                transition={{ duration: 0.6, ease: [0, 0, 0.2, 1] }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 2,
                  pointerEvents: 'none',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={slides[slideIndex].image}
                  alt=""
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    display: 'block',
                  }}
                />
              </motion.div>
            </AnimatePresence>

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
              <StaggeredText
                ref={staggerRef}
                text={`« ${slides[slideIndex].value} »`}
                as="p"
                segmentBy="words"
                direction="top"
                blur={true}
                delay={55}
                duration={0.5}
                staggerDirection="forward"
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
              />

              <AnimatePresence mode="wait">
                <motion.p
                  key={slideIndex + '-citation'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4, delay: 0.08 }}
                  style={{
                    margin: 0,
                    alignSelf: 'flex-end',
                    fontSize: 'clamp(15px, 1.08vw, 18px)',
                    lineHeight: 1.2,
                    color: slides[slideIndex].color,
                    fontFamily: FONT_F1,
                    fontWeight: 700,
                    textAlign: 'right',
                    textShadow: `0 2px 8px rgba(0,0,0,0.8), 0 0 20px ${slides[slideIndex].glow}`,
                  }}
                >
                  {slides[slideIndex].citation}
                </motion.p>
              </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
