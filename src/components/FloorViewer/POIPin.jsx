import { useState } from 'react';
import './POIPin.css';

const categoryColors = {
  transit: 'var(--color-transit)',
  nature: 'var(--color-nature)',
  shopping: 'var(--color-shopping)',
  dining: 'var(--color-dining)',
};

export function POIPin({ poi, isVisible, onToggleCategory }) {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!isVisible) return null;

  const color = categoryColors[poi.category] || 'var(--color-white)';

  return (
    <div
      className="poi-pin"
      style={{
        left: `${poi.x}%`,
        top: `${poi.y}%`,
        '--poi-color': color,
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      onClick={() => onToggleCategory(poi.category)}
    >
      <div className="poi-pin__dot" />
      <div className="poi-pin__glow" />
      {showTooltip && (
        <div className="poi-pin__tooltip">
          <span className="poi-pin__tooltip-name">{poi.name}</span>
          <span className="poi-pin__tooltip-category">{poi.category}</span>
        </div>
      )}
    </div>
  );
}