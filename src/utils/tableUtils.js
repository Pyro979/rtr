import { v4 as uuidv4 } from 'uuid';

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

// Export tables to JSON
export const exportTablesToJson = (tables) => {
  try {
    // Create a copy of the tables to export, excluding IDs
    const tablesToExport = tables.map(table => ({
      name: table.name,
      items: table.items
    }));
    
    // Create a Blob with the JSON data
    const blob = new Blob([JSON.stringify(tablesToExport, null, 2)], { type: 'application/json' });
    
    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'random-tables.json';
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
    
    return { success: true };
  } catch (error) {
    console.error('Error exporting tables:', error);
    return { success: false, error: error.message };
  }
};

// Parse JSON file content for import
export const parseJsonTables = (jsonContent) => {
  try {
    // Parse the JSON content
    const parsedData = JSON.parse(jsonContent);
    
    // Ensure the parsed data is an array
    if (!Array.isArray(parsedData)) {
      throw new Error('JSON data must be an array of tables');
    }
    
    // Validate each table in the array
    const validatedTables = parsedData.map(table => {
      // Ensure required fields exist
      if (!table.name || !Array.isArray(table.items)) {
        throw new Error(`Invalid table format: ${JSON.stringify(table)}`);
      }
      
      // Return a validated table object
      return {
        id: table.id || uuidv4(), // Generate a new ID if none exists
        name: table.name.trim(),
        items: table.items.filter(item => typeof item === 'string' && item.trim() !== '')
      };
    });
    
    return { 
      success: true, 
      tables: validatedTables 
    };
  } catch (error) {
    console.error('Error parsing JSON tables:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Check for duplicate table names
export const findDuplicateTableNames = (existingTables, newTables) => {
  const duplicates = [];
  
  newTables.forEach(newTable => {
    const isDuplicate = existingTables.some(existingTable => 
      existingTable.name.trim() === newTable.name.trim()
    );
    
    if (isDuplicate) {
      duplicates.push(newTable.name);
    }
  });
  
  return duplicates;
};
