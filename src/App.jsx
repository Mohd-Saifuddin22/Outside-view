import { useState, useMemo } from 'react';
import { LandingPage } from './components/LandingPage/LandingPage';
import { FloorViewer } from './components/FloorViewer/FloorViewer';
import { useImagePreloader } from './hooks/useImagePreloader';
import { floors } from './data/floors';
import './App.css';

function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'viewer'
  const [selectedFloor, setSelectedFloor] = useState(null);

  // Collect all image paths for preloading
  const allImagePaths = useMemo(() => {
    return floors.flatMap((floor) => [floor.dayImage, floor.nightImage]);
  }, []);

  // Preload all images
  const { progress } = useImagePreloader(allImagePaths);

  const handleSelectFloor = (floor) => {
    setSelectedFloor(floor);
    setView('viewer');
  };

  const handleBack = () => {
    setView('landing');
  };

  if (view === 'viewer' && selectedFloor) {
    return <FloorViewer floor={selectedFloor} onBack={handleBack} />;
  }

  return <LandingPage onSelectFloor={handleSelectFloor} />;
}

export default App;