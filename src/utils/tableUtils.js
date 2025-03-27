// Clean up text input into table items
export const parseTableItems = (text, options = {}) => {
  const {
    removeLeadingNumbers = true,
    removeBulletPoints = true,
    removeDuplicates = false,
    removeHeader = false
  } = options;

  let lines = text.split('\n');

  // Store header information if available
  let header = null;
  if (lines.length > 0) {
    header = lines[0].trim();
  }

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

  // Count duplicates before removing them
  const uniqueItems = [...new Set(items)];
  const duplicateCount = items.length - uniqueItems.length;
  if (removeDuplicates) {
    items = uniqueItems;
  }

  return {
    items,
    duplicateCount,
    header
  };
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

// Parse and roll dice notation in text (e.g., "1d6", "2d8+3")
export const parseDiceNotation = (text) => {
  // Regular expression to match dice notation patterns
  // Matches patterns like 1d6, 2d8+3, 1d20-2, etc.
  const diceRegex = /(\d+)d(\d+)(?:([-+])(\d+))?/g;

  let match;
  let hasMatches = false;

  // Create a copy of the text to modify
  let modifiedText = text;

  // Find all dice notations in the text
  while ((match = diceRegex.exec(text)) !== null) {
    hasMatches = true;

    // Extract dice components
    const [fullMatch, numDice, diceSize, operator, modifier] = match;

    // Roll the dice
    let total = 0;
    for (let i = 0; i < parseInt(numDice, 10); i++) {
      total += Math.floor(Math.random() * parseInt(diceSize, 10)) + 1;
    }

    // Apply modifier if present
    if (operator && modifier) {
      const modValue = parseInt(modifier, 10);
      total = operator === '+' ? total + modValue : total - modValue;
      // Ensure the result is at least 1
      total = Math.max(1, total);
    }

    // Replace the dice notation with the result using plain text
    modifiedText = modifiedText.replace(
      fullMatch,
      `${fullMatch} = ${total}`
    );
  }

  return {
    text: modifiedText,
    hasMatches
  };
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
    removeDuplicates: true,
    removeHeader: false
  };
};

export const saveImportPreferences = (preferences) => {
  localStorage.setItem('importPreferences', JSON.stringify(preferences));
};
