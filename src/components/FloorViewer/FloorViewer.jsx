import { useState } from 'react';
import { ImageViewport } from './ImageViewport';
import { DayNightToggle } from './DayNightToggle';
import { CategoryFilterBar } from './CategoryFilterBar';
import { POIPin } from './POIPin';
import { BackButton } from './BackButton';
import { pois } from '../../data/pois';
import './FloorViewer.css';

export function FloorViewer({ floor, onBack }) {
  const [isNight, setIsNight] = useState(false);
  const [activeCategories, setActiveCategories] = useState(['all']);

  const currentImage = isNight ? floor.nightImage : floor.dayImage;

  const handleDayNightToggle = () => {
    setIsNight((prev) => !prev);
  };

  const handleCategoryToggle = (category) => {
    if (category === 'all') {
      setActiveCategories(['all']);
      return;
    }

    setActiveCategories((prev) => {
      const withoutAll = prev.filter((c) => c !== 'all');
      if (withoutAll.includes(category)) {
        const filtered = withoutAll.filter((c) => c !== category);
        return filtered.length === 0 ? ['all'] : filtered;
      }
      return [...withoutAll, category];
    });
  };

  const isPOIVisible = (poi) => {
    const inFloorRange =
      floor.id >= poi.visibleFromFloor && floor.id <= poi.visibleToFloor;
    const inActiveCategory =
      activeCategories.includes('all') || activeCategories.includes(poi.category);
    return inFloorRange && inActiveCategory;
  };

  return (
    <div className="floor_viewer">
      <ImageViewport imageSrc={currentImage}>
        {pois.map((poi) => (
          <POIPin
            key={poi.id}
            poi={poi}
            isVisible={isPOIVisible(poi)}
            onToggleCategory={handleCategoryToggle}
          />
        ))}
      </ImageViewport>

      <div className="floor_viewer__ui">
        <div className="floor_viewer__top-bar">
          <BackButton onClick={onBack} />
          <div className="floor_viewer__floor-info">
            <span className="floor_viewer__floor-label">Viewing</span>
            <span className="floor_viewer__floor-name">{floor.name}</span>
          </div>
          <DayNightToggle isNight={isNight} onToggle={handleDayNightToggle} />
        </div>

        <div className="floor_viewer__bottom-bar">
          <CategoryFilterBar
            activeCategories={activeCategories}
            onToggle={handleCategoryToggle}
          />
        </div>
      </div>
    </div>
  );
}
