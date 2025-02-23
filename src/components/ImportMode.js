import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import TableEditor from './TableEditor';
import { parseTableItems } from '../utils/tableUtils';
import { TEXT } from '../constants/text';

const ImportMode = ({ onImport }) => {
  const navigate = useNavigate();
  const [importText, setImportText] = useState('');
  const [tableName, setTableName] = useState('');
  const [error, setError] = useState('');

  const handleImport = () => {
    if (!tableName.trim()) {
      setError(TEXT.import.errors.nameRequired);
      return;
    }

    const items = parseTableItems(importText);
    if (items.length === 0) {
      setError(TEXT.import.errors.itemsRequired);
      return;
    }

    const tableId = uuidv4();
    const newTable = {
      id: tableId,
      name: tableName.trim(),
      items
    };

    onImport(newTable);
    navigate(`/table/${tableId}/roll`);
  };

  return (
    <div className="import-mode">
      <h2>{TEXT.import.title}</h2>
      <div className="form-group">
        <label htmlFor="tableName">{TEXT.import.nameLabel}</label>
        <input
          id="tableName"
          type="text"
          value={tableName}
          onChange={(e) => {
            setTableName(e.target.value);
            setError('');
          }}
          placeholder={TEXT.import.namePlaceholder}
        />
      </div>
      <TableEditor
        text={importText}
        onTextChange={(text) => {
          setImportText(text);
          setError('');
        }}
        placeholder={TEXT.import.contentPlaceholder}
      />
      {error && <div className="error-message">{error}</div>}
      <button onClick={handleImport}>{TEXT.import.submitButton}</button>
    </div>
  );
};

export default ImportMode;
