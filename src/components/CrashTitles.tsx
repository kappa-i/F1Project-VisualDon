import React, { useEffect, useState } from 'react';

const TITLES = [
  { label: '01', text: '1994, Imola' },
  { label: '02', text: 'Un crash mythique' },
  { label: '03', text: 'qui a tout changé...' },
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
    <div className="crash-chapters">
      {TITLES.map((item, index) => (
        <div
          key={item.text}
          className={`crash-chapter ${activeTitleIndex === index ? 'is-active' : ''} ${activeTitleIndex > index ? 'is-done' : ''}`}
        >
          <span className="crash-chapter__num">{item.label}</span>
          <span className="crash-chapter__text">{item.text}</span>
        </div>
      ))}
    </div>
  );
};

export default CrashTitles;
