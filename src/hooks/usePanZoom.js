import { useState, useRef, useCallback, useEffect } from 'react';

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const MOMENTUM_FRICTION = 0.92;
const MOMENTUM_THRESHOLD = 0.5;

export function usePanZoom(viewportWidth, viewportHeight, imageWidth, imageHeight) {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const animationFrame = useRef(null);

  // Calculate pan limits based on current scale
  const getLimits = useCallback(
    (scale) => {
      const scaledWidth = imageWidth * scale;
      const scaledHeight = imageHeight * scale;
      const maxX = Math.max(0, (scaledWidth - viewportWidth) / 2);
      const maxY = Math.max(0, (scaledHeight - viewportHeight) / 2);
      return { maxX, maxY };
    },
    [imageWidth, imageHeight, viewportWidth, viewportHeight]
  );

  // Clamp value between min and max
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  // Apply transform with limits
  const applyTransform = useCallback(
    (x, y, scale) => {
      const { maxX, maxY } = getLimits(scale);
      const clampedX = clamp(x, -maxX, maxX);
      const clampedY = clamp(y, -maxY, maxY);
      setTransform({ x: clampedX, y: clampedY, scale });
    },
    [getLimits]
  );

  // Start momentum animation
  const startMomentum = useCallback(() => {
    const animate = () => {
      velocity.current.x *= MOMENTUM_FRICTION;
      velocity.current.y *= MOMENTUM_FRICTION;

      if (
        Math.abs(velocity.current.x) < MOMENTUM_THRESHOLD &&
        Math.abs(velocity.current.y) < MOMENTUM_THRESHOLD
      ) {
        return;
      }

      const newX = transform.x + velocity.current.x;
      const newY = transform.y + velocity.current.y;
      applyTransform(newX, newY, transform.scale);

      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);
  }, [transform, applyTransform]);

  // Stop momentum
  const stopMomentum = useCallback(() => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
  }, []);

  // Mouse/touch event handlers
  const onPointerDown = useCallback(
    (clientX, clientY) => {
      stopMomentum();
      isDragging.current = true;
      lastPosition.current = { x: clientX, y: clientY };
      velocity.current = { x: 0, y: 0 };
    },
    [stopMomentum]
  );

  const onPointerMove = useCallback(
    (clientX, clientY) => {
      if (!isDragging.current) return;

      const deltaX = clientX - lastPosition.current.x;
      const deltaY = clientY - lastPosition.current.y;

      velocity.current = { x: deltaX, y: deltaY };
      lastPosition.current = { x: clientX, y: clientY };

      const newX = transform.x + deltaX;
      const newY = transform.y + deltaY;
      applyTransform(newX, newY, transform.scale);
    },
    [transform, applyTransform]
  );

  const onPointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const speed = Math.sqrt(
      velocity.current.x ** 2 + velocity.current.y ** 2
    );
    if (speed > MOMENTUM_THRESHOLD) {
      startMomentum();
    }
  }, [startMomentum]);

  // Zoom handlers
  const onZoom = useCallback(
    (delta, centerX, centerY) => {
      stopMomentum();

      const newScale = clamp(transform.scale + delta, MIN_SCALE, MAX_SCALE);

      // Zoom towards the center point
      const scaleRatio = newScale / transform.scale;
      const newX = centerX - (centerX - transform.x) * scaleRatio;
      const newY = centerY - (centerY - transform.y) * scaleRatio;

      applyTransform(newX, newY, newScale);
    },
    [transform, applyTransform, stopMomentum]
  );

  // Reset to center
  const reset = useCallback(() => {
    stopMomentum();
    applyTransform(0, 0, 1);
  }, [applyTransform, stopMomentum]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, []);

  return {
    transform,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onZoom },
    reset,
    isDragging: isDragging.current,
  };
}
