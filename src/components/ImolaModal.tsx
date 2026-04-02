import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

type ImolaState = -1 | 0 | 1;

// ─── Path data ──────────────────────────────────────────────────────────────
const OLD_CIRCUIT =
  'M288.29,324.37c26.3-6.52,89.63-17.71,101.26-29.89c17.63-5.97,27.2-10.43,28.27-37.83' +
  'c7.2-22.84,25.36-97.58,28.02-118.2c3.26-12.28-0.26-16.81,5.61-30.55' +
  'c13.64-16.02,24.82-33.2,34.34-49.39c-5.01-18-11.07-8.68-100.4,11.86' +
  'c-18.94,4.46-46.3-8.15-62.9,4.66c-6.87,17.1-15.12,33.95-11.93,44.66' +
  'c1.9,12.23-5.17,26.43-0.25,38.61c3.33,8.26,19.97,13.79,18.63,24.07' +
  'c-7.73,37.51-17.57,15.4-35.75,19.99c-21.83,1.74-57.32,10.76-79.38,11.55' +
  'c-31.67,18.51-30.7-21.01-45.89,5.99c-16.59,9.79-40.09,18.42-51.56,34.14' +
  'c-10.99,14.58-21.89,29.64-32.24,44.38c-14.16,12.01-23.32,28.43-41.9,33.93' +
  'c-22.23,7.5-2.07,34.86,12.59,38.88c8.29-1.47,42.65-27.47,63.96-33.7' +
  'c14.7-4.3,15.04,12.43,29.44,5.82c13.29-6.11,22.58-17.02,31.86-23.32' +
  'c8.86-6.01,17.93-7.64,22.39-4.97c16.73,5.53,34.79,3.61,52.08,6.85' +
  'C259.51,322.67,284.28,320.92,288.29,324.37z';

// Padded with a zero-displacement command so command count matches NEW_CIRCUIT
// → lets gsap.to(el, {attr:{d:…}}) interpolate correctly between the two
const OLD_CIRCUIT_MORPH =
  'M288.29,324.37c26.3-6.52,89.63-17.71,101.26-29.89c17.63-5.97,27.2-10.43,28.27-37.83' +
  'c7.2-22.84,25.36-97.58,28.02-118.2c3.26-12.28-0.26-16.81,5.61-30.55' +
  'c13.64-16.02,24.82-33.2,34.34-49.39c-5.01-18-11.07-8.68-100.4,11.86' +
  'c-18.94,4.46-46.3-8.15-62.9,4.66c-6.87,17.1-15.12,33.95-11.93,44.66' +
  'c1.9,12.23-5.17,26.43-0.25,38.61c3.33,8.26,19.97,13.79,18.63,24.07' +
  'c-7.73,37.51-17.57,15.4-35.75,19.99c-21.83,1.74-57.32,10.76-79.38,11.55' +
  'c-31.67,18.51-30.7-21.01-45.89,5.99c-16.59,9.79-40.09,18.42-51.56,34.14' +
  'c-10.99,14.58-21.89,29.64-32.24,44.38c-14.16,12.01-23.32,28.43-41.9,33.93' +
  'c-22.23,7.5-2.07,34.86,12.59,38.88c8.29-1.47,42.65-27.47,63.96-33.7' +
  'c14.7-4.3,15.04,12.43,29.44,5.82c13.29-6.11,22.58-17.02,31.86-23.32' +
  'c8.86-6.01,17.93-7.64,22.39-4.97c16.73,5.53,34.79,3.61,52.08,6.85' +
  'c0,0,0,0,0,0' + // ← padding command (will interpolate to the new chicane offset)
  'C259.51,322.67,284.28,320.92,288.29,324.37z';

const NEW_CIRCUIT =
  'M392.46,290.92c3.8-1.57,0.92-10.22,3.76-14.25c5.68-8.06,31.48-6.09,36.43-14.87' +
  'c7.2-22.84,10.53-102.72,13.19-123.34c3.26-12.28-0.26-16.81,5.61-30.55' +
  'c13.64-16.02,24.82-33.2,34.34-49.39c-5.01-18-11.07-8.68-100.4,11.86' +
  'c-18.94,4.46-46.3-8.15-62.9,4.66c-6.87,17.1-15.12,33.95-11.93,44.66' +
  'c1.9,12.23-5.17,26.43-0.25,38.61c3.33,8.26,19.97,13.79,18.63,24.07' +
  'c-7.73,37.51-17.57,15.4-35.75,19.99c-21.83,1.74-57.32,10.76-79.38,11.55' +
  'c-31.67,18.51-30.7-21.01-45.89,5.99c-16.59,9.79-40.09,18.42-51.56,34.14' +
  'c-10.99,14.58-21.89,29.64-32.24,44.38c-14.16,12.01-23.32,28.43-41.9,33.93' +
  'c-22.23,7.5-2.07,34.86,12.59,38.88c8.29-1.47,42.65-27.47,63.96-33.7' +
  'c14.7-4.3,15.04,12.43,29.44,5.82c13.29-6.11,22.58-17.02,31.86-23.32' +
  'c8.86-6.01,17.93-7.64,22.39-4.97c16.73,5.53,34.79,3.61,52.08,6.85' +
  'c4.97,0.76,29.74-0.99,33.75,2.46' + // ← the chicane extra offset
  'C314.59,317.86,367.15,301.38,392.46,290.92z';

const PIT_LANE =
  'M172.8,328.59c8.44,0.4,4.92,0.11,13.17,2.33c5.92,3.03,12.79,2.59,19.01,4.73' +
  'c4.14,0.73,10.25,2.86,13.39,0.91c1.13-4.34,3.31-9.72,8.86-8.09' +
  'c6.78,1.66,13.96,0.97,20.56,3.51c6.74,2.51,13.96,2.82,20.94,4.23' +
  'c8.18,0.73,16.83-0.37,23.81-4.95c4.72-1.32,8.51-4.49,12.63-6.98c1.17-0.95,2.37-1.9,3.74-2.55';

// Circle at Tamburello — path goes L→T→R→B clockwise in screen coords
const TAMBURELLO_CIRCLE =
  'M378.32,282.94c0.03-14.49,11.59-26.21,25.83-26.18c14.24,0.03,25.75,11.8,25.72,26.29' +
  'c-0.03,14.49-11.59,26.21-25.83,26.18c-14.21-0.03-25.72-11.77-25.72-26.24';

// ─── Component ──────────────────────────────────────────────────────────────
const ImolaModal: React.FC = () => {
  const [imolaState, setImolaState] = useState<ImolaState>(-1);

  const modalRef    = useRef<HTMLDivElement>(null);
  const circuitRef  = useRef<HTMLDivElement>(null);   // left column
  const textRef     = useRef<HTMLDivElement>(null);   // right column

  // SVG element refs (single shared SVG — we swap the path d attr for the morph)
  const trackPathRef  = useRef<SVGPathElement>(null); // main circuit
  const redDotRef     = useRef<SVGPathElement>(null); // red indicator
  const greenDotRef   = useRef<SVGPathElement>(null); // green indicator (drawn on top)

  const pulseTween = useRef<gsap.core.Tween | null>(null);

  // ── events ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onShow  = () => setImolaState(0);
    const onMorph = () => setImolaState(1);
    const onReset = () => setImolaState(-1);
    window.addEventListener('crash-imola-show',  onShow);
    window.addEventListener('crash-imola-morph', onMorph);
    window.addEventListener('crash-imola-reset', onReset);
    return () => {
      window.removeEventListener('crash-imola-show',  onShow);
      window.removeEventListener('crash-imola-morph', onMorph);
      window.removeEventListener('crash-imola-reset', onReset);
    };
  }, []);

  // ── PHASE 1 : show old layout ─────────────────────────────────────────────
  useEffect(() => {
    if (imolaState !== 0) return;
    const modal   = modalRef.current;
    const circuit = circuitRef.current;
    const text    = textRef.current;
    const track   = trackPathRef.current;
    const redDot  = redDotRef.current;
    const greenDot = greenDotRef.current;
    if (!modal || !circuit || !text || !track || !redDot || !greenDot) return;

    pulseTween.current?.kill();
    gsap.killTweensOf([track, redDot, greenDot]);

    // Reset track to old circuit, full opacity
    gsap.set(track,    { attr: { d: OLD_CIRCUIT }, stroke: '#e82020', opacity: 1,
                         strokeDasharray: 'none', strokeDashoffset: 0 });
    gsap.set(redDot,   { opacity: 0, strokeDasharray: 'none', strokeDashoffset: 0,
                         scale: 1, transformOrigin: '404px 283px' });
    gsap.set(greenDot, { opacity: 0, strokeDasharray: 'none', strokeDashoffset: 0 });

    // ① Simple fade-in for the whole modal + circuit + text
    gsap.fromTo(modal,
      { opacity: 0, x: -36 },
      { opacity: 1, x: 0, duration: 0.75, ease: 'power3.out' }
    );
    gsap.fromTo(circuit,
      { opacity: 0 },
      { opacity: 1, duration: 0.65, ease: 'power2.out', delay: 0.1 }
    );
    gsap.fromTo(text,
      { opacity: 0, x: 12 },
      { opacity: 1, x: 0, duration: 0.65, ease: 'power2.out', delay: 0.2 }
    );

    // ② Indicator circle draws clockwise (dashoffset len→0), starting at delay 0.55s
    requestAnimationFrame(() => {
      const dotLen = redDot.getTotalLength();
      gsap.set(redDot, { opacity: 1, strokeDasharray: dotLen, strokeDashoffset: dotLen });
      gsap.to(redDot, {
        strokeDashoffset: 0,
        duration: 1.1,
        ease: 'power2.inOut',
        delay: 0.55,
        onComplete: () => {
          // Then pulse indefinitely
          pulseTween.current = gsap.to(redDot, {
            scale: 1.2,
            transformOrigin: '404px 283px',
            duration: 0.55,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
          });
        },
      });
    });
  }, [imolaState]);

  // ── PHASE 2 : GSAP morph to modern layout ─────────────────────────────────
  useEffect(() => {
    if (imolaState !== 1) return;
    const text     = textRef.current;
    const track    = trackPathRef.current;
    const redDot   = redDotRef.current;
    const greenDot = greenDotRef.current;
    if (!text || !track || !redDot || !greenDot) return;

    // Stop red pulse
    pulseTween.current?.kill();
    gsap.killTweensOf([redDot]);

    // ① Ghost the old circuit + GSAP attr morph of the d attribute
    //    (OLD_CIRCUIT_MORPH has same command count as NEW_CIRCUIT, so GSAP
    //     can linearly interpolate each coordinate → smooth shape transition)
    gsap.set(track, { attr: { d: OLD_CIRCUIT_MORPH }, stroke: '#e82020' });
    gsap.to(track, {
      attr: { d: NEW_CIRCUIT },
      stroke: '#e8e8e8',          // red → white as the shape morphs
      opacity: 0.18,              // ghost the old track during draw
      duration: 1.6,
      ease: 'power2.inOut',
      onComplete: () => {
        // After morph: restore full visibility of the new circuit
        gsap.to(track, { opacity: 1, duration: 0.5, ease: 'power2.out' });
      },
    });

    // ② Red dot fades to ghost, then green dot draws clockwise on top
    gsap.to(redDot, { opacity: 0.15, duration: 0.5, ease: 'power2.in' });

    requestAnimationFrame(() => {
      const dotLen = greenDot.getTotalLength();
      gsap.set(greenDot, { opacity: 1, strokeDasharray: dotLen, strokeDashoffset: dotLen });
      gsap.to(greenDot, {
        strokeDashoffset: 0,
        duration: 1.1,
        ease: 'power2.inOut',
        delay: 0.3,
        onComplete: () => {
          // Fully hide red dot once green is drawn
          gsap.to(redDot, { opacity: 0, duration: 0.25 });
        },
      });
    });

    // ③ Text cross-fade
    gsap.to(text, {
      opacity: 0, y: -8, duration: 0.35, ease: 'power2.in',
      onComplete: () => {
        gsap.fromTo(text,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
        );
      },
    });
  }, [imolaState]);

  if (imolaState === -1) return null;
  const isModern = imolaState === 1;

  return (
    <div className="imola-modal" ref={modalRef}>

      {/* ── Circuit (left column) ──────────────────────────────────── */}
      <div className="imola-modal__circuit" ref={circuitRef}>
        <svg
          viewBox="0 0 518 420"
          xmlns="http://www.w3.org/2000/svg"
          className="imola-svg"
          aria-hidden="true"
        >
          {/* Pit lane — static, always visible */}
          <path
            d={PIT_LANE}
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Main circuit — morphs between old / new via gsap attr tween */}
          <path
            ref={trackPathRef}
            id="im-track"
            d={OLD_CIRCUIT}
            fill="none"
            stroke="#e82020"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Red indicator at Tamburello — clock-drawn in phase 1 */}
          <path
            ref={redDotRef}
            id="im-red-dot"
            d={TAMBURELLO_CIRCLE}
            fill="none"
            stroke="#ff2020"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Green indicator — clock-drawn on top in phase 2 */}
          <path
            ref={greenDotRef}
            id="im-green-dot"
            d={TAMBURELLO_CIRCLE}
            fill="none"
            stroke="#22dd55"
            strokeWidth="6"
            strokeLinecap="round"
            style={{ opacity: 0 }}
          />
        </svg>
      </div>

      {/* ── Text (right column) ───────────────────────────────────── */}
      <div className="imola-modal__text" ref={textRef}>
        {!isModern ? (
          <>
            <span className="imola-modal__eyebrow">Imola · 1 mai 1994</span>
            <h3 className="imola-modal__title">Courbe Tamburello</h3>
            <p className="imola-modal__body">
              À 295&nbsp;km/h, la Williams de Senna quitte la piste
              dans ce long virage sans échappatoire.
              Un accident fatal qui force la F1 à repenser
              chaque centimètre du circuit.
            </p>
          </>
        ) : (
          <>
            <span className="imola-modal__eyebrow imola-modal__eyebrow--safe">Imola · Aujourd'hui</span>
            <h3 className="imola-modal__title">Chicane de sécurité</h3>
            <p className="imola-modal__body">
              Tamburello est devenu une chicane. La vitesse passe
              de 295 à 80&nbsp;km/h. La mort de Senna
              a changé ce circuit pour toujours.
            </p>
          </>
        )}
      </div>

    </div>
  );
};

export default ImolaModal;
