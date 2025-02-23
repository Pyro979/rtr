import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, Navigate } from 'react-router-dom';
import './App.css';
import ImportMode from './components/ImportMode';
import EditMode from './components/EditMode';
import RollMode from './components/RollMode';
import Home from './components/Home';
import IconButton from './components/IconButton';
import { loadTables, saveTables } from './utils/tableUtils';
import { TEXT } from './constants/text';

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
          path="edit" 
          element={
            <EditMode
              table={table}
              onUpdate={onUpdateTable}
              onDelete={onDeleteTable}
            />
          }
        />
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
        <Route path="*" element={<Navigate to="roll" replace />} />
      </Routes>
    </>
  );
};

function App() {
  const [tables, setTables] = useState([]);
  const [rollStyle, setRollStyle] = useState('normal');
  const [rollHistory, setRollHistory] = useState({});

  useEffect(() => {
    setTables(loadTables());
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
        <div className="sidebar">
          <Link to="/" className="sidebar-header">
            <h2>{TEXT.sidebar.title}</h2>
          </Link>
          <IconButton to="/import" text={TEXT.sidebar.importButton} />
          <ul className="table-list">
            {tables.map(table => (
              <li key={table.id}>
                <Link 
                  to={`/table/${table.id}/roll`}
                  className="table-item"
                >
                  <div className="table-info">
                    <span className="table-name">{table.name}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="main-content">
          <Routes>
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
            <Route path="/" element={<Home />} />
            <Route path="/" element={<div className="welcome">Select a table or import a new one to begin</div>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
