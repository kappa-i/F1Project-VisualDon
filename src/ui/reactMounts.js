import React from 'react';
import { createRoot } from 'react-dom/client';
import ShaderReveal     from '../components/ShaderReveal.tsx';
import CrashTitles      from '../components/CrashTitles.tsx';
import ImolaModal       from '../components/ImolaModal.tsx';
import BottomSectionNav from '../components/BottomSectionNav.tsx';
import SpaSafety        from '../components/SpaSafety.tsx';
import InfiniteGallery  from '../components/InfiniteGallery.tsx';
import EraTimeline      from '../components/EraTimeline.tsx';
import EraGlitter       from '../components/EraGlitter.tsx';
import ConclusionCars   from '../components/ConclusionCars.tsx';
import Footer           from '../components/Footer.tsx';
import ConclusionGraph  from '../components/ConclusionGraph.tsx';
import Stats4           from '../components/Stats4.tsx';
import shaderFrontUrl   from '../assets/BG111.png';
import shaderBackUrl    from '../assets/BG222.png';
import { ERA_IMAGES }   from '../data/eraImages.js';

function mount(id, element) {
  const el = document.getElementById(id);
  if (el) createRoot(el).render(element);
}

mount('stats4-root', React.createElement(Stats4));

mount('shader-reveal-root', React.createElement(ShaderReveal, {
  frontImage:      shaderFrontUrl,
  backImage:       shaderBackUrl,
  style:           { width: '100%', height: '100%' },
  mouseForce:      68,
  cursorSize:      300,
  resolution:      0.5,
  iterationsViscous: 22,
  iterationsPoisson: 26,
  revealStrength:  2.4,
  revealSoftness:  0.75,
  autoDemo:        true,
  autoSpeed:       1.4,
  autoIntensity:   1.8,
  autoResumeDelay: 5000,
  viscous:         18,
  dt:              0.016,
  BFECC:           true,
}));

mount('hero-era-glitter-root', React.createElement(EraGlitter));

mount('hero-era-gallery-root', React.createElement(InfiniteGallery, {
  width:                '100%',
  height:               '100%',
  images:               ERA_IMAGES,
  density:              2,
  imageSize:            32,
  cellSize:             150,
  viewRange:            2,
  fogNear:              130,
  fogFar:               340,
  dragSpeed:            0.6,
  driftAmount:          6,
  friction:             0.97,
  autoZoom:             false,
  imageRadius:          0.06,
  allowImageFocusOnClick: true,
  backgroundColor:      '#000000',
  fogColor:             '#000000',
  wheelSpeed:           0.0025,
  transparent:          true,
}));

mount('hero-era-timeline-root', React.createElement(EraTimeline));
mount('crash-titles-root',      React.createElement(CrashTitles));
mount('imola-modal-root',       React.createElement(ImolaModal));
mount('bottom-nav-root',        React.createElement(BottomSectionNav));
mount('footer-root',            React.createElement(Footer));
mount('conclusion-graph-root',  React.createElement(ConclusionGraph));
mount('spa-root',               React.createElement(SpaSafety));
mount('conclusion-cars-root',   React.createElement(ConclusionCars));
