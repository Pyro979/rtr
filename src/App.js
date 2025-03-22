import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './App.css';
import ImportMode from './components/ImportMode';
import Home from './components/Home';
import Sidebar from './components/Sidebar';
import TableRoute from './routes/TableRoute';
import OptionsPage from './components/OptionsPage';
import { useTableState } from './hooks/useTableState';

const App = () => {
  const {
    tables,
    handleImport,
    handleUpdateTable,
    handleDeleteTable,
    handleRoll,
    handleResetHistory,
    handleResetAllHistory,
    rollStyle,
    rollHistory
  } = useTableState();

  // Log state changes for debugging
  useEffect(() => {
    console.log('App component rollHistory:', rollHistory);
  }, [rollHistory]);

  const Layout = ({ children }) => (
    <div className="App">
      <Sidebar tables={tables} onResetAllHistory={handleResetAllHistory} />
      <div className="main-content">
        {children}
      </div>
    </div>
  );

  // Simplified router configuration
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout><Home /></Layout>
    },
    {
      path: "/import",
      element: <Layout><ImportMode onImport={handleImport} /></Layout>
    },
    {
      path: "/table/:tableId",
      element: <Navigate to="roll" replace />
    },
    {
      path: "/table/:tableId/edit",
      element: (
        <Layout>
          <TableRoute
            tables={tables}
            onUpdateTable={handleUpdateTable}
            onDeleteTable={handleDeleteTable}
            onDuplicate={handleImport}
            onRoll={handleRoll}
            onResetHistory={handleResetHistory}
            rollStyle={rollStyle}
            rollHistory={rollHistory}
          />
        </Layout>
      )
    },
    {
      path: "/table/:tableId/roll",
      element: (
        <Layout>
          <TableRoute
            tables={tables}
            onUpdateTable={handleUpdateTable}
            onDeleteTable={handleDeleteTable}
            onDuplicate={handleImport}
            onRoll={handleRoll}
            onResetHistory={handleResetHistory}
            rollStyle={rollStyle}
            rollHistory={rollHistory}
          />
        </Layout>
      )
    },
    {
      path: "/options",
      element: <Layout><OptionsPage onResetAllHistory={handleResetAllHistory} /></Layout>
    }
  ]);

  return <RouterProvider router={router} />;
};

export default App;
