import * as THREE from 'three';
import { nav, crash, wheel } from '../state.js';
import { DEV_MODE } from '../scene/setup.js';
import {
  isCrashPage,
  CRASH_FRAME_COUNT, CRASH_PAGE_STEPS, CRASH_PAGE_START,
  VIEWER_PAGE_START, WHEEL_NAV_LOCK_MS,
} from './constants.js';
import { goToPage } from './pages.js';

window.addEventListener('keydown', e => {
  if (DEV_MODE) return;
  if (!nav.modelLoaded || nav.isTransitioning) return;
  if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;

  const direction = e.key === 'ArrowDown' ? 1 : -1;

  if (isCrashPage(nav.currentPage)) {
    const step = (CRASH_FRAME_COUNT - 1) / CRASH_PAGE_STEPS;
    crash.targetFrame = THREE.MathUtils.clamp(
      crash.targetFrame + direction * step,
      0, CRASH_FRAME_COUNT - 1
    );

    const now = performance.now();
    if (now < wheel.unlockAt) return;

    const atEnd   = direction > 0 && crash.targetFrame >= CRASH_FRAME_COUNT - 1;
    const atStart = direction < 0 && crash.targetFrame <= 0;

    if (atEnd)   { wheel.unlockAt = now + WHEEL_NAV_LOCK_MS; goToPage(VIEWER_PAGE_START); }
    if (atStart) { wheel.unlockAt = now + WHEEL_NAV_LOCK_MS; goToPage(CRASH_PAGE_START - 1); }
    return;
  }

  const now = performance.now();
  if (now < wheel.unlockAt) return;
  wheel.unlockAt = now + WHEEL_NAV_LOCK_MS;
  goToPage(nav.currentPage + direction);
});
