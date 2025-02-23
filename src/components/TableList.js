import React from 'react';
import { Link } from 'react-router-dom';

const TableList = ({ tables = [] }) => {
  return (
    <ul className="table-list">
      {tables.map(table => (
        <li key={table.id}>
          <Link 
            to={`/table/${table.id}/roll`}
            className="table-item"
          >
            <div className="table-info">
              <span className="table-name">{table.name}</span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default TableList;
