import React from 'react';
import TableEditor from './TableEditor';

const EditMode = ({ table, onUpdate, onDelete }) => {
  const handleTextChange = (text) => {
    const items = text.split('\n').filter(item => item.trim());
    onUpdate({ ...table, items });
  };

  const handleNameChange = (name) => {
    onUpdate({ ...table, name });
  };

  return (
    <div className="edit-mode">
      <input
        value={table.name}
        onChange={(e) => handleNameChange(e.target.value)}
      />
      <TableEditor
        text={table.items.join('\n')}
        placeholder="Enter table items, one per line..."
        onTextChange={handleTextChange}
      />
      <button onClick={() => onDelete(table.id)}>Delete Table</button>
    </div>
  );
};

export default EditMode;
