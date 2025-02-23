import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import TableEditor from './TableEditor';
import { parseTableItems } from '../utils/tableUtils';

const ImportMode = ({ onImport }) => {
  const navigate = useNavigate();
  const [importText, setImportText] = useState('');
  const [tableName, setTableName] = useState('');
  const [error, setError] = useState('');

  const handleImport = () => {
    if (!tableName.trim()) {
      setError('Table name is required');
      return;
    }

    const items = parseTableItems(importText);
    if (items.length === 0) {
      setError('At least one item is required');
      return;
    }

    const tableId = uuidv4();
    const newTable = {
      id: tableId,
      name: tableName.trim(),
      items
    };
    
    onImport(newTable);
    navigate(`/table/${tableId}`);
  };

  return (
    <div className="import-mode">
      <h3>Import New Table</h3>
      <div className="form-group">
        <label htmlFor="tableName">Table Name (required)</label>
        <input
          id="tableName"
          type="text"
          value={tableName}
          onChange={(e) => {
            setTableName(e.target.value);
            setError('');
          }}
          placeholder="Enter table name..."
        />
      </div>
      <TableEditor
        text={importText}
        placeholder="Paste your table items here, one per line..."
        onTextChange={(text) => {
          setImportText(text);
          setError('');
        }}
      />
      {error && <div className="error-message">{error}</div>}
      <button onClick={handleImport}>Create Table</button>
    </div>
  );
};

export default ImportMode;
