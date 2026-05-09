import gsap from 'gsap';
import { nav, crash, resetWheelGesture } from '../state.js';
import {
  PAGE_COUNT, HERO_PAGE_START, HERO_PAGE_END, HERO_PAGE_STEPS,
  ERA_PAGE_START, ERA_PAGE_END, ERA_PAGE_STEPS,
  CRASH_PAGE_START, CRASH_PAGE_END, CRASH_PAGE_STEPS,
  VIEWER_PAGE_START, VIEWER_PAGE_END,
  SPA_PAGE_START, SPA_PAGE_END,
  CICATRICE_PAGE, CONCLUSION_PAGE,
  isHeroPage, isEraPage, isCrashPage, isSpaPage,
  pageToY, pageToCamera, pageToSectionIndex,
  crashPageToProgress, crashFrameToProgress,
} from './constants.js';
import { setCrashProgress } from './crash.js';
import { snapCamera } from '../viewer/camera.js';
import { updateHUD } from '../viewer/hud.js';
import { updateDots } from '../viewer/dots.js';

const pageEl              = document.getElementById('page');
const conclusionSectionEl = document.getElementById('s-conclusion');
let lastSectionNavProgress = -1;
let lastSectionNavIndex    = -1;

function pageToSectionProgress(pageIdx) {
  if (pageIdx === HERO_PAGE_START) return 0;
  if (isHeroPage(pageIdx)) {
    const eraSubStep = pageIdx - HERO_PAGE_START - 1;
    return 1 + eraSubStep / ERA_PAGE_STEPS * 0.92;
  }
  if (pageIdx >= CRASH_PAGE_START && pageIdx <= CRASH_PAGE_END) {
    return 2 + crashFrameToProgress(crash.renderedFrame) * 0.92;
  }
  if (pageIdx >= VIEWER_PAGE_START && pageIdx <= VIEWER_PAGE_END) {
    const viewerProgress = (pageIdx - VIEWER_PAGE_START) / Math.max(1, VIEWER_PAGE_END - VIEWER_PAGE_START);
    return 3 + viewerProgress * 0.92;
  }
  if (pageIdx >= SPA_PAGE_START && pageIdx <= SPA_PAGE_END) {
    const spaProgress = (pageIdx - SPA_PAGE_START) / Math.max(1, SPA_PAGE_END - SPA_PAGE_START);
    return 4 + spaProgress * 0.92;
  }
  if (pageIdx === CICATRICE_PAGE) return 5;
  if (pageIdx === CONCLUSION_PAGE) return 6;
  return 6;
}

export function updateSectionNav(pageIdx = nav.currentPage) {
  const progress = pageToSectionProgress(pageIdx);
  const activeSectionIndex = pageToSectionIndex(pageIdx);
  if (
    Math.abs(progress - lastSectionNavProgress) < 0.001 &&
    activeSectionIndex === lastSectionNavIndex
  ) return;
  lastSectionNavProgress = progress;
  lastSectionNavIndex    = activeSectionIndex;
  window.dispatchEvent(new CustomEvent('section-nav-progress', {
    detail: { progress, activeSectionIndex },
  }));
}

export function sectionToPage(sectionIdx) {
  if (sectionIdx <= 0) return 0;
  if (sectionIdx === 1) return HERO_PAGE_START + 1;
  if (sectionIdx === 2) return CRASH_PAGE_START;
  if (sectionIdx === 3) return VIEWER_PAGE_START;
  if (sectionIdx === 4) return SPA_PAGE_START;
  if (sectionIdx === 5) return CICATRICE_PAGE;
  if (sectionIdx === 6) return CONCLUSION_PAGE;
  return CONCLUSION_PAGE;
}

export function dispatchHeroStepChange(pageIdx) {
  const step = pageIdx <= HERO_PAGE_START
    ? -1
    : Math.min(HERO_PAGE_STEPS - 1, pageIdx - HERO_PAGE_START - 1);
  const heroSectionEl = document.getElementById('s-hero');
  heroSectionEl?.classList.toggle('is-story-active', step >= 0);
  window.dispatchEvent(new CustomEvent('hero-step-change', { detail: { step } }));
  const eraStep = step >= 1 ? step - 1 : -1;
  window.dispatchEvent(new CustomEvent('era-step-change', { detail: { step: eraStep } }));
}

export function dispatchEraStepChange(pageIdx) {
  const step = isEraPage(pageIdx) ? pageIdx - ERA_PAGE_START - 1 : -1;
  window.dispatchEvent(new CustomEvent('era-step-change', { detail: { step } }));
}

export function dispatchSpaPoiChange(pageIdx) {
  const index = isSpaPage(pageIdx) ? pageIdx - SPA_PAGE_START - 1 : -1;
  window.dispatchEvent(new CustomEvent('spa-poi-change', { detail: { index } }));
}

export function goToPage(idx) {
  if (nav.isTransitioning || idx < 0 || idx >= PAGE_COUNT) return;

  nav.isTransitioning = true;
  resetWheelGesture();

  const prevPage = nav.currentPage;

  if (prevPage !== CONCLUSION_PAGE && idx === CONCLUSION_PAGE && conclusionSectionEl) {
    conclusionSectionEl.scrollTop = 0;
    window.dispatchEvent(new CustomEvent('conclusion-active'));
  }
  if (prevPage === CONCLUSION_PAGE && idx !== CONCLUSION_PAGE && conclusionSectionEl) {
    conclusionSectionEl.scrollTop = 0;
    window.dispatchEvent(new CustomEvent('conclusion-inactive'));
  }
  if (isCrashPage(idx) && prevPage < CRASH_PAGE_START) setCrashProgress(0, true);
  if (isCrashPage(idx) && prevPage > CRASH_PAGE_END)   setCrashProgress(1, true);

  nav.currentPage = idx;
  updateHUD(idx);
  updateSectionNav(idx);

  const targetY  = pageToY(idx);
  const currentY = pageToY(prevPage);
  const camIdx   = pageToCamera(idx);

  if (targetY === currentY && isEraPage(idx)) {
    dispatchEraStepChange(idx);
    updateSectionNav(idx);
    nav.isTransitioning = false;
    return;
  }

  if (targetY === currentY && isHeroPage(idx)) {
    dispatchHeroStepChange(idx);
    updateSectionNav(idx);
    nav.isTransitioning = false;
    return;
  }

  if (targetY === currentY && isCrashPage(idx)) {
    setCrashProgress(crashPageToProgress(idx));
    nav.isTransitioning = false;
    return;
  }

  if (targetY === currentY && camIdx >= 0) {
    updateDots();
    snapCamera(camIdx, () => { nav.isTransitioning = false; });
    return;
  }

  if (targetY === currentY && isSpaPage(idx)) {
    updateSectionNav(idx);
    dispatchSpaPoiChange(idx);
    nav.isTransitioning = false;
    return;
  }

  gsap.to(pageEl, {
    y: `${targetY}vh`,
    duration: 1.0,
    ease: 'power3.inOut',
    onComplete: () => {
      if (isHeroPage(idx)) {
        dispatchHeroStepChange(idx);
        updateSectionNav(idx);
        nav.isTransitioning = false;
      } else if (isEraPage(idx)) {
        dispatchEraStepChange(idx);
        updateSectionNav(idx);
        nav.isTransitioning = false;
      } else if (isCrashPage(idx)) {
        setCrashProgress(crashPageToProgress(idx), true);
        updateSectionNav(idx);
        nav.isTransitioning = false;
      } else if (camIdx >= 0) {
        updateDots();
        updateSectionNav(idx);
        snapCamera(camIdx);
        nav.isTransitioning = false;
      } else if (isSpaPage(idx)) {
        updateSectionNav(idx);
        dispatchSpaPoiChange(idx);
        nav.isTransitioning = false;
      } else {
        updateSectionNav(idx);
        nav.isTransitioning = false;
      }
    },
  });
}

// Listeners navigation
window.addEventListener('section-nav-jump', event => {
  const sectionIdx = event.detail?.sectionIndex;
  if (typeof sectionIdx !== 'number') return;
  goToPage(sectionToPage(sectionIdx));
});

window.addEventListener('hero-next-step', () => {
  if (!isHeroPage(nav.currentPage) || nav.currentPage >= HERO_PAGE_END) return;
  goToPage(nav.currentPage + 1);
});

window.addEventListener('spa-nav-click', e => {
  const dir = e.detail?.direction;
  if (typeof dir !== 'number') return;
  if (!isSpaPage(nav.currentPage)) return;
  goToPage(nav.currentPage + dir);
});
