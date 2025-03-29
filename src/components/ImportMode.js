import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import TableEditorWithPreview from './shared/TableEditorWithPreview';
import { useNavigationProtection } from '../hooks/useNavigationProtection';
import { 
  parseTableItems, 
  loadImportPreferences, 
  saveImportPreferences, 
  loadTables
} from '../utils/tableUtils';
import { isDuplicateName } from '../utils/tableNameUtils';
import { TEXT } from '../constants/text';
import { Link } from 'react-router-dom';
import '../styles/shared.css';
import './ImportMode.css';

const ImportMode = ({ onImport }) => {
  const [importText, setImportText] = useState('');
  const [tableName, setTableName] = useState('');
  const [error, setError] = useState('');
  const [preferences, setPreferences] = useState(() => loadImportPreferences());
  const [hasChanges, setHasChanges] = useState(false);
  const [importSuccess, setImportSuccess] = useState(null);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [headerText, setHeaderText] = useState(null);
  const [existingTables, setExistingTables] = useState(() => loadTables());

  // Refresh existing tables when component mounts
  useEffect(() => {
    setExistingTables(loadTables());
  }, []);

  // Add navigation protection when there are unsaved changes
  useNavigationProtection(hasChanges);

  // Update duplicate count and header text when import text changes
  useEffect(() => {
    if (importText.trim()) {
      const tableData = parseTableItems(importText, preferences);
      setDuplicateCount(tableData.duplicateCount);
      setHeaderText(tableData.header);
    } else {
      setDuplicateCount(0);
      setHeaderText(null);
    }
  }, [importText, preferences]);

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

    // Check for duplicate table name
    if (isDuplicateName(existingTables, tableName.trim())) {
      setError(TEXT.import.errors.duplicateName);
      return;
    }

    const tableData = parseTableItems(importText, preferences);
    if (tableData.items.length === 0) {
      setError(TEXT.import.errors.itemsRequired);
      return;
    }

    const tableId = uuidv4();
    const newTable = {
      id: tableId,
      name: tableName.trim(),
      items: tableData.items
    };

    onImport(newTable);
    
    // Update existing tables with the new one
    setExistingTables([...existingTables, newTable]);
    
    // Set success state instead of navigating away
    setImportSuccess({
      id: tableId,
      name: tableName.trim(),
      itemCount: tableData.items.length
    });
    
    // Clear the form for a new import
    setImportText('');
    setTableName('');
    setHasChanges(false);
  };

  return (
    <div className="import-mode" data-testid="import-mode">
      <h2 className="page-title" data-testid="import-title">{TEXT.import.title}</h2>
      {importSuccess && (
        <div className="import-success" data-testid="import-success">
          <div className="success-message">
            Created a new table with {importSuccess.itemCount} items: 
            <Link to={`/table/${importSuccess.id}/roll`} className="table-link" data-testid="imported-table-link">
              {importSuccess.name}
            </Link>
          </div>
          <button 
            className="action-button secondary-button clear-button"
            onClick={() => setImportSuccess(null)}
            data-testid="clear-success-button"
          >
            {TEXT.import.success.clearButton}
          </button>
        </div>
      )}
      
      {error && (
        <div className="error-message" data-testid="import-error">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
      )}
      
      <div className="import-preferences">
        <div className="preferences-options">
          <label className="preference-item" data-testid="remove-numbers-label">
            <input
              type="checkbox"
              checked={preferences.removeLeadingNumbers}
              onChange={(e) => updatePreference('removeLeadingNumbers', e.target.checked)}
              data-testid="remove-numbers-checkbox"
            />
            {TEXT.import.preferences.removeLeadingNumbers}
          </label>
          <label className="preference-item" data-testid="remove-bullets-label">
            <input
              type="checkbox"
              checked={preferences.removeBulletPoints}
              onChange={(e) => updatePreference('removeBulletPoints', e.target.checked)}
              data-testid="remove-bullets-checkbox"
            />
            {TEXT.import.preferences.removeBulletPoints}
          </label>
          <label className="preference-item" data-testid="remove-duplicates-label">
            <input
              type="checkbox"
              checked={preferences.removeDuplicates}
              onChange={(e) => updatePreference('removeDuplicates', e.target.checked)}
              data-testid="remove-duplicates-checkbox"
            />
            {duplicateCount > 0 
              ? TEXT.import.preferences.removeDuplicatesCount.replace('{count}', duplicateCount)
              : TEXT.import.preferences.removeDuplicates}
          </label>
          <label className="preference-item" data-testid="remove-header-label">
            <input
              type="checkbox"
              checked={preferences.removeHeader}
              onChange={(e) => updatePreference('removeHeader', e.target.checked)}
              data-testid="remove-header-checkbox"
            />
            {TEXT.import.preferences.removeHeader}
            {preferences.removeHeader && headerText && (
              <span className="header-removed-text"> {TEXT.import.preferences.headerRemoved}</span>
            )}
          </label>
        </div>
        <button 
          onClick={handleImport}
          className="action-button primary-button"
          disabled={!tableName.trim() || importText.trim() === ''}
          data-testid="import-button"
        >
          {TEXT.import.submitButton}
        </button>
        
        {/* Requirements checklist */}
        <div className="import-requirements">
          <div className="requirement-item">
            <span className={tableName.trim() ? "requirement-met" : "requirement-missing"}>
              {tableName.trim() ? <i className="fas fa-check-square"></i> : <i className="far fa-square"></i>}
            </span>
            <span>Table name</span>
          </div>
          <div className="requirement-item">
            <span className={importText.trim() ? "requirement-met" : "requirement-missing"}>
              {importText.trim() ? <i className="fas fa-check-square"></i> : <i className="far fa-square"></i>}
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
        namePlaceholder={TEXT.import.namePlaceholder}
        contentPlaceholder={TEXT.import.contentPlaceholder}
        preferences={preferences}
        data-testid="table-preview"
      />
      
      <div className="organization-tips" data-testid="organization-tips">
        <h3>{TEXT.import.organization.title}</h3>
        <ul>
          <li><i className="fas fa-folder"></i> {TEXT.import.organization.folders}</li>
          <li><i className="fas fa-tag"></i> {TEXT.import.organization.tags}</li>
          <li><i className="fas fa-lightbulb"></i> {TEXT.import.organization.example}</li>
        </ul>
      </div>
      
    </div>
  );
};

export default ImportMode;
