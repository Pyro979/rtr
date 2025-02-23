import React from 'react';
import './TableEditor.css';

const TableEditor = ({ text, placeholder, onTextChange }) => {
  return (
    <div className="table-editor">
      <textarea
        value={text}
        placeholder={placeholder}
        onChange={(e) => onTextChange(e.target.value)}
      />
    </div>
  );
};

export default TableEditor;
