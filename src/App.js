import React, { useEffect, useState } from 'react';
import { createHashRouter, RouterProvider, Navigate } from 'react-router-dom';
import './App.css';
import ImportMode from './components/ImportMode';
import Home from './components/Home';
import Sidebar from './components/Sidebar';
import TableRoute from './routes/TableRoute';
import OptionsPage from './components/OptionsPage';
import ErrorBoundary from './components/ErrorBoundary';
import { useTableState } from './hooks/useTableState';

const App = () => {
  const [sidebarKey, setSidebarKey] = useState(0);
  
  const {
    tables,
    handleImport,
    handleUpdateTable,
    handleDeleteTable,
    handleRoll,
    handleResetHistory,
    handleResetAllHistory,
    rollStyle,
    rollHistory,
    tableModes,
    handleUpdateTableMode,
    condenseOptions,
    handleToggleCondenseOption,
    handleBulkImport
  } = useTableState();

  // Log state changes for debugging
  useEffect(() => {
    console.log('App component rollHistory:', rollHistory);
  }, [rollHistory]);

  // Custom import handler that also triggers sidebar refresh
  const handleImportWithRefresh = (newTable) => {
    handleImport(newTable);
    // Force sidebar to re-render by changing its key
    setSidebarKey(prevKey => prevKey + 1);
  };

  // Custom bulk import handler that triggers sidebar refresh
  const handleBulkImportWithRefresh = (tables, overrideOptions = {}) => {
    const count = handleBulkImport(tables, overrideOptions);
    // Force sidebar to re-render after all imports
    setSidebarKey(prevKey => prevKey + 1);
    return count;
  };

  const Layout = ({ children }) => (
    <div className="App">
      <Sidebar key={sidebarKey} tables={tables} onResetAllHistory={handleResetAllHistory} />
      <div className="main-content">
        {children}
      </div>
    </div>
  );

  // Simplified router configuration
  const router = createHashRouter([
    {
      path: "/",
      element: <Layout isHomePage={true}><Home /></Layout>,
      errorElement: <Layout><ErrorBoundary /></Layout>
    },
    {
      path: "/import",
      element: <Layout><ImportMode onImport={handleImportWithRefresh} /></Layout>,
      errorElement: <Layout><ErrorBoundary /></Layout>
    },
    {
      path: "/table/:tableId",
      element: <Navigate to="roll" replace />,
      errorElement: <Layout><ErrorBoundary /></Layout>
    },
    {
      path: "/table/:tableId/edit",
      element: (
        <Layout>
          <TableRoute
            tables={tables}
            onUpdateTable={handleUpdateTable}
            onDeleteTable={handleDeleteTable}
            onDuplicate={handleImportWithRefresh}
            onRoll={handleRoll}
            onResetHistory={handleResetHistory}
            rollStyle={rollStyle}
            rollHistory={rollHistory}
            tableModes={tableModes}
            onUpdateTableMode={handleUpdateTableMode}
            condenseOptions={condenseOptions}
            onToggleCondenseOption={handleToggleCondenseOption}
          />
        </Layout>
      ),
      errorElement: <Layout><ErrorBoundary /></Layout>
    },
    {
      path: "/table/:tableId/roll",
      element: (
        <Layout>
          <TableRoute
            tables={tables}
            onUpdateTable={handleUpdateTable}
            onDeleteTable={handleDeleteTable}
            onDuplicate={handleImportWithRefresh}
            onRoll={handleRoll}
            onResetHistory={handleResetHistory}
            rollStyle={rollStyle}
            rollHistory={rollHistory}
            tableModes={tableModes}
            onUpdateTableMode={handleUpdateTableMode}
            condenseOptions={condenseOptions}
            onToggleCondenseOption={handleToggleCondenseOption}
          />
        </Layout>
      ),
      errorElement: <Layout><ErrorBoundary /></Layout>
    },
    {
      path: "/options",
      element: <Layout><OptionsPage onResetAllHistory={handleResetAllHistory} onImport={handleImportWithRefresh} onBulkImport={handleBulkImportWithRefresh} /></Layout>,
      errorElement: <Layout><ErrorBoundary /></Layout>
    }
  ]);

  return <RouterProvider router={router} />;
};

export default App;
