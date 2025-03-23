import React, { useEffect } from 'react';
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
  const router = createHashRouter([
    {
      path: "/",
      element: <Layout isHomePage={true}><Home /></Layout>,
      errorElement: <Layout><ErrorBoundary /></Layout>
    },
    {
      path: "/import",
      element: <Layout><ImportMode onImport={handleImport} /></Layout>,
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
            onDuplicate={handleImport}
            onRoll={handleRoll}
            onResetHistory={handleResetHistory}
            rollStyle={rollStyle}
            rollHistory={rollHistory}
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
            onDuplicate={handleImport}
            onRoll={handleRoll}
            onResetHistory={handleResetHistory}
            rollStyle={rollStyle}
            rollHistory={rollHistory}
          />
        </Layout>
      ),
      errorElement: <Layout><ErrorBoundary /></Layout>
    },
    {
      path: "/options",
      element: <Layout><OptionsPage onResetAllHistory={handleResetAllHistory} /></Layout>,
      errorElement: <Layout><ErrorBoundary /></Layout>
    }
  ]);

  return <RouterProvider router={router} />;
};

export default App;
