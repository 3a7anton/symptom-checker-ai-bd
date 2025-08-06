import { useEffect } from 'react';
import Lenis from 'lenis';

let lenis: Lenis | null = null;

export const useLenis = () => {
  useEffect(() => {
    // Initialize Lenis
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Animation frame function
    function raf(time: number) {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis?.destroy();
      lenis = null;
    };
  }, []);

  return lenis;
};

export default useLenis;
