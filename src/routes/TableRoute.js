import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useLocation } from 'react-router-dom';
import EditMode from '../components/EditMode';
import RollMode from '../components/RollMode';

const TableRoute = ({ 
  tables, 
  onUpdateTable, 
  onDeleteTable, 
  onDuplicate, 
  onRoll, 
  onResetHistory, 
  rollStyle, 
  rollHistory,
  tableModes,
  onUpdateTableMode,
  condenseOptions,
  onToggleCondenseOption
}) => {
  const { tableId } = useParams();
  const location = useLocation();
  const isEditMode = location.pathname.endsWith('/edit');
  const table = tables.find(t => t.id === tableId);
  
  // Add state to track the current table name for immediate updates
  const [currentTableName, setCurrentTableName] = useState(table ? table.name : '');
  
  // Update the current table name whenever the table changes
  useEffect(() => {
    if (table) {
      setCurrentTableName(table.name);
    }
  }, [table]);
  
  // Update the table mode whenever it changes
  useEffect(() => {
    if (tableId && onUpdateTableMode) {
      onUpdateTableMode(tableId, isEditMode ? 'edit' : 'roll');
    }
  }, [tableId, isEditMode, onUpdateTableMode]);
  
  // Custom update handler to update the name immediately
  const handleUpdateTable = (updatedTable) => {
    setCurrentTableName(updatedTable.name);
    onUpdateTable(updatedTable);
  };

  if (!table) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="table-route" data-testid="table-route">
      <div className="table-header">
        <h2 data-testid="table-name">{currentTableName}</h2>
        <div className="table-actions">
          {!isEditMode ? (
            <Link 
              to={`/table/${tableId}/edit`} 
              className="button"
              data-testid="edit-table-link"
            >
              <i className="fas fa-edit"></i> Edit Table
            </Link>
          ) : (
            <Link 
              to={`/table/${tableId}/roll`} 
              className="button"
              data-testid="roll-table-link"
            >
              <i className="fas fa-dice"></i> Roll Table
            </Link>
          )}
        </div>
      </div>
      {isEditMode ? (
        <EditMode 
          table={table}
          onUpdate={handleUpdateTable}
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
          isCondensed={condenseOptions[tableId] || false}
          onToggleCondense={(isCondensed) => onToggleCondenseOption(tableId, isCondensed)}
        />
      )}
    </div>
  );
};

export default TableRoute;
