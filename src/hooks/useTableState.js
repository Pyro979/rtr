import { useState, useEffect } from 'react';
import { loadTables, saveTables } from '../utils/tableUtils';

export const useTableState = () => {
  // Initialize state with data from localStorage
  const [tables, setTables] = useState(() => loadTables());
  const [rollStyle, setRollStyle] = useState('normal');
  const [rollHistory, setRollHistory] = useState({});

  // Save to localStorage whenever tables change
  useEffect(() => {
    saveTables(tables);
  }, [tables]);

  const handleImport = (newTable) => {
    setTables([...tables, newTable]);
  };

  const handleUpdateTable = (updatedTable) => {
    setTables(tables.map(t => t.id === updatedTable.id ? updatedTable : t));
  };

  const handleDeleteTable = (tableId) => {
    setTables(tables.filter(t => t.id !== tableId));
  };

  const handleRoll = (result) => {
    setRollHistory(result);
  };

  const handleResetHistory = () => {
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
