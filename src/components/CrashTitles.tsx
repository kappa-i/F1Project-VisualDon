import React, { useEffect, useState } from 'react';

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
        <h2
          key={title}
          className={`crash-title ${activeTitleIndex === index ? 'is-active' : ''}`}
        >
          {title}
        </h2>
      ))}
    </div>
  );
};

export default CrashTitles;
