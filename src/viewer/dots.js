import { nav } from '../state.js';
import { VIEWER_PAGE_START, VIEWER_PAGE_END } from '../navigation/constants.js';
import { goToPage } from '../navigation/pages.js';

export const dotsEl = document.createElement('div');
dotsEl.style.cssText = `
  position:fixed; right:30px; top:50%; transform:translateY(-50%);
  display:flex; flex-direction:column; gap:10px;
  pointer-events:none; z-index:30;
  opacity:0; transition:opacity 0.6s ease;
`;
document.body.appendChild(dotsEl);

export function rebuildDots() {
  dotsEl.innerHTML = '';
  for (let i = 0; i <= VIEWER_PAGE_END - VIEWER_PAGE_START; i++) {
    const pageIdx = VIEWER_PAGE_START + i;
    const d = document.createElement('div');
    d.style.cssText = `
      width:6px; height:6px; border-radius:50%;
      background:${nav.currentPage === pageIdx ? '#e8002d' : 'rgba(255,255,255,0.2)'};
      transition:background .4s, transform .4s;
      cursor:pointer;
    `;
    d.addEventListener('click', () => {
      if (!nav.modelLoaded || nav.isTransitioning) return;
      goToPage(pageIdx);
    });
    dotsEl.appendChild(d);
  }
}

export function updateDots() {
  dotsEl.querySelectorAll('div').forEach((d, i) => {
    const pageIdx = VIEWER_PAGE_START + i;
    d.style.background = nav.currentPage === pageIdx ? '#e8002d' : 'rgba(255,255,255,0.2)';
    d.style.transform  = nav.currentPage === pageIdx ? 'scale(1.5)' : 'scale(1)';
  });
}
