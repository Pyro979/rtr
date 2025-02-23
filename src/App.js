import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, Navigate, Link } from 'react-router-dom';
import './App.css';
import ImportMode from './components/ImportMode';
import EditMode from './components/EditMode';
import RollMode from './components/RollMode';
import Home from './components/Home';
import Sidebar from './components/Sidebar';
import { loadTables, saveTables } from './utils/tableUtils';

// Wrapper component for table-specific routes
const TableRoute = ({ tables, onUpdateTable, onDeleteTable, onRoll, onResetHistory, rollStyle, rollHistory }) => {
  const { tableId } = useParams();
  const table = tables.find(t => t.id === tableId);
  
  if (!table) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <div className="table-header">
        <h2>{table.name}</h2>
        <div className="table-actions">
          <Link to={`/table/${tableId}/edit`} className="button">Edit</Link>
          <Link to={`/table/${tableId}/roll`} className="button">Roll</Link>
        </div>
      </div>
      <Routes>
        <Route 
          path="roll" 
          element={
            <RollMode
              table={table}
              rollStyle={rollStyle}
              rollHistory={rollHistory}
              onRoll={onRoll}
              onResetHistory={onResetHistory}
            />
          }
        />
        <Route 
          path="edit" 
          element={
            <EditMode
              table={table}
              onUpdate={onUpdateTable}
              onDelete={onDeleteTable}
            />
          }
        />
        <Route path="*" element={<Navigate to="roll" replace />} />
      </Routes>
    </>
  );
};

const App = () => {
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

  const handleRoll = (tableId, index, result, newStyle) => {
    if (newStyle) {
      setRollStyle(newStyle);
      return;
    }

    if (index !== null) {
      setRollHistory(prev => ({
        ...prev,
        [tableId]: { 
          ...(prev[tableId] || {}), 
          [index]: ((prev[tableId] || {})[index] || 0) + 1 
        },
        lastResult: result
      }));
    }
  };

  const handleResetHistory = (tableId) => {
    setRollHistory(prev => ({ 
      ...prev, 
      [tableId]: {},
      lastResult: null
    }));
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Sidebar tables={tables} />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/import" 
              element={<ImportMode onImport={handleImport} />} 
            />
            <Route 
              path="/table/:tableId/*" 
              element={
                <TableRoute
                  tables={tables}
                  onUpdateTable={handleUpdateTable}
                  onDeleteTable={handleDeleteTable}
                  onRoll={handleRoll}
                  onResetHistory={handleResetHistory}
                  rollStyle={rollStyle}
                  rollHistory={rollHistory}
                />
              } 
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
