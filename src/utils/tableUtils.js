// Clean up text input into table items
export const parseTableItems = (text, options = {}) => {
  const {
    removeLeadingNumbers = true,
    removeBulletPoints = true,
    removeDuplicates = false,
    removeHeader = false
  } = options;

  let lines = text.split('\n');
  
  // Remove header (first line) if enabled
  if (removeHeader && lines.length > 0) {
    lines = lines.slice(1);
  }

  let items = lines
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (removeLeadingNumbers || removeBulletPoints) {
    items = items.map(line => {
      let cleaned = line;
      if (removeLeadingNumbers) {
        // Remove leading numbers with dots, parentheses, or just spaces
        cleaned = cleaned.replace(/^\d+[\s.)]?\s*/, '');
      }
      if (removeBulletPoints) {
        // Remove bullet points, dashes, and asterisks
        cleaned = cleaned.replace(/^[-*•]\s*/, '');
      }
      return cleaned;
    });
  }

  if (removeDuplicates) {
    items = [...new Set(items)];
  }

  return items;
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

  console.log('Rolling on table:', { 
    style, 
    index, 
    result: table.items[index],
    history
  });

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

export const loadImportPreferences = () => {
  const stored = localStorage.getItem('importPreferences');
  return stored ? JSON.parse(stored) : {
    removeLeadingNumbers: true,
    removeBulletPoints: true,
    removeDuplicates: false,
    removeHeader: false
  };
};

export const saveImportPreferences = (preferences) => {
  localStorage.setItem('importPreferences', JSON.stringify(preferences));
};
