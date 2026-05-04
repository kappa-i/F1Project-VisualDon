import haasData from '../data/haas.json';
import { haas } from '../state.js';
import { VIEWER_PAGE_START, VIEWER_PAGE_END } from '../navigation/constants.js';
import { stopHaasBlinker, stopHaasBacklight } from './haasAnimations.js';
import { rebuildDots, dotsEl } from './dots.js';
import { renderSourceTrigger } from '../ui/sourceModal.js';

let _lastViewerKind = '';

export function setViewerIntro(visible) {
  const el = document.getElementById('viewer-intro');
  if (el) el.classList.toggle('visible', visible);
}

export function updateHUD(pageIdx) {
  const isHaas = pageIdx >= VIEWER_PAGE_START && pageIdx <= VIEWER_PAGE_END;
  const kind   = isHaas ? 'haas' : '';

  if (kind !== _lastViewerKind) { _lastViewerKind = kind; rebuildDots(); }

  document.body.classList.toggle('hud-active', isHaas);
  dotsEl.style.opacity      = isHaas ? '1' : '0';
  dotsEl.style.pointerEvents = isHaas ? 'auto' : 'none';

  if (!isHaas) {
    document.querySelectorAll('.infobox').forEach(el => el.classList.remove('visible'));
    setViewerIntro(false);
  } else if (pageIdx === VIEWER_PAGE_START) {
    setViewerIntro(true);
  }

  if (haas.model) haas.model.visible = isHaas;
  if (!isHaas) { stopHaasBlinker(); stopHaasBacklight(); }

  const hudSourceEl = document.getElementById('hud-source');
  if (hudSourceEl) {
    if (isHaas) {
      const { car } = haasData;
      hudSourceEl.innerHTML = `<div class="hud-source__label">${renderSourceTrigger(car.source.label, car.source.id, 'label')}</div><div class="hud-source__value">${renderSourceTrigger(car.source.value, car.source.id, 'value')}</div>`;
    } else {
      hudSourceEl.innerHTML = '';
    }
  }
}
