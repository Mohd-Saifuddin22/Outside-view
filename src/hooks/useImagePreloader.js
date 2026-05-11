import { useState, useEffect } from 'react';

export function useImagePreloader(imagePaths) {
  const [loadedCount, setLoadedCount] = useState(0);
  const [totalCount] = useState(imagePaths.length);

  useEffect(() => {
    let cancelled = false;

    imagePaths.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (!cancelled) {
          setLoadedCount((prev) => prev + 1);
        }
      };
      img.onerror = () => {
        if (!cancelled) {
          setLoadedCount((prev) => prev + 1);
        }
      };
    });

    return () => {
      cancelled = true;
    };
  }, [imagePaths]);

  return {
    loadedCount,
    totalCount,
    isAllLoaded: loadedCount >= totalCount,
    progress: totalCount > 0 ? loadedCount / totalCount : 1,
  };
}
