import { useState, useEffect } from 'react';
import { loadTables, saveTables } from '../utils/tableUtils';

export const useTableState = () => {
  const [tables, setTables] = useState([]);
  const [rollStyle, setRollStyle] = useState('normal');
  const [rollHistory, setRollHistory] = useState({});

  useEffect(() => {
    const savedTables = loadTables();
    if (savedTables) {
      setTables(savedTables);
    }
  }, []);

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
