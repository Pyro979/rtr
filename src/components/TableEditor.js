import React from 'react';
import './TableEditor.css';
import '../styles/shared.css';

const TableEditor = ({ text, placeholder, onTextChange, tableName = '', onTableNameChange }) => {
  const handleNameChange = (e) => {
    // Prevent newlines in the name
    const newName = e.target.value.replace(/\n/g, '');
    onTableNameChange?.(newName);
  };

  return (
    <div className="table-editor">
      <div className="editor-header section-header">
        <input
          type="text"
          value={tableName}
          onChange={handleNameChange}
          placeholder="Enter table name..."
          className="table-name-input"
          maxLength={100} // Prevent extremely long names
        />
      </div>
      <textarea
        value={text}
        placeholder={placeholder}
        onChange={(e) => onTextChange(e.target.value)}
      />
    </div>
  );
};

export default TableEditor;
