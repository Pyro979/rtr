import React, { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';

const TableList = ({ tables = [], onLinkClick }) => {
  const { tableId } = useParams();
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [tableId]);

  // Count duplicate names
  const nameCount = tables.reduce((acc, table) => {
    const baseName = table.name.replace(/\{Copy \d+\}$/, '').trim();
    acc[baseName] = (acc[baseName] || 0) + 1;
    return acc;
  }, {});

  // Add indices and handle duplicates
  const processedTables = tables.reduce((acc, table) => {
    const baseName = table.name.replace(/\{Copy \d+\}$/, '').trim();
    const count = nameCount[baseName];
    const itemCount = table.items.length;
    
    if (count > 1) {
      // Find how many of this name we've seen so far
      const seen = acc.filter(t => 
        t.baseName === baseName
      ).length;
      
      acc.push({
        ...table,
        baseName,
        displayName: <>{table.name} <sup>{seen + 1}</sup></>,
        itemCount
      });
    } else {
      acc.push({
        ...table,
        baseName,
        displayName: table.name,
        itemCount
      });
    }
    
    return acc;
  }, []);

  return (
    <ul className="table-list">
      {processedTables.map(table => {
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
            >
              <div className="table-info">
                <pre className="table-index">[{paddedCount}]</pre>
                <span className="table-name">{table.displayName}</span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default TableList;
