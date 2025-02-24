import React from 'react';
import { useParams, Link, Navigate, useLocation } from 'react-router-dom';
import EditMode from '../components/EditMode';
import RollMode from '../components/RollMode';
import { TEXT } from '../constants/text';

const TableRoute = ({ tables, onUpdateTable, onDeleteTable, onDuplicate, onRoll, onResetHistory, rollStyle, rollHistory }) => {
  const { tableId } = useParams();
  const location = useLocation();
  const isEditMode = location.pathname.endsWith('/edit');
  const table = tables.find(t => t.id === tableId);
  
  console.log('TableRoute:', { tableId, isEditMode, table, pathname: location.pathname });

  if (!table) {
    console.log('Table not found, redirecting to home');
    return <Navigate to="/" replace />;
  }

  return (
    <div className="table-route">
      <div className="table-header">
        <h2>{table.name}</h2>
        <div className="table-actions">
          <Link to={`/table/${tableId}/edit`} className="button">Edit</Link>
          <Link to={`/table/${tableId}/roll`} className="button">Roll</Link>
        </div>
      </div>
      {isEditMode ? (
        <EditMode 
          table={table}
          onUpdate={onUpdateTable}
          onDelete={onDeleteTable}
          onDuplicate={onDuplicate}
        />
      ) : (
        <RollMode 
          table={table}
          rollStyle={rollStyle}
          rollHistory={rollHistory}
          onRoll={onRoll}
          onResetHistory={onResetHistory}
        />
      )}
    </div>
  );
};

export default TableRoute;
