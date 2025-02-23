import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
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

  const Layout = ({ children }) => (
    <div className="App">
      <Sidebar tables={tables} />
      <div className="main-content">
        {children}
      </div>
    </div>
  );

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
      path: "/table/:tableId/*",
      element: (
        <Layout>
          <TableRoute
            tables={tables}
            onUpdateTable={handleUpdateTable}
            onDeleteTable={handleDeleteTable}
            onRoll={handleRoll}
            onResetHistory={handleResetHistory}
            rollStyle={rollStyle}
            rollHistory={rollHistory}
          />
        </Layout>
      )
    }
  ]);

  return <RouterProvider router={router} />;
};

export default App;
