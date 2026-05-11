import { useEffect } from 'react';
import { HeroSection } from './HeroSection';
import { FloorCard } from './FloorCard';
import { Footer } from './Footer';
import { floors } from '../../data/floors';
import './LandingPage.css';

export function LandingPage({ onSelectFloor }) {
  // Scroll to floor section when CTA is clicked
  const handleExplore = () => {
    const section = document.getElementById('floor-selector');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page">
      <HeroSection onExplore={handleExplore} />

      <section id="floor-selector" className="floor-selector">
        <div className="floor-selector__header">
          <h2 className="floor-selector__title">Choose Your View</h2>
          <p className="floor-selector__subtitle">
            Select a floor to experience its unique perspective
          </p>
        </div>

        <div className="floor-selector__grid">
          {floors.map((floor, index) => (
            <div
              key={floor.id}
              className="floor-selector__card-wrapper"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <FloorCard
                floor={floor}
                thumbnail={floor.dayImage}
                onClick={onSelectFloor}
              />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}