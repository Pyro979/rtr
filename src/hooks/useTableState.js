import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { loadTables, saveTables } from '../utils/tableUtils';

const STORAGE_KEY = 'randomTables';

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
      return initialTables;
    }
    return JSON.parse(storedTables);
  });
  const [rollStyle, setRollStyle] = useState('normal');
  const [rollHistory, setRollHistory] = useState({});

  // Save to localStorage whenever tables change
  useEffect(() => {
    console.log('Saving tables to localStorage:', tables);
    saveTables(tables);
  }, [tables]);

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
  };

  const handleRoll = (tableId, index, result) => {
    console.log('Roll result:', { tableId, index, result });
    setRollHistory(prev => ({
      ...prev,
      [tableId]: {
        ...prev[tableId],
        [index]: ((prev[tableId] || {})[index] || 0) + 1,
        lastResult: result
      }
    }));
  };

  const handleResetHistory = () => {
    console.log('Resetting roll history');
    setRollHistory({});
  };

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
