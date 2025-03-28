import React, { useMemo } from 'react';
import TableEditor from '../TableEditor';
import { parseTableItems } from '../../utils/tableUtils';
import { TEXT } from '../../constants/text';
import '../../styles/shared.css';
import './TableEditorWithPreview.css';

const TableEditorWithPreview = ({
  text,
  onTextChange,
  tableName,
  onTableNameChange,
  contentPlaceholder,
  namePlaceholder,
  className = '',
  preferences = {}
}) => {
  const tableData = useMemo(() => {
    return parseTableItems(text, preferences);
  }, [text, preferences]);

  const previewItems = tableData.items;
  const { header } = tableData;

  return (
    <div className={`editor-preview-container ${className}`}>
      <div className="editor-section">
        <TableEditor
          text={text}
          onTextChange={onTextChange}
          placeholder={contentPlaceholder}
          tableName={tableName}
          onTableNameChange={onTableNameChange}
          namePlaceholder={namePlaceholder}
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
            <>
              {preferences.removeHeader && header && (
                <div className="removed-header">
                  <del>{header}</del> <span className="header-removed-text">{TEXT.import.preferences.headerRemoved}</span>
                </div>
              )}
              <ol>
                {previewItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ol>
            </>
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
