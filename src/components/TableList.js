import React, { useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';

const TableList = ({ tables = [] }) => {
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

  return (
    <ul className="table-list">
      {tables.map(table => {
        const isActive = table.id === tableId;
        return (
          <li 
            key={table.id} 
            ref={isActive ? activeRef : null}
          >
            <Link 
              to={`/table/${table.id}/roll`}
              className={`table-item ${isActive ? 'active' : ''}`}
            >
              <div className="table-info">
                <span className="table-name">{table.name}</span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default TableList;
