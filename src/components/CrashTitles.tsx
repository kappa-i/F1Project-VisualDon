import React, { useEffect, useState } from 'react';
import SplitText from './SplitText.tsx';

const TITLES = [
  '1994, Imola',
  'Un crash mythique',
  'qui a tout change...',
];

const CrashTitles = () => {
  const [activeTitleIndex, setActiveTitleIndex] = useState(-1);

  useEffect(() => {
    const handleTitleChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ index: number }>;
      setActiveTitleIndex(customEvent.detail.index);
    };

    window.addEventListener('crash-title-change', handleTitleChange);
    return () => {
      window.removeEventListener('crash-title-change', handleTitleChange);
    };
  }, []);

  return (
    <div className="crash-title-stack">
      {TITLES.map((title, index) => (
        <SplitText
          key={title}
          text={title}
          tag="h2"
          active={activeTitleIndex === index}
          delay={50}
          duration={1.25}
          ease="power3.out"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          className={`crash-title ${activeTitleIndex === index ? 'is-active' : ''}`}
        />
      ))}
    </div>
  );
};

export default CrashTitles;
