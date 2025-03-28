import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  exportTablesToJson, 
  parseJsonTables, 
  findDuplicateTableNames,
  loadTables
} from '../utils/tableUtils';
import { v4 as uuidv4 } from 'uuid';
import { TEXT } from '../constants/text';
import './OptionsPage.css';

const OptionsPage = ({ onResetAllHistory, onImport, onBulkImport }) => {
  const [showResetPrompt, setShowResetPrompt] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const fileInputRef = useRef(null);
  const [existingTables, setExistingTables] = useState(() => loadTables());
  const [error, setError] = useState('');
  
  // JSON import states
  const [jsonImportMode, setJsonImportMode] = useState(false);
  const [jsonTables, setJsonTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState({});
  const [duplicateNames, setDuplicateNames] = useState([]);
  const [overrideSelections, setOverrideSelections] = useState({});
  const [allOverrideSelected, setAllOverrideSelected] = useState(false);
  const [importSuccess, setImportSuccess] = useState(null);
  
  // Refresh existing tables when component mounts
  useEffect(() => {
    setExistingTables(loadTables());
  }, []);
  
  const handleResetClick = () => {
    setShowResetPrompt(true);
  };
  
  const handleConfirmReset = () => {
    if (confirmText === TEXT.options.sections.dataManagement.resetAllData.prompt.confirmText) {
      // Reset all data
      onResetAllHistory();
      
      // Clear the input
      setConfirmText('');
      setShowResetPrompt(false);
      
      // Refresh the page
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };
  
  const handleCancelReset = () => {
    setShowResetPrompt(false);
    setConfirmText('');
  };

  // Export all tables to JSON
  const handleExportTables = () => {
    exportTablesToJson(existingTables);
  };

  // Handle file selection for JSON import
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => handleJsonContent(e.target.result);
      reader.readAsText(file);
    }
  };

  // Handle drag and drop for JSON files
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        const reader = new FileReader();
        reader.onload = (e) => handleJsonContent(e.target.result);
        reader.readAsText(file);
      }
    }
  };

  // Prevent default for drag events
  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // Process JSON content from file
  const handleJsonContent = (content) => {
    try {
      const result = parseJsonTables(content);
      
      if (!result.success) {
        setError(TEXT.import.errors.invalidJson);
        return;
      }
      
      // Filter out duplicates within the imported file itself
      const uniqueTables = [];
      const importedNames = new Set();
      const duplicatesWithinFile = [];
      
      // Keep only the first occurrence of each table name in the import file
      result.tables.forEach(table => {
        if (!importedNames.has(table.name)) {
          uniqueTables.push(table);
          importedNames.add(table.name);
        } else {
          duplicatesWithinFile.push(table.name);
          console.log(`Found duplicate table name in import file: ${table.name}`);
        }
      });
      
      // Find duplicate names with existing tables
      const duplicatesWithExisting = findDuplicateTableNames(existingTables, uniqueTables);
      setDuplicateNames(duplicatesWithExisting);
      
      // Initialize selected tables and override selections
      const initialSelected = {};
      const initialOverrides = {};
      
      uniqueTables.forEach(table => {
        initialSelected[table.id] = true;
        initialOverrides[table.id] = duplicatesWithExisting.includes(table.name) ? false : true;
      });
      
      // If there were duplicates within the file, show a warning
      if (duplicatesWithinFile.length > 0) {
        setError(`${TEXT.import.errors.duplicatesInFile} ${duplicatesWithinFile.join(', ')}`);
      } else {
        setError('');
      }
      
      setJsonTables(uniqueTables);
      setSelectedTables(initialSelected);
      setOverrideSelections(initialOverrides);
      setJsonImportMode(true);
    } catch (error) {
      console.error('Error processing JSON file:', error);
      setError(TEXT.import.errors.invalidJson);
    }
  };

  // Toggle selection for a table
  const toggleTableSelection = (tableId) => {
    setSelectedTables(prev => ({
      ...prev,
      [tableId]: !prev[tableId]
    }));
  };

  // Toggle override for a duplicate table
  const toggleOverride = (tableId) => {
    setOverrideSelections(prev => ({
      ...prev,
      [tableId]: !prev[tableId]
    }));
  };

  // Toggle all overrides
  const toggleAllOverrides = () => {
    const newValue = !allOverrideSelected;
    setAllOverrideSelected(newValue);
    
    // Only update override selections for tables with duplicate names
    const newOverrides = { ...overrideSelections };
    jsonTables.forEach(table => {
      if (duplicateNames.includes(table.name)) {
        newOverrides[table.id] = newValue;
      }
    });
    
    setOverrideSelections(newOverrides);
  };

  // Import selected JSON tables
  const importSelectedTables = () => {
    // Get only the selected tables
    const tablesToImport = jsonTables.filter(table => 
      selectedTables[table.id] && 
      (!duplicateNames.includes(table.name) || overrideSelections[table.id])
    );
    
    if (tablesToImport.length === 0) {
      return;
    }
    
    // Prepare tables for import with new IDs
    const tablesToImportWithNewIds = tablesToImport.map(table => ({
      id: uuidv4(), // Generate a new ID for each imported table
      name: table.name,
      items: table.items
    }));
    
    // Create override options map for the bulk import function
    const overrideOptions = {};
    tablesToImportWithNewIds.forEach(table => {
      // Check if this table name exists in duplicateNames
      const isDuplicate = duplicateNames.includes(table.name);
      // If it's a duplicate and user selected to override, mark it for override
      if (isDuplicate) {
        // Find the original table in jsonTables to get its ID for the override selection
        const originalTable = jsonTables.find(t => t.name === table.name);
        if (originalTable && overrideSelections[originalTable.id]) {
          overrideOptions[table.id] = true;
        }
      }
    });
    
    // Use the bulk import handler to import all tables at once
    const importedCount = onBulkImport(tablesToImportWithNewIds, overrideOptions);
    
    // Update existing tables with all imported tables
    setExistingTables(loadTables());
    
    // Reset JSON import state
    setJsonImportMode(false);
    setJsonTables([]);
    setSelectedTables({});
    setDuplicateNames([]);
    setOverrideSelections({});
    
    // Show success message for the imported tables
    setImportSuccess({
      count: importedCount,
      multiple: true
    });
    
    console.log(`Successfully imported ${importedCount} tables`);
  };

  // Cancel JSON import
  const cancelJsonImport = () => {
    setJsonImportMode(false);
    setJsonTables([]);
    setSelectedTables({});
    setDuplicateNames([]);
    setOverrideSelections({});
    setError('');
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Render JSON import preview
  const renderJsonImportPreview = () => {
    return (
      <div className="json-import-preview">
        <h3>{TEXT.import.jsonImport.previewTitle}</h3>
        
        {duplicateNames.length > 0 && (
          <div className="duplicate-warning">
            <p>{TEXT.import.jsonImport.duplicatesFound}</p>
            <div className="toggle-all-container">
              <button 
                className="toggle-all-button"
                onClick={toggleAllOverrides}
              >
                {TEXT.import.jsonImport.toggleAllLabel}
              </button>
            </div>
          </div>
        )}
        
        {error && error.startsWith(TEXT.import.errors.duplicatesInFile) && (
          <div className="duplicate-warning">
            <p>{error}</p>
          </div>
        )}
        
        <div className="table-preview-list">
          {jsonTables.map(table => {
            const isDuplicate = duplicateNames.includes(table.name);
            
            return (
              <div 
                key={table.id} 
                className={`table-preview-item ${isDuplicate ? 'duplicate-item' : ''}`}
              >
                <div className="table-preview-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedTables[table.id] || false}
                    onChange={() => toggleTableSelection(table.id)}
                  />
                </div>
                <div className="table-preview-info">
                  <div className="table-preview-name">{table.name}</div>
                  <div className="table-preview-count">
                    {TEXT.import.jsonImport.itemCount.replace('{count}', table.items.length)}
                  </div>
                </div>
                {isDuplicate && (
                  <div className="table-preview-override">
                    <label>
                      <input
                        type="checkbox"
                        checked={overrideSelections[table.id] || false}
                        onChange={() => toggleOverride(table.id)}
                      />
                      {TEXT.import.jsonImport.overrideLabel}
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="json-import-actions">
          <button 
            className="action-button secondary-button"
            onClick={cancelJsonImport}
          >
            {TEXT.import.jsonImport.cancelButton}
          </button>
          <button 
            className="action-button primary-button"
            onClick={importSelectedTables}
            disabled={jsonTables.length === 0 || !Object.values(selectedTables).some(selected => selected)}
          >
            {TEXT.import.jsonImport.importSelectedButton}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="options-page">
      <div className="options-header">
        <Link to="/" className="back-button">
          {TEXT.options.backButton}
        </Link>
        <h1>{TEXT.options.title}</h1>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {importSuccess && (
        <div className="import-success">
          <div className="success-message">
            {TEXT.options.importSuccess.replace('{count}', importSuccess.count)}
          </div>
          <button 
            className="action-button secondary-button clear-button"
            onClick={() => setImportSuccess(null)}
          >
            {TEXT.import.success.clearButton}
          </button>
        </div>
      )}
      
      {jsonImportMode ? (
        renderJsonImportPreview()
      ) : (
        <>
          <div className="options-section">
            <h2>{TEXT.options.sections.importExport.title}</h2>
            <div className="option-item">
              <div className="import-container">
                <input
                  type="file"
                  id="json-file-input"
                  accept=".json"
                  onChange={handleFileSelect}
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
                <div 
                  className="json-drop-area"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current.click()}
                >
                  <i className="fas fa-file-import"></i>
                  <span>{TEXT.import.jsonImport.dragDropText}</span>
                  <span className="secondary-text"><small>{TEXT.import.jsonImport.dragDropText2}</small></span>
                </div>
              </div>
            </div>
            
            <div className="option-item">
              <div className="option-description">
                <h3>{TEXT.options.sections.importExport.export.title}</h3>
                <p>{TEXT.options.sections.importExport.export.description}</p>
              </div>
              <button 
                className="export-button"
                onClick={handleExportTables}
                disabled={existingTables.length === 0}
              >
                <i className="fas fa-download"></i> {TEXT.options.sections.importExport.export.button}
              </button>
            </div>
          </div>
          
          <div className="options-section">
            <h2>{TEXT.options.sections.dataManagement.title}</h2>
            <div className="option-item">
              <div className="option-description">
                <h3>{TEXT.options.sections.dataManagement.resetAllData.title}</h3>
                <p>{TEXT.options.sections.dataManagement.resetAllData.description}</p>
              </div>
              <button 
                className="reset-all-button"
                onClick={handleResetClick}
              >
                {TEXT.options.sections.dataManagement.resetAllData.button}
              </button>
            </div>
          </div>
          
          <div className="options-section">
            <h2>{TEXT.options.sections.artCredits.title}</h2>
            <div className="option-item">
              <div className="option-description">
                Background Image:&nbsp;
                  <a href="https://www.freepik.com/free-vector/old-paper-texture_967378.htm" target="_blank" rel="noopener noreferrer">
                    Image by kjpargeter on Freepik
                  </a>
              </div>
            </div>
            
            <div className="option-item">
              <div className="option-description">
                Logo:&nbsp;
                  <a href="https://commons.wikimedia.org/wiki/File:Twenty_sided_dice.svg" target="_blank" rel="noopener noreferrer">
                    Twenty sided dice by wirelizard on Wikimedia Commons
                  </a>
                
              </div>
            </div>
            
            <div className="option-item">
              <div className="option-description">
                Title Image:&nbsp;
                  <a href="https://commons.wikimedia.org/wiki/File:Dungeons_%26_Dragons_Dice.jpg" target="_blank" rel="noopener noreferrer">
                    Dungeons & Dragons Dice by Turn2538 on Wikimedia Commons
                  </a>
                
              </div>
            </div>
          </div>
        </>
      )}
      
      {showResetPrompt && (
        <div className="reset-prompt-overlay">
          <div className="reset-prompt">
            <h3>{TEXT.options.sections.dataManagement.resetAllData.prompt.title}</h3>
            <p>{TEXT.options.sections.dataManagement.resetAllData.prompt.warning}</p>
            <p>{TEXT.options.sections.dataManagement.resetAllData.prompt.confirmMessage}</p>
            <p>{TEXT.options.sections.dataManagement.resetAllData.prompt.typeInstruction}</p>
            <input 
              type="text" 
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={TEXT.options.sections.dataManagement.resetAllData.prompt.confirmText}
            />
            <div className="reset-prompt-buttons">
              <button 
                onClick={handleConfirmReset}
                disabled={confirmText !== TEXT.options.sections.dataManagement.resetAllData.prompt.confirmText}
                className={confirmText === TEXT.options.sections.dataManagement.resetAllData.prompt.confirmText ? 'confirm-button' : 'disabled-button'}
              >
                {TEXT.options.sections.dataManagement.resetAllData.prompt.confirmButton}
              </button>
              <button onClick={handleCancelReset}>
                {TEXT.options.sections.dataManagement.resetAllData.prompt.cancelButton}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptionsPage;
