import { categories } from '../../data/pois';
import './CategoryFilterBar.css';

const categoryLabels = {
  all: 'All',
  transit: 'Transit',
  nature: 'Nature',
  shopping: 'Shopping',
  dining: 'Dining',
};

const categoryIcons = {
  all: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 0 1 0 20" />
    </svg>
  ),
  transit: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" />
    </svg>
  ),
  nature: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22V8M12 8C12 8 8 4 4 5c0 5 4 9 8 7M12 8c0 0 4-4 8-3 0 5-4 9-8 7" />
    </svg>
  ),
  shopping: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
    </svg>
  ),
  dining: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3" />
    </svg>
  ),
};

export function CategoryFilterBar({ activeCategories, onToggle }) {
  const isAllActive = activeCategories.includes('all');

  const handleToggle = (category) => {
    onToggle(category);
  };

  const handleAll = () => {
    onToggle('all');
  };

  return (
    <div className="category-filter-bar">
      {categories.map((category) => {
        const isActive = isAllActive || activeCategories.includes(category);
        return (
          <button
            key={category}
            className={`category-filter-bar__chip ${isActive ? 'active' : ''}`}
            onClick={() => (category === 'all' ? handleAll() : handleToggle(category))}
            data-category={category}
          >
            <span className="category-filter-bar__icon">{categoryIcons[category]}</span>
            <span className="category-filter-bar__label">{categoryLabels[category]}</span>
          </button>
        );
      })}
    </div>
  );
}