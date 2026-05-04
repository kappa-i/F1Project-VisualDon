import * as THREE from 'three';
import { nav, crash, wheel, resetWheelGesture } from '../state.js';
import {
  DEV_MODE,
} from '../scene/setup.js';
import {
  isCrashPage, isEraPage,
  CRASH_FRAME_COUNT, CRASH_SCROLL_DISTANCE, CRASH_EXIT_DISTANCE,
  WHEEL_GESTURE_GAP, WHEEL_NAV_THRESHOLD, WHEEL_NAV_LOCK_MS,
  ERA_PAGE_END, VIEWER_PAGE_START,
  normalizeWheelDelta,
  CONCLUSION_PAGE,
} from './constants.js';
import { goToPage } from './pages.js';

window.addEventListener('wheel', e => {
  if (DEV_MODE) return;

  if (nav.currentPage === CONCLUSION_PAGE) {
    e.preventDefault();
    if (!nav.modelLoaded || nav.isTransitioning) return;

    const delta = normalizeWheelDelta(e);
    if (Math.abs(delta) < 1) return;

    const conclusionSectionEl = document.getElementById('s-conclusion');
    if (!(conclusionSectionEl instanceof HTMLElement)) return;

    const maxScrollTop = Math.max(0, conclusionSectionEl.scrollHeight - conclusionSectionEl.clientHeight);
    const isAtTop    = conclusionSectionEl.scrollTop <= 0;
    const isAtBottom = conclusionSectionEl.scrollTop >= maxScrollTop - 1;
    const direction  = delta > 0 ? 1 : -1;

    if (direction > 0 && !isAtBottom) {
      conclusionSectionEl.scrollTop = Math.min(maxScrollTop, conclusionSectionEl.scrollTop + delta);
      resetWheelGesture();
      return;
    }
    if (direction < 0 && !isAtTop) {
      conclusionSectionEl.scrollTop = Math.max(0, conclusionSectionEl.scrollTop + delta);
      resetWheelGesture();
      return;
    }
    if (direction > 0) return;

    const now = performance.now();
    if (now < wheel.unlockAt) return;
    const isNewGesture = now - wheel.lastEventAt > WHEEL_GESTURE_GAP || direction !== wheel.gestureDirection;
    if (isNewGesture) {
      wheel.gestureAccum     = delta;
      wheel.gestureDirection = direction;
    } else {
      wheel.gestureAccum += delta;
    }
    wheel.lastEventAt = now;
    if (Math.abs(wheel.gestureAccum) < WHEEL_NAV_THRESHOLD) return;
    wheel.unlockAt = now + WHEEL_NAV_LOCK_MS;
    goToPage(nav.currentPage + direction);
    return;
  }

  e.preventDefault();
  if (!nav.modelLoaded || nav.isTransitioning) return;

  const delta = normalizeWheelDelta(e);
  if (Math.abs(delta) < 1) return;

  if (isEraPage(nav.currentPage)) {
    const now = performance.now();
    if (now < wheel.unlockAt) return;
    const direction    = delta > 0 ? 1 : -1;
    const isNewGesture = now - wheel.lastEventAt > WHEEL_GESTURE_GAP || direction !== wheel.gestureDirection;
    if (isNewGesture) {
      wheel.gestureAccum     = delta;
      wheel.gestureDirection = direction;
    } else {
      wheel.gestureAccum += delta;
    }
    wheel.lastEventAt = now;
    if (Math.abs(wheel.gestureAccum) < WHEEL_NAV_THRESHOLD) return;
    wheel.unlockAt = now + WHEEL_NAV_LOCK_MS;
    goToPage(nav.currentPage + direction);
    return;
  }

  if (isCrashPage(nav.currentPage)) {
    const direction = delta > 0 ? 1 : -1;
    const distance  = Math.abs(delta);

    if (direction > 0) {
      if (crash.targetFrame < CRASH_FRAME_COUNT - 1) {
        crash.targetFrame = THREE.MathUtils.clamp(
          crash.targetFrame + delta / CRASH_SCROLL_DISTANCE * (CRASH_FRAME_COUNT - 1),
          0, CRASH_FRAME_COUNT - 1
        );
        crash.exitDistance  = 0;
        crash.exitDirection = 0;
        return;
      }
      if (crash.exitDirection !== direction) { crash.exitDirection = direction; crash.exitDistance = 0; }
      crash.exitDistance += distance;
      if (crash.exitDistance >= CRASH_EXIT_DISTANCE) goToPage(VIEWER_PAGE_START);
      return;
    }

    if (crash.targetFrame > 0) {
      crash.targetFrame = THREE.MathUtils.clamp(
        crash.targetFrame + delta / CRASH_SCROLL_DISTANCE * (CRASH_FRAME_COUNT - 1),
        0, CRASH_FRAME_COUNT - 1
      );
      crash.exitDistance  = 0;
      crash.exitDirection = 0;
      return;
    }

    if (crash.exitDirection !== direction) { crash.exitDirection = direction; crash.exitDistance = 0; }
    crash.exitDistance += distance;
    if (crash.exitDistance >= CRASH_EXIT_DISTANCE) goToPage(ERA_PAGE_END);
    return;
  }

  const now = performance.now();
  if (now < wheel.unlockAt) return;
  const direction    = delta > 0 ? 1 : -1;
  const isNewGesture = now - wheel.lastEventAt > WHEEL_GESTURE_GAP || direction !== wheel.gestureDirection;
  if (isNewGesture) {
    wheel.gestureAccum     = delta;
    wheel.gestureDirection = direction;
  } else {
    wheel.gestureAccum += delta;
  }
  wheel.lastEventAt = now;
  if (Math.abs(wheel.gestureAccum) < WHEEL_NAV_THRESHOLD) return;
  wheel.unlockAt = now + WHEEL_NAV_LOCK_MS;
  goToPage(nav.currentPage + direction);
}, { passive: false });
