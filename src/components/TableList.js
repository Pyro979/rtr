import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './TableList.css';

// Key for storing folder state in localStorage
const FOLDER_STATE_KEY = 'folderExpandedState';

// Regular expression to extract tags from square brackets and hashtags
const TAG_REGEX = /\[(.*?)\]|#(\w+)/g;

const TableList = ({ tables = [], onLinkClick, searchTerm = '' }) => {
  const { tableId } = useParams();
  const activeRef = useRef(null);
  const prevTableIdRef = useRef(null);
  const [expandedFolders, setExpandedFolders] = useState(() => {
    // Initialize from localStorage if available
    try {
      const savedState = localStorage.getItem(FOLDER_STATE_KEY);
      return savedState ? JSON.parse(savedState) : {};
    } catch (error) {
      console.error('Error loading folder state:', error);
      return {};
    }
  });

  // Save expanded folder state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(FOLDER_STATE_KEY, JSON.stringify(expandedFolders));
    } catch (error) {
      console.error('Error saving folder state:', error);
    }
  }, [expandedFolders]);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [tableId]);

  // Auto-expand parent folders when a table is initially selected
  useEffect(() => {
    // Only run this effect if the tableId has changed
    if (tableId && tableId !== prevTableIdRef.current) {
      prevTableIdRef.current = tableId;
      
      // Find the active table
      const activeTable = tables.find(table => table.id === tableId);
      if (activeTable && activeTable.name.includes('\\')) {
        // Get the path parts
        const pathParts = activeTable.name.split('\\');
        // Remove the last part (table name)
        pathParts.pop();
        
        // Build up the folder paths and expand them
        let currentPath = '';
        const newExpandedState = { ...expandedFolders };
        
        pathParts.forEach(folder => {
          currentPath = currentPath ? `${currentPath}\\${folder}` : folder;
          // Only set to true if not already set (don't override user's manual collapse)
          if (newExpandedState[currentPath] !== false) {
            newExpandedState[currentPath] = true;
          }
        });
        
        // Update expanded folders state if changes were made
        if (Object.keys(newExpandedState).length !== Object.keys(expandedFolders).length ||
            Object.keys(newExpandedState).some(key => newExpandedState[key] !== expandedFolders[key])) {
          setExpandedFolders(newExpandedState);
        }
      }
    }
  }, [tableId, tables, expandedFolders]);

  // Extract tags from table name
  const extractTags = (name) => {
    const tags = [];
    let match;
    while ((match = TAG_REGEX.exec(name)) !== null) {
      tags.push(match[1] || match[2]);
    }
    return tags;
  };

  // Clean table name by removing tags
  const cleanTableName = (name) => {
    return name.replace(TAG_REGEX, '').trim();
  };

  // Count duplicate names
  const nameCount = tables.reduce((acc, table) => {
    const baseName = cleanTableName(table.name).replace(/\{Copy \d+\}$/, '').trim();
    acc[baseName] = (acc[baseName] || 0) + 1;
    return acc;
  }, {});

  // Add indices and handle duplicates
  const processedTables = tables.reduce((acc, table) => {
    const cleanName = cleanTableName(table.name);
    const baseName = cleanName.replace(/\{Copy \d+\}$/, '').trim();
    const count = nameCount[baseName];
    const itemCount = table.items.length;
    const tags = extractTags(table.name);
    
    if (count > 1) {
      // Find how many of this name we've seen so far
      const seen = acc.filter(t => 
        t.baseName === baseName
      ).length;
      
      acc.push({
        ...table,
        baseName,
        cleanName,
        displayName: (
          <>
            {cleanName} <sup>{seen + 1}</sup>
            {tags.length > 0 && <span className="table-tags-icon" title={tags.join(', ')}><i className="fas fa-tags"></i></span>}
          </>
        ),
        tags,
        itemCount
      });
    } else {
      acc.push({
        ...table,
        baseName,
        cleanName,
        displayName: (
          <>
            {cleanName}
            {tags.length > 0 && <span className="table-tags-icon" title={tags.join(', ')}><i className="fas fa-tags"></i></span>}
          </>
        ),
        tags,
        itemCount
      });
    }
    
    return acc;
  }, []);

  // Filter tables based on search term
  const filteredTables = searchTerm.trim() === '' 
    ? processedTables 
    : processedTables.filter(table => {
        const nameMatch = table.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Also check if any tags match the search term
        const tagMatch = table.tags && table.tags.some(tag => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        return nameMatch || tagMatch;
      });

  // Show a message when no tables match the search
  if (filteredTables.length === 0 && searchTerm.trim() !== '') {
    return (
      <div className="no-tables-found">
        <p>No tables match "{searchTerm}"</p>
      </div>
    );
  }

  // Organize tables into folder structure
  const organizeTablesIntoFolders = (tables) => {
    const folderStructure = {};
    
    tables.forEach(table => {
      // Check if the table name contains slashes
      if (table.cleanName.includes('\\')) {
        const pathParts = table.cleanName.split('\\');
        const tableName = pathParts.pop();
        let currentLevel = folderStructure;
        
        // Create nested folder structure
        pathParts.forEach(folder => {
          if (!currentLevel[folder]) {
            currentLevel[folder] = { __isFolder: true, __children: {} };
          }
          currentLevel = currentLevel[folder].__children;
        });
        
        // Add the table to the deepest level
        currentLevel[tableName] = { 
          __isTable: true, 
          table: { 
            ...table, 
            displayName: (
              <>
                {tableName}
                {table.tags.length > 0 && <span className="table-tags-icon" title={table.tags.join(', ')}><i className="fas fa-tags"></i></span>}
              </>
            )
          } 
        };
      } else {
        // Tables without slashes go at the root level
        folderStructure[table.cleanName] = { __isTable: true, table };
      }
    });
    
    return folderStructure;
  };

  // Toggle folder expansion
  const toggleFolder = (folderPath, event) => {
    // Stop the event from propagating to parent elements
    event.stopPropagation();
    
    setExpandedFolders(prev => ({
      ...prev,
      [folderPath]: !prev[folderPath]
    }));
  };

  // Check if a folder should be expanded
  const isFolderExpanded = (folderPath) => {
    // If searching, expand all folders
    if (searchTerm.trim() !== '') {
      return true;
    }
    
    // Otherwise use the expandedFolders state
    return expandedFolders[folderPath] === true;
  };

  // Sort entries alphabetically and put folders first
  const sortEntries = (entries) => {
    return entries.sort((a, b) => {
      const [nameA, itemA] = a;
      const [nameB, itemB] = b;
      
      // If both are folders or both are tables, sort alphabetically
      if ((itemA.__isFolder && itemB.__isFolder) || (itemA.__isTable && itemB.__isTable)) {
        return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
      }
      
      // Otherwise, folders come first
      return itemA.__isFolder ? -1 : 1;
    });
  };

  // Render a folder and its contents
  const renderFolder = (folderName, contents, path = '', level = 0) => {
    const folderPath = path ? `${path}\\${folderName}` : folderName;
    const isExpanded = isFolderExpanded(folderPath);
    
    return (
      <li key={folderPath} className="folder-item">
        <div 
          className="folder-header"
          onClick={(e) => toggleFolder(folderPath, e)}
          style={{ paddingLeft: `${level * 16}px` }}
        >
          <span className="folder-icon">{isExpanded ? '📂' : '📁'}</span>
          <span className="folder-name">{folderName}</span>
        </div>
        
        {isExpanded && (
          <ul className="folder-contents">
            {sortEntries(Object.entries(contents.__children)).map(([name, item]) => {
              if (item.__isFolder) {
                return renderFolder(name, item, folderPath, level + 1);
              } else if (item.__isTable) {
                return renderTableItem(item.table, level + 1);
              }
              return null;
            })}
          </ul>
        )}
      </li>
    );
  };

  // Render a table item
  const renderTableItem = (table, level = 0) => {
    const isActive = table.id === tableId;
    const paddedCount = String("d"+table.itemCount).padStart(4, ' ');
    
    return (
      <li 
        key={table.id} 
        ref={isActive ? activeRef : null}
      >
        <Link 
          to={`/table/${table.id}/roll`}
          className={`table-item ${isActive ? 'active' : ''}`}
          onClick={onLinkClick}
          title={table.name}
          style={{ paddingLeft: `${level * 16}px` }}
        >
          <div className="table-info">
            <pre className="table-index">[{paddedCount}]</pre>
            <span className="table-name">{table.displayName}</span>
          </div>
        </Link>
      </li>
    );
  };

  // Create the content to render based on search term
  const renderContent = () => {
    if (searchTerm.trim() !== '') {
      // Sort tables alphabetically for search results
      const sortedTables = [...filteredTables].sort((a, b) => 
        a.cleanName.localeCompare(b.cleanName, undefined, { sensitivity: 'base' })
      );
      
      return (
        <ul className="table-list">
          {sortedTables.map(table => renderTableItem(table))}
        </ul>
      );
    } else {
      // Otherwise render the folder structure
      const folderStructure = organizeTablesIntoFolders(filteredTables);
      
      return (
        <ul className="table-list">
          {sortEntries(Object.entries(folderStructure)).map(([name, item]) => {
            if (item.__isFolder) {
              return renderFolder(name, item);
            } else if (item.__isTable) {
              return renderTableItem(item.table);
            }
            return null;
          })}
        </ul>
      );
    }
  };

  return renderContent();
};

export default TableList;
