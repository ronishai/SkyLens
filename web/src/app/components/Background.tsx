import { useState, useEffect, useMemo } from 'react';

function generateStars(count: number, maxX: number, maxY: number): string {
  return Array.from(
    { length: count },
    () => `${Math.random() * maxX}px ${Math.random() * maxY}px white`
  ).join(', ');
}

function Background() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const onResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const smallStars = useMemo(
    () => generateStars(100, size.width, size.height),
    [size]
  );
  const mediumStars = useMemo(
    () => generateStars(50, size.width, size.height),
    [size]
  );
  const largeStars = useMemo(
    () => generateStars(20, size.width, size.height),
    [size]
  );

  const shootingStars = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        top: `${Math.random() * 100}%`,
        right: `${Math.random() * 100}%`,
        animationDelay: `-${Math.random() * 5}s`,
        animationDuration: `${1 + Math.random() * 4}s`,
      })),
    []
  );

  return (
    <div>
      <div className="drift">
        <div className="stars small" style={{ boxShadow: smallStars }}></div>
      </div>
      <div className="drift">
        <div className="stars medium" style={{ boxShadow: mediumStars }}></div>
      </div>
      <div className="drift">
        <div className="stars large" style={{ boxShadow: largeStars }}></div>
      </div>
      <section>
        {shootingStars.map((star, index) => (
          <span
            key={index}
            style={{
              top: star.top,
              right: star.right,
              left: 'initial',
              animationDelay: star.animationDelay,
              animationDuration: star.animationDuration,
            }}
          />
        ))}
      </section>
    </div>
  );
}

export default Background;
