import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { loadTables, saveTables } from '../utils/tableUtils';

const STORAGE_KEY = 'randomTables';
const ROLL_HISTORY_KEY = 'rollHistory';
const TABLE_MODES_KEY = 'tableModes';
const CONDENSE_OPTIONS_KEY = 'condenseOptions';

const DEFAULT_ENEMIES_TABLE = {
  id: uuidv4(),
  name: 'Defaults\\Random Enemies [enemy] #default',
  items: [
    'Goblin', '1d4 Zombies', 'Bandit', '1d6+1 Orcs', '1d4+1 Wolf', '1d3 Nothic', 'Dragon', 'Troll', 'Giant', 'Gargoyle',
    'Skeleton', '1d3 Gnolls', 'Kobold', 'Wraith', 'Mimic', 'Hobgoblin', '1d2 Banshees', 'Lich', '1d3+2 Ogres', 'Bugbear',
    'Harpy', 'Vampire Spawn', '2d6 Shadow (RIP 💀)', 'Specter', 'Mind Flayer', 'Beholder', '1d4-1 Werewolves', 'Medusa', 'Yuan-ti', 'Ghoul'
  ]
};

const DEFAULT_TREASURE_TABLE = {
  id: uuidv4(),
  name: 'Defaults\\Random Treasure [treasure] #default',
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
  name: 'Defaults\\Random Weather [env] #default',
  items: [
    'Clear skies and mild temperature', 
    'Clear skies and mild temperature', 
    'Clear skies and mild temperature', 
    'Clear skies and mild temperature', 
    'Clear skies and mild temperature', 
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

const DEFAULT_TAVERN_TABLE = {
  id: uuidv4(),
  name: 'Defaults\\Random Tavern [tavern] #default',
  items: [
    'The Red Griffin Inn', 
    'The Drunken Dragon', 
    'The Rusty Goblet', 
    'The Black Boar Tavern', 
    'The Silver Stag Inn', 
    'The Green Griffin Tavern', 
    'The Blue Moon Inn', 
    'The Golden Griffin Tavern', 
    'The White Horse Inn', 
    'The King\'s Head Tavern', 
    'The Queen\'s Rest Inn', 
    'The Traveler\'s Rest', 
    'The Wanderer\'s Inn', 
    'The Adventurer\'s Guild Tavern', 
    'The Mages\' Tower Tavern', 
    'The Thieves\' Guild Tavern', 
    'The City Guard Tavern', 
    'The Merchant\'s Guild Tavern', 
    'The Harbor Master\'s Tavern', 
    'The Lighthouse Inn'
  ]
};

const DEFAULT_NPC_TABLE = {
  id: uuidv4(),
  name: 'Defaults\\Random NPC [npc] #default',
  items: [
    'Human Fighter', 
    'Dwarf Cleric', 
    'Elf Ranger', 
    'Halfling Rogue', 
    'Dragonborn Barbarian', 
    'Tiefling Warlock', 
    'Gnome Bard', 
    'Half-Elf Paladin', 
    'Half-Orc Monk', 
    'Goliath Druid', 
    'Aarakocra Sorcerer', 
    'Genasi Wizard', 
    'Kobold', 
    'Gnoll', 
    'Orc', 
    'Goblin', 
    'Hobgoblin', 
    'Bugbear', 
    'Kobold Inventor', 
    'Gnoll Pack Lord', 
    'Orc Warlord'
  ]
};

export const useTableState = () => {
  // Initialize state with data from localStorage
  const [tables, setTables] = useState(() => {
    const storedTables = localStorage.getItem(STORAGE_KEY);
    if (!storedTables) {
      // First time loading the app, create default tables
      const initialTables = [DEFAULT_ENEMIES_TABLE, DEFAULT_TREASURE_TABLE, DEFAULT_WEATHER_TABLE, DEFAULT_TAVERN_TABLE, DEFAULT_NPC_TABLE];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTables));
      console.log('Initializing tables state with default tables:', initialTables);
      return initialTables;
    }
    console.log('Initializing tables state from localStorage:', storedTables);
    return JSON.parse(storedTables);
  });
  
  // Initialize roll style from localStorage
  const [rollStyle, setRollStyle] = useState(() => {
    const storedHistory = localStorage.getItem(ROLL_HISTORY_KEY);
    if (storedHistory) {
      const history = JSON.parse(storedHistory);
      // Look for the most recently used style in any table's history
      for (const tableId in history) {
        if (history[tableId] && history[tableId].style) {
          console.log('Initializing roll style from history:', history[tableId].style);
          return history[tableId].style;
        }
      }
    }
    console.log('Initializing default roll style: normal');
    return 'normal';
  });
  
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
  
  // Initialize table modes from localStorage
  const [tableModes, setTableModes] = useState(() => {
    const storedModes = localStorage.getItem(TABLE_MODES_KEY);
    if (storedModes) {
      console.log('Initializing table modes from localStorage:', storedModes);
      return JSON.parse(storedModes);
    }
    console.log('Initializing empty table modes');
    return {};
  });

  // Initialize condense options from localStorage
  const [condenseOptions, setCondenseOptions] = useState(() => {
    const storedOptions = localStorage.getItem(CONDENSE_OPTIONS_KEY);
    if (storedOptions) {
      console.log('Initializing condense options from localStorage:', storedOptions);
      return JSON.parse(storedOptions);
    }
    console.log('Initializing default condense options');
    return {}; // Default is empty object, will be populated per table
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
  
  // Save table modes to localStorage whenever they change
  useEffect(() => {
    console.log('Saving table modes to localStorage:', tableModes);
    localStorage.setItem(TABLE_MODES_KEY, JSON.stringify(tableModes));
  }, [tableModes]);

  // Save condense options to localStorage whenever they change
  useEffect(() => {
    console.log('Saving condense options to localStorage:', condenseOptions);
    localStorage.setItem(CONDENSE_OPTIONS_KEY, JSON.stringify(condenseOptions));
  }, [condenseOptions]);

  const handleImport = (newTable) => {
    console.log('Importing table:', newTable);
    
    // Get the latest tables from localStorage to ensure we have the most up-to-date list
    const currentTables = loadTables();
    
    // Create a completely new array to ensure React detects the change
    const updatedTables = [...currentTables, newTable];
    
    // Force an update by setting state with the new array
    setTables(updatedTables);
    
    // Also update localStorage directly to ensure immediate persistence
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTables));
    
    console.log('New tables state after import:', updatedTables);
    
    // Return the new table ID for potential use by the caller
    return newTable.id;
  };

  // Handle bulk import of multiple tables at once
  const handleBulkImport = (newTables, overrideOptions = {}) => {
    if (!newTables || newTables.length === 0) {
      return 0;
    }
    
    console.log(`Bulk importing ${newTables.length} tables`);
    
    // Get the current tables from localStorage to ensure we have the latest state
    const currentTables = loadTables();
    
    // Filter out duplicates within the imported file itself
    // Keep only the first occurrence of each table name
    const uniqueNewTables = [];
    const importedNames = new Set();
    
    newTables.forEach(table => {
      if (!importedNames.has(table.name)) {
        uniqueNewTables.push(table);
        importedNames.add(table.name);
      } else {
        console.log(`Skipping duplicate table in import file: ${table.name}`);
      }
    });
    
    // Process each table, checking for duplicates with existing tables
    const tablesToAdd = [];
    
    uniqueNewTables.forEach(newTable => {
      // Check if this table name already exists
      const existingTableIndex = currentTables.findIndex(t => t.name === newTable.name);
      
      if (existingTableIndex >= 0) {
        // If this table should override an existing one
        if (overrideOptions[newTable.id]) {
          console.log(`Overriding existing table: ${newTable.name}`);
          // Replace the existing table with the new one (keeping the original ID)
          currentTables[existingTableIndex] = {
            ...newTable,
            id: currentTables[existingTableIndex].id // Keep the original ID
          };
        } else {
          console.log(`Skipping table with duplicate name: ${newTable.name}`);
        }
      } else {
        // This is a new table, add it to the list
        tablesToAdd.push(newTable);
      }
    });
    
    // Create the final updated tables array
    const updatedTables = [...currentTables, ...tablesToAdd];
    
    // Update state
    setTables(updatedTables);
    
    // Update localStorage directly
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTables));
    
    const addedCount = tablesToAdd.length;
    const overriddenCount = Object.values(overrideOptions).filter(Boolean).length;
    const totalImported = addedCount + overriddenCount;
    
    console.log(`Successfully imported ${totalImported} tables (${addedCount} new, ${overriddenCount} overwritten). New total: ${updatedTables.length}`);
    
    // Return the number of tables imported
    return totalImported;
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
    
    // Update global roll style if provided
    if (style && style !== rollStyle) {
      console.log('Updating global roll style to:', style);
      setRollStyle(style);
      
      // If no tableId is provided, just update the style and return
      if (!tableId) {
        return;
      }
    }

    setRollHistory(prev => {
      console.log('Previous roll history:', prev);
      
      // Get the table we're rolling on to get the actual result text
      const tableToRoll = tables.find(t => t.id === tableId);
      const resultText = index !== undefined && tableToRoll && tableToRoll.items && tableToRoll.items[index] 
        ? tableToRoll.items[index] 
        : result;
      
      // Create a new history object with updated values
      const newHistory = {
        ...prev,
        [tableId]: {
          ...(prev[tableId] || {}),  // Preserve existing table history
          result: resultText,  // Save the actual result text
          style: style || prev[tableId]?.style || rollStyle,  // Use provided style, or existing style, or global style
          counts: index !== undefined ? {
            ...(prev[tableId]?.counts || {}),
            [index]: ((prev[tableId]?.counts || {})[index] || 0) + 1
          } : prev[tableId]?.counts || {},
          rolledIndex: index !== undefined ? index : prev[tableId]?.rolledIndex
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
    
    // Clear all state
    setRollHistory({});
    setCondenseOptions({});
    setTableModes({});
    
    // Clear all localStorage keys
    localStorage.removeItem(ROLL_HISTORY_KEY);
    localStorage.removeItem(CONDENSE_OPTIONS_KEY);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TABLE_MODES_KEY);
    localStorage.removeItem('importPreferences');
    localStorage.removeItem('folderState');
    
    // Restore default tables
    const defaultTables = [
      DEFAULT_ENEMIES_TABLE,
      DEFAULT_TREASURE_TABLE,
      DEFAULT_WEATHER_TABLE,
      DEFAULT_TAVERN_TABLE,
      DEFAULT_NPC_TABLE
    ];
    
    // Set the default tables in state
    setTables(defaultTables);
    
    // Save default tables to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTables));
    
    console.log('All data reset and default tables restored');
  };

  // Function to update the mode for a specific table
  const handleUpdateTableMode = (tableId, mode) => {
    if (!tableId) return;
    
    console.log(`Updating mode for table ${tableId} to ${mode}`);
    setTableModes(prev => {
      const newModes = {
        ...prev,
        [tableId]: mode
      };
      return newModes;
    });
  };

  // Function to toggle condense option for a specific table
  const handleToggleCondenseOption = (tableId, isCondensed) => {
    if (!tableId) return;
    
    console.log(`Updating condense option for table ${tableId} to ${isCondensed}`);
    setCondenseOptions(prev => {
      const newOptions = {
        ...prev,
        [tableId]: isCondensed
      };
      return newOptions;
    });
  };

  return {
    tables,
    rollStyle,
    rollHistory,
    tableModes,
    condenseOptions,
    handleImport,
    handleBulkImport,
    handleUpdateTable,
    handleDeleteTable,
    handleRoll,
    handleResetHistory,
    handleResetAllHistory,
    handleUpdateTableMode,
    handleToggleCondenseOption
  };
};
