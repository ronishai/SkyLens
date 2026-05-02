import { useState, useEffect, useMemo } from 'react';
import styles from './Background.module.css';

function generateStars(count: number, maxX: number, maxY: number): string {
  return Array.from(
    { length: count },
    () => `${Math.random() * maxX}px ${Math.random() * maxY}px white`
  ).join(', ');
}

const shootingStars = () =>
  Array.from({ length: 10 }, (_, i) => ({
    top: `${Math.random() * 100}%`,
    right: `${Math.random() * 100}%`,
    animationDelay: `-${Math.random() * 5}s`,
    animationDuration: `${1 + Math.random() * 4}s`,
  }));

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

  const stars = useMemo(
    () => ({
      small: generateStars(100, size.width, size.height),
      medium: generateStars(50, size.width, size.height),
      large: generateStars(20, size.width, size.height),
    }),
    [size]
  );

  return (
    <div>
      <div className={styles.drift}>
        <div
          className={`${styles.stars} ${styles.small}`}
          style={{ boxShadow: stars.small }}
        ></div>
      </div>
      <div className={styles.drift}>
        <div
          className={`${styles.stars} ${styles.medium}`}
          style={{ boxShadow: stars.medium }}
        ></div>
      </div>
      <div className={styles.drift}>
        <div
          className={`${styles.stars} ${styles.large}`}
          style={{ boxShadow: stars.large }}
        ></div>
      </div>
      <section>
        {shootingStars().map((star, index) => (
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
