import React, { useEffect, useState } from 'react';

const SECTION_COUNT = 7;

function clampProgress(value: number) {
  return Math.max(0, Math.min(SECTION_COUNT - 1, value));
}

export default function BottomSectionNav() {
  const [activeSection, setActiveSection] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleProgress = (event: Event) => {
      const customEvent = event as CustomEvent<{ progress?: number; activeSectionIndex?: number }>;
      const nextProgress = clampProgress(customEvent.detail?.progress ?? 0);
      const nextActive = Math.max(0, Math.min(SECTION_COUNT - 1, customEvent.detail?.activeSectionIndex ?? 0));
      setProgress(nextProgress);
      setActiveSection(nextActive);
    };

    window.addEventListener('section-nav-progress', handleProgress as EventListener);
    return () => {
      window.removeEventListener('section-nav-progress', handleProgress as EventListener);
    };
  }, []);

  const progressPercent = `${(progress / (SECTION_COUNT - 1)) * 100}%`;

  const goToSection = (sectionIndex: number) => {
    window.dispatchEvent(new CustomEvent('section-nav-jump', {
      detail: { sectionIndex, source: 'nav' },
    }));
  };

  return (
    <nav className="bottom-section-nav" aria-label="Navigation des sections">
      <div className="bottom-section-nav__shell">
        <div className="bottom-section-nav__sections">
          <div className="bottom-section-nav__track" aria-hidden="true">
            <div
              className="bottom-section-nav__fill"
              style={{ width: progressPercent }}
            />
          </div>

          {Array.from({ length: SECTION_COUNT }, (_, index) => {
            const isActive = index === activeSection;
            return (
              <button
                key={index}
                type="button"
                className={`bottom-section-nav__link${isActive ? ' is-active' : ''}`}
                onClick={() => goToSection(index)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={index === 0 ? 'Home' : `Section-${index + 1}`}
              >
                <span className={`bottom-section-nav__dot${index === 0 ? ' is-home' : ''}`} aria-hidden="true">
                  {index === 0 ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 10.75 12 4l8 6.75V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />
                    </svg>
                  ) : null}
                </span>
                <span className="bottom-section-nav__label">{index === 0 ? 'Home' : `Section-${index + 1}`}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
