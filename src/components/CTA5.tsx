import React from 'react';
import { motion } from 'motion/react';

export default function CTA5() {
  return (
    <section
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 16px',
        background: 'transparent',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '32px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -90, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '768px',
              aspectRatio: '1204 / 845',
              overflow: 'hidden',
            }}
          >
            <iframe
              src="https://www.youtube.com/embed/My5ROaPlc3c?autoplay=1&mute=1&loop=1&playlist=My5ROaPlc3c&controls=0&modestbranding=1&rel=0&playsinline=1"
              title="CTA showcase video"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: '-13%',
                width: '126%',
                height: '100%',
                border: '0',
              }}
            />

            <svg
              viewBox="0 0 1204 845"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="xMidYMid slice"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
              }}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 0H1204V845H0V0ZM75 0C33.5786 0 0 33.5786 0 75V570C0 611.421 33.5786 645 75 645H237C310.541 645.02 334.965 663.267 335 743V769C335 810.421 368.579 844 410 844H794C835.421 844 869 810.421 869 769V743C869.035 663.267 893.459 645.02 967 645H1129C1170.42 645 1204 611.421 1204 570V75C1204 33.5786 1170.42 0 1129 0H75Z"
                fill="#08080b"
              />
            </svg>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 64 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            style={{
              margin: 0,
              maxWidth: '576px',
              fontSize: 'clamp(20px, 3vw, 30px)',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.6)',
              textAlign: 'center',
              lineHeight: 1.25,
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
            }}
          >
            Bring your ideas to life with stunning animations that captivate and
            inspire.
          </motion.h2>
        </div>
      </div>
    </section>
  );
}
