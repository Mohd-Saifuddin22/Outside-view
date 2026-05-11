import './HeroSection.css';

export function HeroSection({ onExplore }) {
  return (
    <section className="hero">
      <div className="hero__background">
        <img
          src="/assets/building.png"
          alt="Luxury Tower"
          className="hero__background-image"
        />
        <div className="hero__overlay" />
      </div>

      <div className="hero__content">
        <p className="hero__tagline">Experience the View Before It's Built</p>
        <h1 className="hero__title">
          Your Future Home
          <br />
          <span className="hero__title-accent">Awaits You</span>
        </h1>
        <p className="hero__subtitle">
          Explore breathtaking panoramic views from each floor.
          <br />
          Day and night. Every detail. Every horizon.
        </p>
        <button className="hero__cta" onClick={onExplore}>
          <span>Explore the View</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="hero__scroll-indicator">
        <span>Scroll to explore</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 5v14M5 12l7 7 7-7"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </div>
    </section>
  );
}
