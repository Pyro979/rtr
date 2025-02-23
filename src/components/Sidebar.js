import React from 'react';
import { Link } from 'react-router-dom';
import IconButton from './IconButton';
import TableList from './TableList';
import { TEXT } from '../constants/text';

const Sidebar = ({ tables = [] }) => {
  return (
    <div className="sidebar">
      <Link to="/" className="sidebar-header">
        <h2>{TEXT.sidebar.title}</h2>
      </Link>
      <IconButton to="/import" text={TEXT.sidebar.importButton} />
      <TableList tables={tables} />
    </div>
  );
};

export default Sidebar;
