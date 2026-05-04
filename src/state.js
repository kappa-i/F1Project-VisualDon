// Shared mutable state across modules

export const nav = {
  currentPage: 0,
  isTransitioning: false,
  modelLoaded: false,
};

export const wheel = {
  gestureAccum: 0,
  gestureDirection: 0,
  lastEventAt: 0,
  unlockAt: 0,
};

export const crash = {
  targetFrame: 0,
  renderedFrame: 0,
  exitDistance: 0,
  exitDirection: 0,
  activeTitleIndex: -1,
  activeImolaState: -1,
};

export const haas = {
  model: null,
  indicatorMaterials: [],
  backlightMaterials: [],
  blinkerAnim: null,
  backlightAnim: null,
};

export function resetWheelGesture() {
  wheel.gestureAccum = 0;
  wheel.gestureDirection = 0;
  wheel.lastEventAt = 0;
}
