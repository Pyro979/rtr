// Clean up text input into table items
export const parseTableItems = (text) => {
  return text
    .split('\n')
    .map(line => line.trim())
    .map(line => line.replace(/^[-*\d.)\s]+/, '')) // Remove bullets, numbers, etc.
    .filter(line => line.length > 0);
};

// Roll on a table with different styles
export const rollOnTable = (table, style, history = {}) => {
  if (!table || !table.items.length) return null;

  let index;
  if (style === 'normal') {
    index = Math.floor(Math.random() * table.items.length);
  } else {
    const weights = table.items.map((_, i) => {
      const timesRolled = history[i] || 0;
      return style === 'weighted' ? 1 / (timesRolled + 1) : (timesRolled ? 0 : 1);
    });

    if (weights.every(w => w === 0)) {
      return null; // Signal that we need to reset history
    }

    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    index = weights.findIndex(weight => {
      random -= weight;
      return random <= 0;
    });
  }

  return { index, result: table.items[index] };
};

// Local storage functions
export const loadTables = () => {
  const stored = localStorage.getItem('randomTables');
  return stored ? JSON.parse(stored) : [];
};

export const saveTables = (tables) => {
  localStorage.setItem('randomTables', JSON.stringify(tables));
};
