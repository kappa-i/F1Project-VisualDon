import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Route } from 'lucide-react';
import AnimatedList, { type AnimatedListItem } from './AnimatedList';
import TextScatter from './TextScatter';

const footerCards = [
  {
    title: 'Sources',
    links: [],
    items: [
      {
        id: 'kaggle',
        content: (
          <a href="https://www.kaggle.com/datasets/rohanrao/formula-1-world-championship-1950-2020" target="_blank" rel="noreferrer" className="site-footer__source-link">
            <span className="site-footer__source-badge">01</span>
            <span className="site-footer__source-copy">
              <strong>Kaggle Dataset</strong>
              <span>Formula 1 World Championship (1950-2020)</span>
            </span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        ),
      },
      {
        id: 'jolpica',
        content: (
          <a href="https://api.jolpi.ca/" target="_blank" rel="noreferrer" className="site-footer__source-link">
            <span className="site-footer__source-badge">02</span>
            <span className="site-footer__source-copy">
              <strong>Jolpica API</strong>
              <span>Historique F1 en JSON</span>
            </span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        ),
      },
      {
        id: 'openf1',
        content: (
          <a href="https://openf1.org/" target="_blank" rel="noreferrer" className="site-footer__source-link">
            <span className="site-footer__source-badge">03</span>
            <span className="site-footer__source-copy">
              <strong>OpenF1</strong>
              <span>Télémétrie, positions et météo</span>
            </span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        ),
      },
      {
        id: 'fastf1',
        content: (
          <a href="https://docs.fastf1.dev/" target="_blank" rel="noreferrer" className="site-footer__source-link">
            <span className="site-footer__source-badge">04</span>
            <span className="site-footer__source-copy">
              <strong>FastF1</strong>
              <span>Données temps réel et historiques</span>
            </span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        ),
      },
      {
        id: 'f1',
        content: (
          <a href="https://www.formula1.com/" target="_blank" rel="noreferrer" className="site-footer__source-link">
            <span className="site-footer__source-badge">05</span>
            <span className="site-footer__source-copy">
              <strong>Formula1.com</strong>
              <span>Références officielles et archives</span>
            </span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        ),
      },
      {
        id: 'fia',
        content: (
          <a href="https://www.fia.com/" target="_blank" rel="noreferrer" className="site-footer__source-link">
            <span className="site-footer__source-badge">06</span>
            <span className="site-footer__source-copy">
              <strong>FIA</strong>
              <span>Règlements et sécurité</span>
            </span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        ),
      },
      {
        id: 'braithwaite',
        content: (
          <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12043339/" target="_blank" rel="noreferrer" className="site-footer__source-link">
            <span className="site-footer__source-badge">07</span>
            <span className="site-footer__source-copy">
              <strong>Braithwaite et al.</strong>
              <span>Étude épidémiologique 1950-2023</span>
            </span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        ),
      },
      {
        id: 'tracing',
        content: (
          <a href="https://www.tracinginsights.com/" target="_blank" rel="noreferrer" className="site-footer__source-link">
            <span className="site-footer__source-badge">08</span>
            <span className="site-footer__source-copy">
              <strong>Tracing Insights</strong>
              <span>Visualisations et analyses F1</span>
            </span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        ),
      },
      {
        id: 'pudding',
        content: (
          <a href="https://pudding.cool/" target="_blank" rel="noreferrer" className="site-footer__source-link">
            <span className="site-footer__source-badge">09</span>
            <span className="site-footer__source-copy">
              <strong>The Pudding</strong>
              <span>Référence scrollytelling et narration</span>
            </span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        ),
      },
      {
        id: 'figma',
        content: (
          <a href="https://www.figma.com/design/NScnLEtFSYWRrBWTcuhv4b/F1Project?node-id=0-1&t=meHIixZrsysDpq6a-1" target="_blank" rel="noreferrer" className="site-footer__source-link">
            <span className="site-footer__source-badge">10</span>
            <span className="site-footer__source-copy">
              <strong>Wireframes Figma</strong>
              <span>Structure et parcours de l’expérience</span>
            </span>
            <ArrowUpRight aria-hidden="true" />
          </a>
        ),
      },
    ] as AnimatedListItem[],
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
                <motion.div
                  key={card.title}
                  variants={itemVariants}
                  className={`${classes.join(' ')}${card.title === 'Sources' ? ' site-footer__card--sources' : ''}`}
                >
                  <h4>{card.title}</h4>
                  {card.title === 'Sources' ? (
                    <div className="site-footer__card-body">
                      <div className="site-footer__card-body-bottom">
                        <AnimatedList
                          items={card.items ?? []}
                          autoAddDelay={0}
                          maxItems={10}
                          animationType="scale"
                          enterFrom="top"
                          startFrom="top"
                          hoverEffect="none"
                          pauseOnHover={true}
                          fadeEdges={false}
                          fadeEdgeSize={42}
                          fadeColor="#121212"
                          itemGap={10}
                          height="100%"
                        />
                      </div>
                    </div>
                  ) : (
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
                  )}
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
