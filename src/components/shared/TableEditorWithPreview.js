import React, { useMemo } from 'react';
import TableEditor from '../TableEditor';
import { parseTableItems } from '../../utils/tableUtils';
import '../../styles/shared.css';
import './TableEditorWithPreview.css';

const TableEditorWithPreview = ({
  text,
  onTextChange,
  tableName,
  onTableNameChange,
  placeholder,
  className = '',
  preferences = {}
}) => {
  const previewItems = useMemo(() => {
    return parseTableItems(text, preferences);
  }, [text, preferences]);

  return (
    <div className={`editor-preview-container ${className}`}>
      <div className="editor-section">
        <TableEditor
          text={text}
          onTextChange={onTextChange}
          placeholder={placeholder}
          tableName={tableName}
          onTableNameChange={onTableNameChange}
        />
      </div>
      
      <div className="preview-section">
        <div className="preview-header section-header">
          <h3>
            {tableName || 'Preview'} 
            {previewItems.length > 0 && ` (${previewItems.length} items)`}
          </h3>
        </div>
        <div className="preview-content">
          {previewItems.length > 0 ? (
            <ol>
              {previewItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ol>
          ) : (
            <div className="preview-placeholder">
              Items will appear here as you type...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableEditorWithPreview;
