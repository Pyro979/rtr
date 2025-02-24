import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import IconButton from './IconButton';
import TableList from './TableList';
import { TEXT } from '../constants/text';

const Sidebar = ({ tables = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button 
        className="hamburger-menu"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <Link to="/" className="sidebar-header" onClick={handleClose}>
          <h2>{TEXT.sidebar.title}</h2>
        </Link>
        <IconButton to="/import" text={TEXT.sidebar.importButton} onClick={handleClose} />
        <TableList tables={tables} onLinkClick={handleClose} />
      </div>

      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={handleClose}
        />
      )}
    </>
  );
};

export default Sidebar;
