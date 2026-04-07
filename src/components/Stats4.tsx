import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimate, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import TextScatter from './TextScatter';
import StaggeredText, { StaggeredTextHandle } from './StaggeredText';
import pilot1Url from '../assets/pilot1.png';
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
  },
  {
    value: 'La mort fait partie du métier. On l\'accepte ou on arrête.',
    citation: 'Niki Lauda',
    color: '#ff6b6b',
    glow: 'rgba(255, 107, 107, 0.45)',
  },
  {
    value: 'Chaque matin de Grand Prix, je me demandais si c\'était mon dernier.',
    citation: 'James Hunt',
    color: '#ffa94d',
    glow: 'rgba(255, 169, 77, 0.45)',
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
];

const skeletonStyle = `
  @keyframes skeleton-sweep {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(250%); }
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
                minWidth: '132px',
                padding: '0 9px',
              }}
            >
              <img
                src={team.src}
                alt={team.name}
                style={{
                  display: 'block',
                  width: 'auto',
                  height: '36px',
                  maxWidth: '142px',
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
  const [btnScope, animateBtn] = useAnimate();
  const [scrollTriggered, setScrollTriggered] = useState(false);
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

  const runSwipeAnim = async () => {
    if (scrollTriggered) return;
    setScrollTriggered(true);

    // 1. Texte disparaît
    await animateBtn('button span', { opacity: 0 }, { duration: 0.25, ease: 'easeOut' });

    // 2. Le bloc se rétrecit depuis la droite vers la gauche (transformOrigin: left)
    await animateBtn('button', { scaleX: 0.12 }, { duration: 0.38, ease: [0.4, 0, 0.2, 1] });

    // 3. Slide vers la droite — iPhone unlock
    await animateBtn('button', { x: 280 }, { duration: 0.38, ease: [0.4, 0.0, 1, 1] });

    // 4. Snap hors champ à gauche, restore scaleX (clippé par overflow:hidden)
    animateBtn('button', { x: -280, scaleX: 1 }, { duration: 0 });

    // 5. Slide retour depuis la gauche
    await animateBtn('button', { x: 0 }, { duration: 0.42, ease: [0.0, 0.0, 0.2, 1] });

    // 6. Texte revient
    await animateBtn('button span', { opacity: 1 }, { duration: 0.28, ease: 'easeIn' });

    setScrollTriggered(false);
  };

  useEffect(() => {
    window.addEventListener('wheel', runSwipeAnim, { once: true });
    window.addEventListener('scroll', runSwipeAnim, { once: true });
    return () => {
      window.removeEventListener('wheel', runSwipeAnim);
      window.removeEventListener('scroll', runSwipeAnim);
    };
  }, [scrollTriggered]);

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
              textShadow: '0 12px 34px rgba(0, 0, 0, 0.62), 0 4px 14px rgba(0, 0, 0, 0.34)',
            }}
          >
            <TextScatter text="L'histoire de la" velocity={180} rotation={80} returnAfter={0.8} duration={1.8} />
            <br />
            <TextScatter text="sécurité en " velocity={180} rotation={80} returnAfter={0.8} duration={1.8} />
            <TextScatter text="F1" velocity={180} rotation={80} returnAfter={0.8} duration={1.8} charStyle={{ color: '#e10600' }} />
          </motion.h2>

          {/* Description + Button – bottom left */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            <LogoMarquee />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                margin: 0,
                fontSize: 'clamp(13px, 1.02vw, 16px)',
                color: 'rgba(255,255,255,0.55)',
                lineHeight: 1.7,
                maxWidth: '420px',
                fontFamily: FONT,
              }}
            >
              De l’ère des gladiateurs aux monoplaces ultra-sécurisées d’aujourd’hui. Une exploration interactive de l’évolution de la sécurité en Formule 1.
            </motion.p>

            <motion.div
              ref={btnScope}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={handleDiscoverClick}
              onMouseEnter={runSwipeAnim}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                padding: '4px',
                borderRadius: '12px',
                background: 'rgba(255,255,255,0.1)',
                width: 'fit-content',
                cursor: 'pointer',
                pointerEvents: 'auto',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* skeleton shimmer */}
              <div style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)',
                animation: 'skeleton-sweep 2s ease-in-out infinite',
                borderRadius: '12px',
              }} />
              <button
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '10px 22px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.3)',
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
              <ArrowRight size={18} color="#fff" style={{ marginRight: '12px', flexShrink: 0 }} />
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.12 }}
            transition={{ duration: 0.5, delay: 0.2, scale: { duration: 0.25, ease: 'easeOut' } }}
            style={{
              position: 'relative',
              width: 'min(100%, 360px)',
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
                    textShadow: `0 0 14px ${slides[slideIndex].glow}`,
                  }}
                >
                  {slides[slideIndex].citation}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
    </>
  );
}
