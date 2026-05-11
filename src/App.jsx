import { useState, useMemo } from 'react';
import { LandingPage } from './components/LandingPage/LandingPage';
import { ProjectsPage } from './components/ProjectsPage/ProjectsPage';
import { FloorViewer } from './components/FloorViewer/FloorViewer';
import { useImagePreloader } from './hooks/useImagePreloader';
import { floors } from './data/floors';
import './App.css';

function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'projects' | 'viewer'
  const [selectedFloor, setSelectedFloor] = useState(null);

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
    // For the real project, go to floor viewer
    // For demo purposes, all projects lead to floor viewer with default floor
    if (project.isReal) {
      setSelectedFloor(floors[0]);
      setView('viewer');
    }
  };

  const handleBackToLanding = () => {
    setView('landing');
  };

  const handleBackToProjects = () => {
    setView('projects');
  };

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
}

export default App;