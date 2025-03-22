import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import TableEditorWithPreview from './shared/TableEditorWithPreview';
import { useNavigationProtection } from '../hooks/useNavigationProtection';
import { parseTableItems, loadImportPreferences, saveImportPreferences } from '../utils/tableUtils';
import { TEXT } from '../constants/text';
import { Link } from 'react-router-dom';
import '../styles/shared.css';
import './ImportMode.css';

const ImportMode = ({ onImport, navigateAfterImport }) => {
  const navigate = useNavigate();
  const [importText, setImportText] = useState('');
  const [tableName, setTableName] = useState('');
  const [error, setError] = useState('');
  const [preferences, setPreferences] = useState(() => loadImportPreferences());
  const [hasChanges, setHasChanges] = useState(false);
  const [importSuccess, setImportSuccess] = useState(null);

  // Add navigation protection when there are unsaved changes
  useNavigationProtection(hasChanges);

  // Debug state values
  useEffect(() => {
    console.log('Import state:', { 
      tableName: tableName, 
      importTextLength: importText.length,
      buttonDisabled: !tableName.trim() || importText.trim() === ''
    });
  }, [tableName, importText]);

  const updatePreference = (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    saveImportPreferences(newPreferences);
  };

  const handleImport = () => {
    if (!tableName.trim()) {
      setError(TEXT.import.errors.nameRequired);
      return;
    }

    const items = parseTableItems(importText, preferences);
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
    
    // Set success state instead of navigating away
    setImportSuccess({
      id: tableId,
      name: tableName.trim(),
      itemCount: items.length
    });
    
    // Clear the form for a new import
    setImportText('');
    setTableName('');
    setHasChanges(false);
    
    // Don't navigate away automatically
    // if (navigateAfterImport) {
    //   navigateAfterImport(tableId);
    // } else {
    //   navigate(`/table/${tableId}/roll`);
    // }
  };

  return (
    <div className="import-mode">
      {importSuccess && (
        <div className="import-success">
          <div className="success-message">
            Created a new table with {importSuccess.itemCount} items: 
            <Link to={`/table/${importSuccess.id}/roll`} className="table-link">
              {importSuccess.name}
            </Link>
          </div>
          <button 
            className="action-button secondary-button clear-button"
            onClick={() => setImportSuccess(null)}
          >
            Clear
          </button>
        </div>
      )}
      
      <div className="import-preferences">
        <div className="preferences-options">
          <label className="preference-item">
            <input
              type="checkbox"
              checked={preferences.removeLeadingNumbers}
              onChange={(e) => updatePreference('removeLeadingNumbers', e.target.checked)}
            />
            {TEXT.import.preferences.removeLeadingNumbers}
          </label>
          <label className="preference-item">
            <input
              type="checkbox"
              checked={preferences.removeBulletPoints}
              onChange={(e) => updatePreference('removeBulletPoints', e.target.checked)}
            />
            {TEXT.import.preferences.removeBulletPoints}
          </label>
          <label className="preference-item">
            <input
              type="checkbox"
              checked={preferences.removeDuplicates}
              onChange={(e) => updatePreference('removeDuplicates', e.target.checked)}
            />
            {TEXT.import.preferences.removeDuplicates}
          </label>
          <label className="preference-item">
            <input
              type="checkbox"
              checked={preferences.removeHeader}
              onChange={(e) => updatePreference('removeHeader', e.target.checked)}
            />
            {TEXT.import.preferences.removeHeader}
          </label>
        </div>
        <button 
          onClick={handleImport}
          className="action-button primary-button"
          disabled={!tableName.trim() || importText.trim() === ''}
        >
          {TEXT.import.submitButton}
        </button>
        
        {/* Requirements checklist */}
        <div className="import-requirements">
          <div className="requirement-item">
            <span className={tableName.trim() ? "requirement-met" : "requirement-missing"}>
              {tableName.trim() ? "✅" : "⬜"}
            </span>
            <span>Table name</span>
          </div>
          <div className="requirement-item">
            <span className={importText.trim() ? "requirement-met" : "requirement-missing"}>
              {importText.trim() ? "✅" : "⬜"}
            </span>
            <span>Table data</span>
          </div>
        </div>
      </div>

      <TableEditorWithPreview
        text={importText}
        onTextChange={(text) => {
          setImportText(text);
          setError('');
          setHasChanges(text.trim() !== '' || tableName.trim() !== '');
        }}
        tableName={tableName}
        onTableNameChange={(name) => {
          setTableName(name);
          setError('');
          setHasChanges(name.trim() !== '' || importText.trim() !== '');
        }}
        placeholder={TEXT.import.contentPlaceholder}
        preferences={preferences}
      />

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ImportMode;
