export const categories = ['all', 'transit', 'nature', 'shopping', 'dining'];

export const pois = [
  {
    id: 'metro-station',
    name: 'Metro Station',
    category: 'transit',
    x: 25,  // % from left of image
    y: 40,  // % from top of image
    visibleFromFloor: 1,
    visibleToFloor: 10,
  },
  {
    id: 'central-park',
    name: 'Central Park',
    category: 'nature',
    x: 60,
    y: 30,
    visibleFromFloor: 3,
    visibleToFloor: 10,
  },
  {
    id: 'shopping-mall',
    name: 'Luxury Mall',
    category: 'shopping',
    x: 45,
    y: 55,
    visibleFromFloor: 1,
    visibleToFloor: 8,
  },
  {
    id: 'fine-dining',
    name: 'Fine Dining Restaurant',
    category: 'dining',
    x: 75,
    y: 45,
    visibleFromFloor: 1,
    visibleToFloor: 10,
  },
  {
    id: 'bus-stop',
    name: 'Bus Terminal',
    category: 'transit',
    x: 15,
    y: 60,
    visibleFromFloor: 1,
    visibleToFloor: 6,
  },
  {
    id: 'garden',
    name: 'Rooftop Garden',
    category: 'nature',
    x: 80,
    y: 25,
    visibleFromFloor: 5,
    visibleToFloor: 10,
  },
];