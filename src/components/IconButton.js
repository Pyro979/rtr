import React from 'react';
import { Link } from 'react-router-dom';

const IconButton = ({ to, className }) => {
  return (
    <Link to={to} className={`icon-button ${className || ''}`}>
      <img src="/logo.svg" alt="" className="icon-button-icon" />
      <span>Import New Table</span>
    </Link>
  );
};

export default IconButton;
