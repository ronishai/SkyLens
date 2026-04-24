import { useMemo } from 'react';

function generateStars(count: number, maxX: number, maxY: number): string {
  return Array.from(
    { length: count },
    () => `${Math.random() * maxX}px ${Math.random() * maxY}px white`
  ).join(', ');
}

function Background() {
  const smallStars = useMemo(
    () => generateStars(100, window.innerWidth, window.innerHeight),
    []
  );
  const mediumStars = useMemo(
    () => generateStars(50, window.innerWidth, window.innerHeight),
    []
  );
  const largeStars = useMemo(
    () => generateStars(20, window.innerWidth, window.innerHeight),
    []
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
