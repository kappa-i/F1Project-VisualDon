import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Linkedin } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__bg" aria-hidden="true">
        <img
          src="https://images.unsplash.com/photo-1616144058124-979005390426?q=80&w=1744&auto=format&fit=crop"
          alt=""
        />
      </div>

      <div className="site-footer__inner">
        <div className="site-footer__spacer" aria-hidden="true" />

        <div className="site-footer__panel">
          <div className="site-footer__corner site-footer__corner--left" aria-hidden="true">
            <svg viewBox="0 0 614 153" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0H451.601C467.78 0 483.071 7.75893 491.954 21.2815C558.518 122.612 538.359 153.074 614 153H0V0Z" />
            </svg>
          </div>

          <div className="site-footer__corner site-footer__corner--right" aria-hidden="true">
            <svg viewBox="0 0 614 153" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0H451.601C467.78 0 483.071 7.75893 491.954 21.2815C558.518 122.612 538.359 153.074 614 153H0V0Z" />
            </svg>
          </div>

          <motion.div
            className="site-footer__content"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={itemVariants} className="site-footer__brand">
              <p className="site-footer__kicker">F1 Project · VisualDon</p>
              <h2>LIGHTNESS</h2>
              <p>Safety, speed and engineered survival.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="site-footer__links">
              <a href="#s-hero">Retour au début</a>
              <span aria-hidden="true">·</span>
              <a href="#s-era">Explorer l’histoire</a>
              <span aria-hidden="true">·</span>
              <a href="#s-conclusion">Relire la conclusion</a>
            </motion.div>

            <motion.div variants={itemVariants} className="site-footer__socials">
              <a href="#" aria-label="Instagram">
                <Instagram size={24} strokeWidth={1.8} />
              </a>
              <a href="#" aria-label="X">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn">
                <Linkedin size={24} strokeWidth={1.8} />
              </a>
            </motion.div>

            <motion.div variants={itemVariants} className="site-footer__bottom">
              <p>© 2026 F1 Project VisualDon. Tous droits réservés.</p>
              <div>
                <p>Formule 1 · 1950 → 2026</p>
                <p>Réglementation, crashs, innovation</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
