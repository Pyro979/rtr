import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import TableEditorWithPreview from './shared/TableEditorWithPreview';
import { useNavigationProtection } from '../hooks/useNavigationProtection';
import { TEXT } from '../constants/text';
import '../styles/shared.css';
import './EditMode.css';

const EditMode = ({ table, onUpdate, onDelete, onDuplicate }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [editedName, setEditedName] = useState(table.name);
  const [editedText, setEditedText] = useState(table.items.join('\n'));
  const [hasChanges, setHasChanges] = useState(false);
  const [duplicatedTableId, setDuplicatedTableId] = useState(null);

  useEffect(() => {
    if (duplicatedTableId) {
      console.log('Navigating to duplicated table:', duplicatedTableId);
      navigate(`/table/${duplicatedTableId}/edit`);
      setDuplicatedTableId(null);
    }
  }, [duplicatedTableId, navigate]);

  // Add navigation protection when there are unsaved changes
  useNavigationProtection(hasChanges);

  const handleSave = () => {
    if (!editedName.trim()) {
      setError(TEXT.edit.errors.nameRequired);
      return;
    }
    setError('');
    const items = editedText.split('\n').filter(item => item.trim());
    if (items.length === 0) {
      setError(TEXT.edit.errors.itemsRequired);
      return;
    }
    onUpdate({ ...table, name: editedName.trim(), items });
    setHasChanges(false);
  };

  const handleDelete = () => {
    if (window.confirm(TEXT.edit.confirmDelete)) {
      onDelete(table.id);
      navigate('/');
    }
  };

  const handleDuplicate = () => {
    const newId = uuidv4();
    const copyNumber = table.name.match(/\{Copy (\d+)\}$/);
    const newName = copyNumber 
      ? table.name.replace(/\{Copy \d+\}$/, `{Copy ${parseInt(copyNumber[1]) + 1}}`)
      : `${table.name} {Copy 1}`;
    
    const items = editedText.split('\n').filter(item => item.trim());
    const newTable = {
      id: newId,
      name: newName,
      items
    };
    
    console.log('Duplicating table:', newTable);
    onDuplicate(newTable);
    setDuplicatedTableId(newId);
  };

  const handleTextChange = (text) => {
    setEditedText(text);
    setHasChanges(true);
  };

  const handleNameChange = (name) => {
    setEditedName(name);
    setHasChanges(true);
  };

  return (
    <div className="edit-mode">
      <div className="edit-actions">
        <button 
          onClick={handleSave}
          className="action-button primary-button"
          disabled={!hasChanges}
        >
          {TEXT.edit.saveButton}
        </button>
        <button 
          onClick={handleDuplicate}
          className="action-button duplicate-button"
        >
          {TEXT.edit.duplicateButton}
        </button>
        <button 
          onClick={handleDelete}
          className="action-button danger-button"
        >
          {TEXT.edit.deleteButton}
        </button>
      </div>

      <TableEditorWithPreview
        text={editedText}
        onTextChange={handleTextChange}
        tableName={editedName}
        onTableNameChange={handleNameChange}
        placeholder={TEXT.edit.contentPlaceholder}
      />

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default EditMode;
