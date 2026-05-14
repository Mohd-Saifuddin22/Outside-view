import { useEffect } from 'react';
import { floors } from '../../data/floors';
import './FloorPickerModal.css';

export function FloorPickerModal({ isOpen, onClose, onSelectFloor }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="floor-picker-overlay" onClick={onClose}>
      <div
        className="floor-picker-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="floor-picker-title"
      >
        <button className="floor-picker-close" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="floor-picker-header">
          <h2 id="floor-picker-title" className="floor-picker-title">Select Your Floor</h2>
          <p className="floor-picker-subtitle">Choose the view from your preferred height</p>
        </div>

        <div className="floor-picker-options">
          {floors.map((floor, index) => (
            <button
              key={floor.id}
              className="floor-option"
              style={{ animationDelay: `${index * 80}ms` }}
              onClick={() => onSelectFloor(floor)}
            >
              <span className="floor-option__number">{floor.id}th</span>
              <span className="floor-option__content">
                <span className="floor-option__name">{floor.name}</span>
                <span className="floor-option__tagline">{floor.tagline}</span>
              </span>
              <span className="floor-option__arrow">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          ))}
        </div>

        <div className="floor-picker-footer">
          <span className="floor-picker-hint">Click outside or press ESC to close</span>
        </div>
      </div>
    </div>
  );
}