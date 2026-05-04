import haasData from '../data/haas.json';

export const SOURCE_ENTRIES = Object.fromEntries([
  [haasData.car.source.id, {
    title: haasData.car.source.value,
    url:   haasData.car.source.url,
  }],
  ...haasData.steps
    .filter(s => s.infobox?.source)
    .map(s => [s.infobox.source.id, {
      title: s.infobox.source.label,
      url:   s.infobox.source.url,
    }]),
]);

export function renderSourceTrigger(text, sourceId, variant = 'value') {
  return `<button class="source-link source-link--${variant} js-source-trigger" type="button" data-source-id="${sourceId}">${text}</button>`;
}

export function renderStatusbar({ chassis, powerUnit, drivers, sourceLabel, sourceValue, sourceId }) {
  return `<div class="stat-block"><div class="stat-label">Châssis</div><div class="stat-value">${chassis}</div></div><div class="sep"></div><div class="stat-block"><div class="stat-label">Groupe motopropulseur</div><div class="stat-value">${powerUnit}</div></div><div class="sep"></div><div class="stat-block"><div class="stat-label">Pilotes</div><div class="stat-value hi">${drivers}</div></div><div class="sep"></div><div class="stat-block" style="text-align:right"><div class="stat-label">${renderSourceTrigger(sourceLabel, sourceId, 'label')}</div><div class="stat-value">${renderSourceTrigger(sourceValue, sourceId, 'value')}</div></div>`;
}

const sourceModalEl       = document.getElementById('source-modal');
const sourceModalTitleEl  = document.getElementById('source-modal-title');
const sourceModalUrlEl    = document.getElementById('source-modal-url');
const sourceModalActionEl = document.getElementById('source-modal-action');
let sourceModalLastTrigger = null;

export function openSourceModal(sourceId, triggerEl = null) {
  const entry = SOURCE_ENTRIES[sourceId];
  if (!entry || !sourceModalEl || !sourceModalTitleEl || !sourceModalUrlEl || !sourceModalActionEl) return;
  sourceModalLastTrigger = triggerEl;
  const titleTextEl = sourceModalTitleEl.querySelector('span:last-child');
  if (titleTextEl) titleTextEl.textContent = entry.title;
  sourceModalUrlEl.textContent = entry.url;
  sourceModalUrlEl.href = entry.url;
  sourceModalActionEl.href = entry.url;
  sourceModalEl.classList.add('is-open');
  sourceModalEl.setAttribute('aria-hidden', 'false');
  document.body.classList.add('source-modal-open');
}

export function closeSourceModal() {
  if (!sourceModalEl) return;
  sourceModalEl.classList.remove('is-open');
  sourceModalEl.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('source-modal-open');
  if (sourceModalLastTrigger instanceof HTMLElement) sourceModalLastTrigger.focus();
}

document.addEventListener('click', event => {
  const trigger = event.target instanceof Element ? event.target.closest('.js-source-trigger') : null;
  if (trigger instanceof HTMLElement) {
    openSourceModal(trigger.dataset.sourceId, trigger);
    return;
  }
  const closer = event.target instanceof Element ? event.target.closest('[data-source-close]') : null;
  if (closer) closeSourceModal();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && sourceModalEl?.classList.contains('is-open')) {
    closeSourceModal();
  }
});
