import { useState, useMemo } from 'react';
import { LandingPage } from './components/LandingPage/LandingPage';
import { ProjectsPage } from './components/ProjectsPage/ProjectsPage';
import { FloorViewer } from './components/FloorViewer/FloorViewer';
import { FloorPickerModal } from './components/FloorPickerModal/FloorPickerModal';
import { useImagePreloader } from './hooks/useImagePreloader';
import { floors } from './data/floors';
import './App.css';

function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'projects' | 'viewer'
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [showFloorPicker, setShowFloorPicker] = useState(false);

  // Collect all image paths for preloading
  const allImagePaths = useMemo(() => {
    return floors.flatMap((floor) => [floor.dayImage, floor.nightImage]);
  }, []);

  // Preload all images
  useImagePreloader(allImagePaths);

  const handleExplore = () => {
    setView('projects');
  };

  const handleSelectProject = (project) => {
    if (project.isReal) {
      setShowFloorPicker(true);
    }
  };

  const handleFloorSelect = (floor) => {
    setShowFloorPicker(false);
    setSelectedFloor(floor);
    setView('viewer');
  };

  const handleFloorPickerClose = () => {
    setShowFloorPicker(false);
  };

  const handleBackToLanding = () => {
    setView('landing');
  };

  const handleBackToProjects = () => {
    setView('projects');
  };

  const getView = () => {
    if (view === 'viewer' && selectedFloor) {
      return <FloorViewer floor={selectedFloor} onBack={handleBackToProjects} />;
    }

    if (view === 'projects') {
      return (
        <ProjectsPage
          onSelectProject={handleSelectProject}
          onBack={handleBackToLanding}
        />
      );
    }

    return <LandingPage onExplore={handleExplore} />;
  };

  return (
    <>
      {getView()}
      {showFloorPicker && (
        <FloorPickerModal
          isOpen={showFloorPicker}
          onClose={handleFloorPickerClose}
          onSelectFloor={handleFloorSelect}
        />
      )}
    </>
  );
}

export default App;