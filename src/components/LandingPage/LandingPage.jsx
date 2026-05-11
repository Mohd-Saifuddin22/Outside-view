import { HeroSection } from './HeroSection';
import './LandingPage.css';

export function LandingPage({ onExplore }) {
  return (
    <div className="landing-page">
      <HeroSection onExplore={onExplore} />
    </div>
  );
}