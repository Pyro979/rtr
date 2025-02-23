import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import ImportMode from './components/ImportMode';
import Home from './components/Home';
import Sidebar from './components/Sidebar';
import TableRoute from './routes/TableRoute';
import { useTableState } from './hooks/useTableState';

const App = () => {
  const {
    tables,
    rollStyle,
    rollHistory,
    handleImport,
    handleUpdateTable,
    handleDeleteTable,
    handleRoll,
    handleResetHistory
  } = useTableState();

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
