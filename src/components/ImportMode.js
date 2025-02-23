import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import TableEditorWithPreview from './shared/TableEditorWithPreview';
import { parseTableItems } from '../utils/tableUtils';
import { TEXT } from '../constants/text';
import '../styles/shared.css';
import './ImportMode.css';

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
      
      <div className="name-input-group">
        <input
          id="tableName"
          type="text"
          value={tableName}
          onChange={(e) => {
            setTableName(e.target.value);
            setError('');
          }}
          placeholder={TEXT.import.namePlaceholder}
          className="table-name-input"
        />
        <button 
          onClick={handleImport}
          className="action-button primary-button"
          disabled={!tableName.trim() || importText.trim() === ''}
        >
          {TEXT.import.submitButton}
        </button>
      </div>

      <TableEditorWithPreview
        text={importText}
        onTextChange={(text) => {
          setImportText(text);
          setError('');
        }}
        tableName={tableName}
        placeholder={TEXT.import.contentPlaceholder}
      />

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ImportMode;
