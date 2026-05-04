export const HERO_PAGE_START  = 0;
export const ERA_PAGE_STEPS   = 5;
export const HERO_PAGE_STEPS  = 1 + ERA_PAGE_STEPS;
export const HERO_PAGE_END    = HERO_PAGE_START + HERO_PAGE_STEPS;
// Section ère supprimée – ère intégrée dans hero (pages 1–6)
export const ERA_PAGE_START   = HERO_PAGE_END + 1;   // dead – conservé pour dispatch
export const ERA_PAGE_END     = ERA_PAGE_START + ERA_PAGE_STEPS;
export const CRASH_PAGE_START = HERO_PAGE_END + 1;
export const CRASH_PAGE_STEPS = 48;
export const CRASH_PAGE_END   = CRASH_PAGE_START + CRASH_PAGE_STEPS - 1;
export const VIEWER_PAGE_START = CRASH_PAGE_END + 1;
export const VIEWER_PAGE_END   = VIEWER_PAGE_START + 7;
export const SPA_PAGE_START   = VIEWER_PAGE_END + 1;
export const SPA_PAGE_COUNT   = 5;
export const SPA_PAGE_END     = SPA_PAGE_START + SPA_PAGE_COUNT - 1;
export const CONCLUSION_PAGE  = SPA_PAGE_END + 1;
export const PAGE_COUNT       = CONCLUSION_PAGE + 1;

export const CRASH_SCROLL_DISTANCE = 7000;
export const CRASH_EXIT_DISTANCE   = 220;
export const CRASH_FRAME_COUNT     = 301;
export const CRASH_LERP_FACTOR     = 0.35;
export const WHEEL_GESTURE_GAP     = 140;
export const WHEEL_NAV_THRESHOLD   = 42;
export const WHEEL_NAV_LOCK_MS     = 1150;

export function isEraPage(_idx) { return false; }

export function isHeroPage(idx) {
  return idx >= HERO_PAGE_START && idx <= HERO_PAGE_END;
}

export function isCrashPage(idx) {
  return idx >= CRASH_PAGE_START && idx <= CRASH_PAGE_END;
}

export function isSpaPage(idx) {
  return idx >= SPA_PAGE_START && idx <= SPA_PAGE_END;
}

export function pageToY(idx) {
  if (isHeroPage(idx)) return 0;
  if (idx >= CRASH_PAGE_START && idx <= CRASH_PAGE_END) return -100;
  if (idx >= VIEWER_PAGE_START && idx <= VIEWER_PAGE_END) return -200;
  if (idx >= SPA_PAGE_START && idx <= SPA_PAGE_END) return -300;
  if (idx === CONCLUSION_PAGE) return -400;
  return -600;
}

export function pageToCamera(idx) {
  if (idx === VIEWER_PAGE_START)     return 0;
  if (idx === VIEWER_PAGE_START + 1) return 1;
  if (idx === VIEWER_PAGE_START + 2) return 2;
  if (idx === VIEWER_PAGE_START + 3) return 3;
  if (idx === VIEWER_PAGE_START + 4) return 4;
  if (idx === VIEWER_PAGE_START + 5) return 5;
  if (idx === VIEWER_PAGE_START + 6) return 6;
  if (idx === VIEWER_PAGE_START + 7) return 7;
  if (idx === VIEWER_PAGE_START + 8) return 8;
  return -1;
}

export function pageToSectionIndex(pageIdx) {
  if (pageIdx === HERO_PAGE_START) return 0;
  if (isHeroPage(pageIdx)) return 1;
  if (pageIdx >= CRASH_PAGE_START && pageIdx <= CRASH_PAGE_END) return 2;
  if (pageIdx >= VIEWER_PAGE_START && pageIdx <= VIEWER_PAGE_END) return 3;
  if (pageIdx >= SPA_PAGE_START && pageIdx <= SPA_PAGE_END) return 4;
  if (pageIdx === CONCLUSION_PAGE) return 5;
  return 5;
}

export function crashPageToProgress(idx) {
  return (idx - CRASH_PAGE_START) / (CRASH_PAGE_STEPS - 1);
}

export function crashFrameToProgress(frameIndex) {
  return frameIndex / (CRASH_FRAME_COUNT - 1);
}

export function normalizeWheelDelta(event) {
  let delta = event.deltaY;
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) delta *= 16;
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) delta *= window.innerHeight;
  return delta;
}
