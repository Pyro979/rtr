import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { loadTables, saveTables } from '../utils/tableUtils';

const STORAGE_KEY = 'randomTables';
const ROLL_HISTORY_KEY = 'rollHistory';

const DEFAULT_ENEMIES_TABLE = {
  id: uuidv4(),
  name: 'Defaults\\Random Enemies [enemy][default]',
  items: [
    'Goblin', '1d4 Zombies', 'Bandit', '1d6+1 Orcs', '1d4+1 Wolf', '1d3 Nothic', 'Dragon', 'Troll', 'Giant', 'Gargoyle',
    'Skeleton', '1d3 Gnolls', 'Kobold', 'Wraith', 'Mimic', 'Hobgoblin', '1d2 Banshees', 'Lich', '1d3+2 Ogres', 'Bugbear',
    'Harpy', 'Vampire Spawn', '2d6 Shadow (RIP 💀)', 'Specter', 'Mind Flayer', 'Beholder', '1d4-1 Werewolves', 'Medusa', 'Yuan-ti', 'Ghoul'
  ]
};

const DEFAULT_TREASURE_TABLE = {
  id: uuidv4(),
  name: 'Defaults\\Random Treasure [treasure][default]',
  items: [
    '1d100+50 Gold coins', 
    '1d20 Silver coins', 
    '1d6 Gemstones worth 50gp each', 
    'Small jade figurine (75gp)', 
    'Potion of Healing', 
    '1d4 Potions of Minor Healing', 
    'Scroll of Identify', 
    'Masterwork dagger', 
    '1d3 Pieces of fine jewelry', 
    'Ancient coin collection',
    'Ornate silver mirror (120gp)', 
    'Bag of 1d10 semi-precious gems', 
    '+1 Longsword', 
    'Wand of Magic Missiles (1d6+1 charges)', 
    'Ring of Protection', 
    'Boots of Elvenkind', 
    'Cloak of Resistance', 
    '2d6×10 Platinum coins', 
    'Cursed scroll (save or 1d4 damage)', 
    'Golden chalice with ruby inlays',
    'Spell component pouch', 
    'Treasure map to hidden cache', 
    'Enchanted quill that never runs out of ink', 
    'Ivory dice set with gold inlay', 
    'Bag of holding (small)', 
    'Bracers of Archery', 
    'Elemental gem', 
    'Philter of Love', 
    'Dust of Dryness (1d4 pellets)', 
    'Immovable Rod'
  ]
};

const DEFAULT_WEATHER_TABLE = {
  id: uuidv4(),
  name: 'Defaults\\Random Weather [env][default]',
  items: [
    'Clear skies and mild temperature', 
    'Overcast with light breeze', 
    'Heavy rain for 1d4 hours', 
    'Dense fog until midday', 
    'Scorching heat (disadvantage on Constitution saves)', 
    'Light drizzle throughout the day', 
    'Thunderstorm with lightning strikes', 
    'Strong winds (difficult terrain for small creatures)', 
    'Bitter cold (Constitution save or 1d4 cold damage)', 
    'Hailstorm for 1d2 hours',
    'Unusually humid and muggy', 
    'Perfect weather, not a cloud in sight', 
    'Torrential downpour with flooding', 
    'Dust storm reducing visibility', 
    'Unnaturally still air, complete silence', 
    'Gentle snowfall (1d3 inches)', 
    'Blizzard conditions (heavily obscured)', 
    'Ash falling from distant wildfire', 
    'Thick mist with strange echoes', 
    'Double rainbow after brief shower',
    'Sweltering heat with no breeze', 
    'Sudden temperature drop as night approaches', 
    'Intermittent rain showers', 
    'Howling winds from the north', 
    'Morning frost covering everything', 
    'Oppressive heat with distant thunder', 
    'Gentle rain with occasional sunbreaks', 
    'Ominous dark clouds but no precipitation', 
    'Unseasonably warm and pleasant', 
    'Eerie calm before a storm'
  ]
};

export const useTableState = () => {
  // Initialize state with data from localStorage
  const [tables, setTables] = useState(() => {
    const storedTables = localStorage.getItem(STORAGE_KEY);
    if (!storedTables) {
      // First time loading the app, create default tables
      const initialTables = [DEFAULT_ENEMIES_TABLE, DEFAULT_TREASURE_TABLE, DEFAULT_WEATHER_TABLE];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTables));
      console.log('Initializing tables state with default tables:', initialTables);
      return initialTables;
    }
    console.log('Initializing tables state from localStorage:', storedTables);
    return JSON.parse(storedTables);
  });
  
  const [rollStyle, setRollStyle] = useState('normal');
  
  // Initialize roll history from localStorage
  const [rollHistory, setRollHistory] = useState(() => {
    const storedHistory = localStorage.getItem(ROLL_HISTORY_KEY);
    if (storedHistory) {
      console.log('Initializing roll history from localStorage:', storedHistory);
      return JSON.parse(storedHistory);
    }
    console.log('Initializing empty roll history');
    return {};
  });

  // Save to localStorage whenever tables change
  useEffect(() => {
    console.log('Saving tables to localStorage:', tables);
    saveTables(tables);
  }, [tables]);
  
  // Save roll history to localStorage whenever it changes
  useEffect(() => {
    console.log('Saving roll history to localStorage:', rollHistory);
    localStorage.setItem(ROLL_HISTORY_KEY, JSON.stringify(rollHistory));
  }, [rollHistory]);

  const handleImport = (newTable) => {
    console.log('Importing table:', newTable);
    
    // Create a completely new array to ensure React detects the change
    const updatedTables = [...tables, newTable];
    
    // Force an update by setting state with the new array
    setTables(updatedTables);
    
    // Also update localStorage directly to ensure immediate persistence
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTables));
    
    console.log('New tables state after import:', updatedTables);
    
    // Return the new table ID for potential use by the caller
    return newTable.id;
  };

  const handleUpdateTable = (updatedTable) => {
    console.log('Updating table:', updatedTable);
    setTables(prev => prev.map(table => 
      table.id === updatedTable.id ? updatedTable : table
    ));
  };

  const handleDeleteTable = (tableId) => {
    console.log('Deleting table with id:', tableId);
    setTables(prev => prev.filter(t => t.id !== tableId));
    
    // Also clear roll history for deleted table
    setRollHistory(prev => {
      const newHistory = { ...prev };
      delete newHistory[tableId];
      return newHistory;
    });
  };

  const handleRoll = (tableId, index, result, style) => {
    console.log('handleRoll called with:', { tableId, index, result, style });
    if (!tableId) {
      // Only update roll style if no result is provided
      if (style && style !== rollStyle) {
        console.log('Updating roll style to:', style);
        setRollStyle(style);
      }
      return;
    }

    setRollHistory(prev => {
      console.log('Previous roll history:', prev);
      
      // Create a new history object with updated values
      const newHistory = {
        ...prev,
        [tableId]: {
          result,
          style: style || prev[tableId]?.style || 'normal',
          counts: {
            ...(prev[tableId]?.counts || {}),
            [index]: ((prev[tableId]?.counts || {})[index] || 0) + 1
          }
        }
      };
      
      console.log('New roll history:', newHistory);
      console.log('Roll history updated for table:', tableId);
      return newHistory;
    });
  };

  const handleResetHistory = (tableId) => {
    console.log('Resetting roll history for table:', tableId);
    if (!tableId) return;
    
    setRollHistory(prev => {
      const newHistory = {
        ...prev,
        [tableId]: { 
          style: prev[tableId]?.style || 'normal',
          counts: {}
        }
      };
      console.log('Roll history after reset:', newHistory);
      return newHistory;
    });
    console.log('Roll history reset for table:', tableId);
  };

  const handleResetAllHistory = () => {
    console.log('Resetting all roll history and tables');
    
    // Clear all roll history
    setRollHistory({});
    
    // Reset tables to just the default tables
    setTables([{
      ...DEFAULT_ENEMIES_TABLE,
      id: uuidv4() // Generate a new ID for the default table
    }, {
      ...DEFAULT_TREASURE_TABLE,
      id: uuidv4() // Generate a new ID for the default table
    }, {
      ...DEFAULT_WEATHER_TABLE,
      id: uuidv4() // Generate a new ID for the default table
    }]);
    
    // Remove from localStorage
    localStorage.removeItem(ROLL_HISTORY_KEY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{
      ...DEFAULT_ENEMIES_TABLE,
      id: uuidv4() // Generate a new ID for the default table
    }, {
      ...DEFAULT_TREASURE_TABLE,
      id: uuidv4() // Generate a new ID for the default table
    }, {
      ...DEFAULT_WEATHER_TABLE,
      id: uuidv4() // Generate a new ID for the default table
    }]));
  };

  // Log rollHistory changes
  useEffect(() => {
    console.log('Roll history updated:', rollHistory);
    console.log('Current roll history state:', rollHistory);
  }, [rollHistory]);

  return {
    tables,
    rollStyle,
    rollHistory,
    handleImport,
    handleUpdateTable,
    handleDeleteTable,
    handleRoll,
    handleResetHistory,
    handleResetAllHistory
  };
};
