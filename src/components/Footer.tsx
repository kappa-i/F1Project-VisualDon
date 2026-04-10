import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Box, Globe, Route } from 'lucide-react';
import AnimatedList, { type AnimatedListItem } from './AnimatedList';
import TextScatter from './TextScatter';

function createFooterListItem(
  id: string,
  title: string,
  description: string,
  href: string,
  icon: React.ReactNode,
  external = true,
): AnimatedListItem {
  return {
    id,
    content: (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        className="site-footer__source-link"
      >
        <span className="site-footer__source-copy">
          <strong>{title}</strong>
          <span>{description}</span>
        </span>
        {icon}
      </a>
    ),
  };
}

const sourceItems: AnimatedListItem[] = [
  createFooterListItem('kaggle', 'Kaggle Dataset', 'Formula 1 World Championship (1950-2020)', 'https://www.kaggle.com/datasets/rohanrao/formula-1-world-championship-1950-2020', <Globe aria-hidden="true" />),
  createFooterListItem('jolpica-api', 'Jolpica API', 'API historique F1 au format JSON', 'https://api.jolpi.ca', <Globe aria-hidden="true" />),
  createFooterListItem('jolpica-github', 'Jolpica GitHub', 'Dépôt du projet Jolpica F1', 'https://github.com/jolpica/jolpica-f1', <Globe aria-hidden="true" />),
  createFooterListItem('openf1-site', 'OpenF1', 'Télémétrie, positions GPS, météo', 'https://openf1.org', <Globe aria-hidden="true" />),
  createFooterListItem('openf1-github', 'OpenF1 GitHub', 'Code source du projet OpenF1', 'https://github.com/br-g/openf1', <Globe aria-hidden="true" />),
  createFooterListItem('fastf1-docs', 'FastF1 Docs', 'Librairie Python pour données F1 détaillées', 'https://docs.fastf1.dev', <Globe aria-hidden="true" />),
  createFooterListItem('fastf1-github', 'FastF1 GitHub', 'Dépôt de la librairie Fast-F1', 'https://github.com/theOehrly/Fast-F1', <Globe aria-hidden="true" />),
  createFooterListItem('braithwaite', 'Braithwaite et al.', 'Étude épidémiologique sur les blessures F1 (1950-2023)', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12043339/', <Globe aria-hidden="true" />),
  createFooterListItem('tracing', 'Tracing Insights', 'Référence de visualisation F1', 'https://www.tracinginsights.com/', <Globe aria-hidden="true" />),
  createFooterListItem('pudding', 'The Pudding', 'Référence scrollytelling et narration de données', 'https://pudding.cool/', <Globe aria-hidden="true" />),
  createFooterListItem('figma', 'Wireframes Figma', 'Structure du projet et hiérarchie visuelle', 'https://www.figma.com/design/NScnLEtFSYWRrBWTcuhv4b/F1Project?node-id=0-1&t=meHIixZrsysDpq6a-1', <Globe aria-hidden="true" />),
  createFooterListItem('turbosquid', 'TurboSquid', 'Modèle voiture Haas 2026', 'https://www.turbosquid.com/FullPreview/2534860', <Globe aria-hidden="true" />),
  createFooterListItem('dribbble', 'Aston Martin F1', 'Inspiration interactive 3D scroll sur Dribbble', 'https://dribbble.com/shots/25945471-Aston-Martin-F1-Interactive-3D-Scroll', <Globe aria-hidden="true" />),
  createFooterListItem('caraddict', 'CarAddict.ch', 'Référence UI automobile sombre et éditoriale', 'https://caraddict.ch/a-propos/', <Globe aria-hidden="true" />),
  createFooterListItem('viita', 'VIITA Race', 'Inspiration scroll horizontal et immersion racing', 'https://race.viita-watches.com/', <Globe aria-hidden="true" />),
  createFooterListItem('genz', 'Gen Z Broke the Marketing Funnel', 'Référence collage, typo et narration visuelle', 'https://genzbrokethefunnel.com', <Globe aria-hidden="true" />),
  createFooterListItem('bidwells', 'Bidwells', 'Référence design et communication technique', 'https://www.bidwells.co.uk/insights-reports-events/driving-innovation-at-speed/', <Globe aria-hidden="true" />),
  createFooterListItem('reactbits', 'React Bits', 'Bibliothèque de composants React interactifs', 'https://reactbits.dev/', <Globe aria-hidden="true" />),
  createFooterListItem('reactbits-pro', 'React Bits Pro', 'Version avancée des composants React Bits', 'https://pro.reactbits.dev/', <Globe aria-hidden="true" />),
  createFooterListItem('aceternity', 'Aceternity UI', 'Collection de composants React modernes', 'https://ui.aceternity.com/components', <Globe aria-hidden="true" />),
  createFooterListItem('magicui', 'Magic UI', 'Composants UI animés pour interfaces modernes', 'https://magicui.design/docs/components', <Globe aria-hidden="true" />),
  createFooterListItem('shadcn', 'shadcn/ui', 'Système de composants basé sur Radix UI', 'https://ui.shadcn.com/', <Globe aria-hidden="true" />),
  createFooterListItem('coss', 'COSS UI', 'Collection de composants UI interactifs', 'https://coss.com/ui/', <Globe aria-hidden="true" />),
  createFooterListItem('heig', 'HEIG-VD', 'Cadre académique du projet', 'https://www.heig-vd.ch/', <Globe aria-hidden="true" />),
];

const assetItems: AnimatedListItem[] = [
  createFooterListItem('asset-haas', 'Scene 3D', 'Vue immersive de la monoplace et innovations de sécurité', '#s-haas', <Box aria-hidden="true" />, false),
  createFooterListItem('asset-data', 'Donnees', 'Visualisations de performance, accidents et évolutions', '#s-data', <Box aria-hidden="true" />, false),
  createFooterListItem('asset-conclusion', 'Conclusion', 'Synthèse finale sur vitesse et sécurité en F1', '#s-conclusion', <Box aria-hidden="true" />, false),
];

const footerCards = [
  {
    title: 'Sources',
    links: [],
    items: sourceItems,
  },
  {
    title: 'Assets',
    links: [],
    items: assetItems,
  },
  {
    title: 'Projet',
    links: [
      { text: 'Depot GitHub', href: 'https://github.com/kappa-i/F1Project-VisualDon', external: true },
      { text: 'README', href: 'https://github.com/kappa-i/F1Project-VisualDon#readme', external: true },
      { text: 'HEIG-VD', href: 'https://www.heig-vd.ch/', external: true },
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
  const [assetsAtBottom, setAssetsAtBottom] = useState(false);

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
                  className={`${classes.join(' ')}${card.title === 'Sources' ? ` site-footer__card--sources${sourcesAtBottom ? ' is-scroll-end' : ''}` : ''}${card.title === 'Assets' ? ` site-footer__card--assets${assetsAtBottom ? ' is-scroll-end' : ''}` : ''}`}
                >
                  <h4>{card.title}</h4>
                  {card.title === 'Sources' || card.title === 'Assets' ? (
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
                          onScrollStateChange={
                            card.title === 'Sources'
                              ? ({ atBottom }) => setSourcesAtBottom(atBottom)
                              : card.title === 'Assets'
                                ? ({ atBottom }) => setAssetsAtBottom(atBottom)
                                : undefined
                          }
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
