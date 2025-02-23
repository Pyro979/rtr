import React from 'react';
import { Routes, Route, useParams, Navigate, Link } from 'react-router-dom';
import EditMode from '../components/EditMode';
import RollMode from '../components/RollMode';

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
      </Routes>
    </>
  );
};

export default TableRoute;
