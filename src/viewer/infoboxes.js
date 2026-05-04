import haasData from '../data/haas.json';
import { VIEWER_PAGE_START } from '../navigation/constants.js';
import { renderSourceTrigger } from '../ui/sourceModal.js';

export function renderHaasInfoboxes() {
  const container = document.getElementById('haas-infoboxes');
  if (!container) return;
  container.innerHTML = haasData.steps
    .filter(step => step.infobox !== null)
    .map(step => {
      const ib    = step.infobox;
      const specs = ib.specs.map(s =>
        `<div class="ib-spec"><span class="spec-label">${s.label}</span><span class="spec-dots"></span><span class="spec-value${s.accent ? ' accent' : ''}">${s.value}</span></div>`
      ).join('');
      const sourceBtn = ib.source
        ? `<div class="ib-source"><button class="source-link source-link--label js-source-trigger" type="button" data-source-id="${ib.source.id}">Source</button></div>`
        : '';
      return `
<div class="infobox ${ib.position}" id="${ib.id}">
  <div class="ib-tag">${ib.tag}</div>
  <div class="ib-title">${ib.title.join('<br>')}</div>
  <div class="ib-divider"></div>
  <div class="ib-specs">${specs}</div>
  <div class="ib-desc">${ib.desc}</div>
  ${sourceBtn}
</div>`;
    }).join('');
}

export const INFOBOXES = Object.fromEntries(
  haasData.steps
    .filter(step => step.infobox !== null)
    .map(step => [VIEWER_PAGE_START + step.cameraIndex, step.infobox.id])
);
