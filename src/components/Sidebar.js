import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IconButton from './IconButton';
import TableList from './TableList';
import { TEXT } from '../constants/text';
import './Sidebar.css';

const Sidebar = ({ tables = [], onResetAllHistory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showResetPrompt, setShowResetPrompt] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const navigate = useNavigate();

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleResetClick = () => {
    setShowResetPrompt(true);
  };

  const handleConfirmReset = () => {
    if (confirmText === 'DELETE ALL DATA') {
      // Close the sidebar and modal
      setIsOpen(false);
      setShowResetPrompt(false);
      
      // Reset all data
      onResetAllHistory();
      
      // Clear the input
      setConfirmText('');
      
      // Navigate to home and refresh the page
      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 100);
    }
  };

  const handleCancelReset = () => {
    setShowResetPrompt(false);
    setConfirmText('');
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
        
        <div className="sidebar-footer">
          <button 
            className="reset-history-button"
            onClick={handleResetClick}
          >
            Reset All Data
          </button>
        </div>
        
        {showResetPrompt && (
          <div className="reset-prompt-overlay">
            <div className="reset-prompt">
              <h3>Reset All Data</h3>
              <p>⚠️ WARNING: This will delete ALL tables and roll history!</p>
              <p>Only the default table will remain. This action cannot be undone.</p>
              <p>Type "DELETE ALL DATA" to confirm:</p>
              <input 
                type="text" 
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE ALL DATA"
              />
              <div className="reset-prompt-buttons">
                <button 
                  onClick={handleConfirmReset}
                  disabled={confirmText !== 'DELETE ALL DATA'}
                  className={confirmText === 'DELETE ALL DATA' ? 'confirm-button' : 'disabled-button'}
                >
                  Reset All Data
                </button>
                <button onClick={handleCancelReset}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
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
