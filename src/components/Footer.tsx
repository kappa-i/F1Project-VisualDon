import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

const footerCards = [
  {
    title: 'Parcours',
    links: [
      { text: 'Introduction', href: '#s-hero' },
      { text: 'Ere dangereuse', href: '#s-era' },
      { text: 'Crashs', href: '#s-crash' },
      { text: 'Spa-Francorchamps', href: '#s-spa' },
    ],
  },
  {
    title: 'Visualisations',
    links: [
      { text: 'Scene 3D', href: '#s-haas' },
      { text: 'Donnees', href: '#s-data' },
      { text: 'Conclusion', href: '#s-conclusion' },
    ],
  },
  {
    title: 'Projet',
    links: [
      { text: 'Depot GitHub', href: 'https://github.com/kappa-i/F1Project-VisualDon', external: true },
      { text: 'README', href: 'https://github.com/kappa-i/F1Project-VisualDon#readme', external: true },
      { text: 'HEIG-VD', href: 'https://www.heig-vd.ch/', external: true },
      { text: 'Retour en haut', href: '#s-hero' },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="site-footer__stack"
        >
          <div className="site-footer__grid">
            <motion.div variants={itemVariants} className="site-footer__brand">
              <div className="site-footer__logo" aria-hidden="true">
                <div className="site-footer__logo-mark">
                  <span>F</span>
                </div>
                <span className="site-footer__logo-text">LIGHTNESS</span>
              </div>

              <div className="site-footer__headline">
                <h3>
                  Peut-on aller plus vite
                  <br />
                  en etant plus en securite ?
                </h3>
              </div>

              <div className="site-footer__meta">
                <p>Projet VisualDon sur la securite en Formule 1 depuis 1950</p>
              </div>
            </motion.div>

            {footerCards.map((card, index) => {
              const classes = ['site-footer__card'];

              if (index > 0) {
                classes.push('site-footer__card--stacked');
              }

              return (
                <motion.div key={card.title} variants={itemVariants} className={classes.join(' ')}>
                  <h4>{card.title}</h4>
                  <ul>
                    {card.links.map((link) => (
                      <li key={link.text}>
                        <a
                          href={link.href}
                          target={link.external ? '_blank' : undefined}
                          rel={link.external ? 'noreferrer' : undefined}
                        >
                          <span>{link.text}</span>
                          {link.external ? <ArrowUpRight aria-hidden="true" /> : null}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          <motion.div variants={itemVariants} className="site-footer__bottom">
            <p>© 2026 F1 Project VisualDon. Tous droits reserves.</p>
            <p>Vitesse, crashs, reglementation, survie.</p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
