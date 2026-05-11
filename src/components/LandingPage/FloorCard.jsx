import './FloorCard.css';

export function FloorCard({ floor, onClick, thumbnail }) {
  return (
    <button className="floor-card" onClick={() => onClick(floor)}>
      <div className="floor-card__image-container">
        <img
          src={thumbnail}
          alt={`${floor.name} view`}
          className="floor-card__image"
        />
        <div className="floor-card__image-overlay" />
      </div>
      <div className="floor-card__content">
        <span className="floor-card__label">Floor</span>
        <h3 className="floor-card__title">{floor.name}</h3>
        <p className="floor-card__tagline">{floor.tagline}</p>
      </div>
      <div className="floor-card__arrow">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}