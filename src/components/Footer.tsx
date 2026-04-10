import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Route } from 'lucide-react';
import AnimatedList, { type AnimatedListItem } from './AnimatedList';
import TextScatter from './TextScatter';

function createSourceItem(id: string, order: string, title: string, description: string, href: string): AnimatedListItem {
  return {
    id,
    content: (
      <a href={href} target="_blank" rel="noreferrer" className="site-footer__source-link">
        <span className="site-footer__source-badge">{order}</span>
        <span className="site-footer__source-copy">
          <strong>{title}</strong>
          <span>{description}</span>
        </span>
        <ArrowUpRight aria-hidden="true" />
      </a>
    ),
  };
}

const sourceItems: AnimatedListItem[] = [
  createSourceItem('kaggle', '01', 'Kaggle Dataset', 'Formula 1 World Championship (1950-2020)', 'https://www.kaggle.com/datasets/rohanrao/formula-1-world-championship-1950-2020'),
  createSourceItem('jolpica-api', '02', 'Jolpica API', 'API historique F1 au format JSON', 'https://api.jolpi.ca'),
  createSourceItem('jolpica-github', '03', 'Jolpica GitHub', 'Dépôt du projet Jolpica F1', 'https://github.com/jolpica/jolpica-f1'),
  createSourceItem('openf1-site', '04', 'OpenF1', 'Télémétrie, positions GPS, météo', 'https://openf1.org'),
  createSourceItem('openf1-github', '05', 'OpenF1 GitHub', 'Code source du projet OpenF1', 'https://github.com/br-g/openf1'),
  createSourceItem('fastf1-docs', '06', 'FastF1 Docs', 'Librairie Python pour données F1 détaillées', 'https://docs.fastf1.dev'),
  createSourceItem('fastf1-github', '07', 'FastF1 GitHub', 'Dépôt de la librairie Fast-F1', 'https://github.com/theOehrly/Fast-F1'),
  createSourceItem('braithwaite', '08', 'Braithwaite et al.', 'Étude épidémiologique sur les blessures F1 (1950-2023)', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12043339/'),
  createSourceItem('tracing', '09', 'Tracing Insights', 'Référence de visualisation F1', 'https://www.tracinginsights.com/'),
  createSourceItem('pudding', '10', 'The Pudding', 'Référence scrollytelling et narration de données', 'https://pudding.cool/'),
  createSourceItem('figma', '11', 'Wireframes Figma', 'Structure du projet et hiérarchie visuelle', 'https://www.figma.com/design/NScnLEtFSYWRrBWTcuhv4b/F1Project?node-id=0-1&t=meHIixZrsysDpq6a-1'),
  createSourceItem('turbosquid', '12', 'TurboSquid', 'Modèle voiture Haas 2026', 'https://www.turbosquid.com/FullPreview/2534860'),
  createSourceItem('dribbble', '13', 'Aston Martin F1', 'Inspiration interactive 3D scroll sur Dribbble', 'https://dribbble.com/shots/25945471-Aston-Martin-F1-Interactive-3D-Scroll'),
  createSourceItem('caraddict', '14', 'CarAddict.ch', 'Référence UI automobile sombre et éditoriale', 'https://caraddict.ch/a-propos/'),
  createSourceItem('viita', '15', 'VIITA Race', 'Inspiration scroll horizontal et immersion racing', 'https://race.viita-watches.com/'),
  createSourceItem('genz', '16', 'Gen Z Broke the Marketing Funnel', 'Référence collage, typo et narration visuelle', 'https://genzbrokethefunnel.com'),
  createSourceItem('bidwells', '17', 'Bidwells', 'Référence design et communication technique', 'https://www.bidwells.co.uk/insights-reports-events/driving-innovation-at-speed/'),
  createSourceItem('reactbits', '18', 'React Bits', 'Bibliothèque de composants React interactifs', 'https://reactbits.dev/'),
  createSourceItem('reactbits-pro', '19', 'React Bits Pro', 'Version avancée des composants React Bits', 'https://pro.reactbits.dev/'),
  createSourceItem('aceternity', '20', 'Aceternity UI', 'Collection de composants React modernes', 'https://ui.aceternity.com/components'),
  createSourceItem('magicui', '21', 'Magic UI', 'Composants UI animés pour interfaces modernes', 'https://magicui.design/docs/components'),
  createSourceItem('shadcn', '22', 'shadcn/ui', 'Système de composants basé sur Radix UI', 'https://ui.shadcn.com/'),
  createSourceItem('coss', '23', 'COSS UI', 'Collection de composants UI interactifs', 'https://coss.com/ui/'),
  createSourceItem('heig', '24', 'HEIG-VD', 'Cadre académique du projet', 'https://www.heig-vd.ch/'),
];

const footerCards = [
  {
    title: 'Sources',
    links: [],
    items: sourceItems,
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
  const [sourcesAtBottom, setSourcesAtBottom] = useState(false);

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
                  className={`${classes.join(' ')}${card.title === 'Sources' ? ` site-footer__card--sources${sourcesAtBottom ? ' is-scroll-end' : ''}` : ''}`}
                >
                  <h4>{card.title}</h4>
                  {card.title === 'Sources' ? (
                    <div className="site-footer__card-body">
                      <div className="site-footer__card-body-bottom">
                        <AnimatedList
                          items={card.items ?? []}
                          autoAddDelay={0}
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
                          onScrollStateChange={({ atBottom }) => setSourcesAtBottom(atBottom)}
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
