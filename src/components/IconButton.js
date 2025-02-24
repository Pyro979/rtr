import React from 'react';
import { Link } from 'react-router-dom';

const IconButton = ({ to, text, className = '', onClick }) => {
  return (
    <Link 
      to={to} 
      className={`button ${className}`}
      onClick={onClick}
    >
      {text}
    </Link>
  );
};

export default IconButton;
