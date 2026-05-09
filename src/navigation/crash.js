import * as THREE from 'three';
import { crash } from '../state.js';
import { CRASH_FRAME_COUNT, CRASH_LERP_FACTOR } from './constants.js';

const CARD_THRESHOLDS   = [36, 90, 150, 230];
const CRASH_VIDEO_DURATION = 14;
const IMOLA_SHOW_FRAME  = 90;
const IMOLA_MORPH_FRAME = 230;
const IMOLA_RESET_FRAME = 20;

const crashFrameEl      = document.getElementById('crash-frame');
const crashCtx          = crashFrameEl ? crashFrameEl.getContext('2d') : null;
const crashProgressFill = document.getElementById('crash-progress-fill');
const crashProgressThumb = document.getElementById('crash-progress-thumb');
const ytbCurrent        = document.getElementById('ytb-current');
const infoCards         = Array.from(document.querySelectorAll('.info-card[data-card]'));

const crashFrameUrls = Array.from({ length: CRASH_FRAME_COUNT }, (_, i) =>
  `/crash-frames/frame_${String(i + 1).padStart(3, '0')}.jpg`
);
const crashFrameImages = crashFrameUrls.map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

export function resizeCrashCanvas() {
  if (!crashFrameEl || !crashCtx) return;
  crashFrameEl.width  = crashFrameEl.offsetWidth;
  crashFrameEl.height = crashFrameEl.offsetHeight;
  renderCrashFrame(crash.renderedFrame);
}

export function renderCrashFrame(frameIndex) {
  const clamped = THREE.MathUtils.clamp(Math.round(frameIndex), 0, CRASH_FRAME_COUNT - 1);
  if (!crashCtx) return;
  const img = crashFrameImages[clamped];
  if (!img.complete || img.naturalWidth === 0) return;
  const cw = crashFrameEl.width;
  const ch = crashFrameEl.height;
  if (!cw || !ch) return;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  const scale = Math.max(cw / iw, ch / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  crashCtx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);

  const progress = clamped / (CRASH_FRAME_COUNT - 1);
  const pct = (progress * 100).toFixed(2) + '%';
  if (crashProgressFill)  crashProgressFill.style.width = pct;
  if (crashProgressThumb) crashProgressThumb.style.left = pct;
  if (ytbCurrent) {
    const secs = Math.round(progress * CRASH_VIDEO_DURATION);
    ytbCurrent.textContent = '0:' + String(secs).padStart(2, '0');
  }

  let activeCard = -1;
  for (let i = CARD_THRESHOLDS.length - 1; i >= 0; i--) {
    if (clamped >= CARD_THRESHOLDS[i]) { activeCard = i; break; }
  }
  infoCards.forEach((card, i) => {
    card.classList.toggle('is-visible', clamped >= CARD_THRESHOLDS[i]);
    card.classList.toggle('is-active', i === activeCard);
  });
}

export function updateCrashTitles(frameIndex) {
  const introFrames    = Math.floor(CRASH_FRAME_COUNT * 0.12);
  const sequenceFrames = CRASH_FRAME_COUNT - introFrames;
  let nextTitleIndex   = -1;

  if (frameIndex >= introFrames) {
    const normalizedFrame = frameIndex - introFrames;
    const titleWindow = Math.max(1, Math.floor(sequenceFrames / 3));
    nextTitleIndex = Math.min(2, Math.floor(normalizedFrame / titleWindow));
  }

  if (nextTitleIndex !== crash.activeTitleIndex) {
    crash.activeTitleIndex = nextTitleIndex;
    window.dispatchEvent(new CustomEvent('crash-title-change', { detail: { index: nextTitleIndex } }));
  }

  let nextImolaState = crash.activeImolaState;
  if (frameIndex < IMOLA_RESET_FRAME) {
    nextImolaState = -1;
  } else if (frameIndex >= IMOLA_MORPH_FRAME) {
    nextImolaState = 1;
  } else if (frameIndex >= IMOLA_SHOW_FRAME) {
    nextImolaState = 0;
  }

  if (nextImolaState !== crash.activeImolaState) {
    crash.activeImolaState = nextImolaState;
    if (nextImolaState === -1)     window.dispatchEvent(new CustomEvent('crash-imola-reset'));
    else if (nextImolaState === 0) window.dispatchEvent(new CustomEvent('crash-imola-show'));
    else                           window.dispatchEvent(new CustomEvent('crash-imola-morph'));
  }
}

export function setCrashProgress(nextProgress, immediate = false) {
  const clamped = THREE.MathUtils.clamp(nextProgress, 0, 1);
  crash.targetFrame = clamped * (CRASH_FRAME_COUNT - 1);
  if (immediate) {
    crash.renderedFrame = Math.round(crash.targetFrame);
    renderCrashFrame(crash.renderedFrame);
  }
  if (clamped > 0.005 && clamped < 0.995) {
    crash.exitDistance  = 0;
    crash.exitDirection = 0;
  }
}

export function tickCrashLerp() {
  const lerpDelta = crash.targetFrame - crash.renderedFrame;
  if (Math.abs(lerpDelta) > 0.05) {
    crash.renderedFrame += lerpDelta * CRASH_LERP_FACTOR;
  } else {
    crash.renderedFrame = crash.targetFrame;
  }
  const renderedIndex = Math.round(crash.renderedFrame);
  renderCrashFrame(renderedIndex);
  updateCrashTitles(renderedIndex);
  return renderedIndex;
}

// Initialise le canvas et précharge la première frame
resizeCrashCanvas();
const _firstCrashImg = crashFrameImages[0];
if (_firstCrashImg.complete && _firstCrashImg.naturalWidth > 0) {
  renderCrashFrame(0);
} else {
  _firstCrashImg.onload = () => renderCrashFrame(0);
}
