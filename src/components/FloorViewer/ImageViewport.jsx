import { useRef, useState, useEffect, useCallback } from 'react';
import { usePanZoom } from '../../hooks/usePanZoom';
import './ImageViewport.css';

export function ImageViewport({ imageSrc, children }) {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Measure container
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Get natural image dimensions
  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    setImageDimensions({ width: naturalWidth, height: naturalHeight });
    setIsLoaded(true);
  };

  const { transform, handlers, reset } = usePanZoom(
    dimensions.width,
    dimensions.height,
    imageDimensions.width || dimensions.width,
    imageDimensions.height || dimensions.height
  );

  // Wheel zoom handler
  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.2 : 0.2;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = e.clientX - rect.left - dimensions.width / 2;
      const centerY = e.clientY - rect.top - dimensions.height / 2;
      handlers.onZoom(delta, centerX, centerY);
    },
    [handlers, dimensions]
  );

  // Touch handlers for pinch zoom
  const lastTouchDistance = useRef(0);

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDistance.current = Math.sqrt(dx * dx + dy * dy);
    } else if (e.touches.length === 1) {
      handlers.onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const delta = (distance - lastTouchDistance.current) * 0.01;
      lastTouchDistance.current = distance;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left - dimensions.width / 2;
      const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top - dimensions.height / 2;
      handlers.onZoom(delta, centerX, centerY);
    } else if (e.touches.length === 1) {
      handlers.onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchEnd = () => {
    handlers.onPointerUp();
  };

  return (
    <div className="image-viewport" ref={containerRef}>
      {!isLoaded && (
        <div className="image-viewport__loading">
          <div className="image-viewport__spinner" />
        </div>
      )}
      <div
        className={`image-viewport__image-container ${isLoaded ? 'loaded' : ''}`}
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
        }}
        onMouseDown={(e) => handlers.onPointerDown(e.clientX, e.clientY)}
        onMouseMove={(e) => handlers.onPointerMove(e.clientX, e.clientY)}
        onMouseUp={handlers.onPointerUp}
        onMouseLeave={handlers.onPointerUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={imageSrc}
          alt="Panoramic view"
          className="image-viewport__image"
          onLoad={handleImageLoad}
          draggable={false}
        />
        <div className="image-viewport__pois">{children}</div>
      </div>
      <div className="image-viewport__controls">
        <button className="image-viewport__btn" onClick={() => handlers.onZoom(0.5, 0, 0)} aria-label="Zoom in">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
          </svg>
        </button>
        <button className="image-viewport__btn" onClick={() => handlers.onZoom(-0.5, 0, 0)} aria-label="Zoom out">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35M8 11h6" />
          </svg>
        </button>
        <button className="image-viewport__btn" onClick={reset} aria-label="Reset view">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
