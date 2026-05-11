import { useRef, useCallback } from 'react';

export function useMomentum(initialVelocity = 0) {
  const velocityRef = useRef({ x: initialVelocity, y: initialVelocity });
  const isActiveRef = useRef(false);

  const setVelocity = useCallback((vx, vy) => {
    velocityRef.current = { x: vx, y: vy };
  }, []);

  const stop = useCallback(() => {
    isActiveRef.current = false;
  }, []);

  const start = useCallback(() => {
    isActiveRef.current = true;
  }, []);

  return { velocityRef, isActiveRef, setVelocity, start, stop };
}
