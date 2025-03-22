import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { loadTables, saveTables } from '../utils/tableUtils';

const STORAGE_KEY = 'randomTables';
const ROLL_HISTORY_KEY = 'rollHistory';

const DEFAULT_TABLE = {
  id: uuidv4(),
  name: 'Random Enemies',
  items: ['Goblin', 'Zombie', 'Bandit', 'Orc', 'Wolf']
};

export const useTableState = () => {
  // Initialize state with data from localStorage
  const [tables, setTables] = useState(() => {
    const storedTables = localStorage.getItem(STORAGE_KEY);
    if (!storedTables) {
      // First time loading the app, create default table
      const initialTables = [DEFAULT_TABLE];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTables));
      console.log('Initializing tables state with default table:', initialTables);
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

  // Save roll history to localStorage
  useEffect(() => {
    console.log('Saving roll history to localStorage:', rollHistory);
    localStorage.setItem(ROLL_HISTORY_KEY, JSON.stringify(rollHistory));
  }, [rollHistory]);

  const handleImport = (newTable) => {
    console.log('Importing table:', newTable);
    setTables(prev => {
      const newTables = [...prev, newTable];
      console.log('New tables state:', newTables);
      return newTables;
    });
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
    handleResetHistory
  };
};
