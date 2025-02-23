import React from 'react';
import './TableEditor.css';

const TableEditor = ({ text, placeholder, onTextChange, onSubmit, submitLabel }) => {
  return (
    <div className="table-editor">
      <textarea
        value={text}
        placeholder={placeholder}
        onChange={(e) => onTextChange(e.target.value)}
      />
      {onSubmit && (
        <button onClick={onSubmit}>{submitLabel}</button>
      )}
    </div>
  );
};

export default TableEditor;
