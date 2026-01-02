import React, { useEffect, useState } from 'react';
import './KineticText.css';

const KineticText = ({ text }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const repeatCount = 15;
  const copies = Array.from({ length: repeatCount });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // create a loop every 1000px
      const loop = (scrollY % 1000) / 1000;
      setScrollProgress(loop);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate breathing scale based on scroll (Sine wave: starts at 1, goes up/down, returns to 1)
  // Math.sin(progress * 2PI) -> -1 to 1.
  // Scale range: 0.8 to 1.5
  // We want continuous loop.
  const baseScale = 1;
  const variance = 0.5;
  const scale = baseScale + Math.sin(scrollProgress * Math.PI * 2) * variance;

  return (
    <div className="kinetic-container">
      <div
        className="kinetic-wrapper"
        style={{
          '--scroll-scale': scale,
        }}
      >
        {copies.map((_, index) => (
          <div
            key={index}
            className="kinetic-layer"
            style={{
              '--i': index,
              zIndex: repeatCount - index
            }}
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default KineticText;
