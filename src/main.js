// ── Imports ───────────────────────────────────────────────────────────────
import { camera, cam, renderer, scene, DEV_MODE } from './scene/setup.js';
import './scene/lights.js';
import './scene/environment.js';

import { nav, crash } from './state.js';

import './ui/loader.js';
import './ui/sourceModal.js';
import './ui/reactMounts.js';

import {
  isCrashPage,
  CRASH_PAGE_START, CRASH_PAGE_STEPS,
  crashFrameToProgress,
} from './navigation/constants.js';
import { tickCrashLerp, resizeCrashCanvas } from './navigation/crash.js';
import { updateSectionNav, dispatchHeroStepChange } from './navigation/pages.js';
import './navigation/wheel.js';
import './navigation/keyboard.js';

import { renderHaasInfoboxes } from './viewer/infoboxes.js';
import './viewer/haasModel.js';
import { devControls, _devUpdatePanel } from './viewer/camera.js';

// ── Scroll reset on reload ────────────────────────────────────────────────
const shouldResetScroll = window.sessionStorage.getItem('scroll-to-top-on-reload') === '1';
if (shouldResetScroll) {
  window.sessionStorage.removeItem('scroll-to-top-on-reload');
  if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
  window.addEventListener('load', () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, { once: true });
}

// ── RPM deco ──────────────────────────────────────────────────────────────
const rpmEl = document.getElementById('rpm-deco');
if (rpmEl) {
  [6,9,12,10,14,11,8,13,10,7,12,9,11,8,13,10,6,9,12,10].forEach((h, i) => {
    const b = document.createElement('div');
    b.className = 'rpm-bar';
    b.style.height = h * 2 + 'px';
    b.style.animationDelay = (i * 0.06) + 's';
    rpmEl.appendChild(b);
  });
}

// ── Infoboxes Haas ────────────────────────────────────────────────────────
renderHaasInfoboxes();

// ── Initial hero state ────────────────────────────────────────────────────
dispatchHeroStepChange(nav.currentPage);

// ── Resize ────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  resizeCrashCanvas();
});

// ── Render loop ───────────────────────────────────────────────────────────
function shouldRenderScene() {
  return document.body.classList.contains('hud-active') || nav.isTransitioning;
}

(function animate() {
  requestAnimationFrame(animate);

  tickCrashLerp();

  if (isCrashPage(nav.currentPage)) {
    nav.currentPage = Math.max(
      CRASH_PAGE_START,
      Math.min(
        CRASH_PAGE_START + CRASH_PAGE_STEPS - 1,
        Math.round(CRASH_PAGE_START + crashFrameToProgress(crash.renderedFrame) * (CRASH_PAGE_STEPS - 1))
      )
    );
  }

  updateSectionNav(nav.currentPage);

  if (DEV_MODE) {
    devControls.update();
    renderer.render(scene, camera);
    _devUpdatePanel();
    return;
  }
  if (!shouldRenderScene()) return;
  camera.position.set(cam.px, cam.py, cam.pz);
  camera.lookAt(cam.tx, cam.ty, cam.tz);
  renderer.render(scene, camera);
})();
