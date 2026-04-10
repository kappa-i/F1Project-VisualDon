import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Route } from 'lucide-react';
import TextScatter from './TextScatter';

const footerCards = [
  {
    title: 'Sources',
    links: [],
  },
  {
    title: 'Assets',
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
  const handleReturnToTop = () => {
    window.sessionStorage.setItem('scroll-to-top-on-reload', '1');
    window.location.hash = 's-hero';
    window.location.reload();
  };

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
              <div className="site-footer__brand-copy">
                <div className="site-footer__headline">
                  <h3>
                    <TextScatter text="L'histoire de la" velocity={180} rotation={80} returnAfter={0.8} duration={1.8} />
                    <br />
                    <TextScatter text="sécurité en " velocity={180} rotation={80} returnAfter={0.8} duration={1.8} />
                    <TextScatter
                      text="F1"
                      velocity={180}
                      rotation={80}
                      returnAfter={0.8}
                      duration={1.8}
                      charStyle={{ color: '#e10600' }}
                    />
                  </h3>
                </div>

                <div className="site-footer__meta">
                  <p>
                    Un projet de :
                    <br />
                    Tanguy Vaucher
                    <br />
                    Gabriel Cappai
                    <br />
                    Nuno Guilherme Amaro Faria
                  </p>
                </div>
              </div>

              <button type="button" className="site-footer__back-top" onClick={handleReturnToTop}>
                <span className="site-footer__back-top-icon" aria-hidden="true">
                  <Route size={18} strokeWidth={2} />
                </span>
                <span>Retourner au début</span>
              </button>
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
            <p>© 2026 F1 Project, Visualisation de donnees</p>
            <p>Travail realise dans un cadre academique</p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
