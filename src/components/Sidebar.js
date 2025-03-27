import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IconButton from './IconButton';
import TableList from './TableList';
import { TEXT } from '../constants/text';
import './Sidebar.css';

const Sidebar = ({ tables = [], onResetAllHistory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showResetPrompt, setShowResetPrompt] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTables, setCurrentTables] = useState(tables);
  const navigate = useNavigate();

  // Always sync with the latest tables from localStorage
  useEffect(() => {
    const checkForUpdates = () => {
      try {
        const storedTables = localStorage.getItem('randomTables');
        if (storedTables) {
          const parsedTables = JSON.parse(storedTables);
          // Only update if the tables have changed
          if (JSON.stringify(parsedTables) !== JSON.stringify(currentTables)) {
            console.log('Sidebar: Tables updated from localStorage', parsedTables);
            setCurrentTables(parsedTables);
          }
        }
      } catch (error) {
        console.error('Error reading tables from localStorage:', error);
      }
    };

    // Check immediately
    checkForUpdates();

    // Also check whenever the component receives focus
    window.addEventListener('focus', checkForUpdates);
    
    // Set up an interval to check for updates
    const intervalId = setInterval(checkForUpdates, 1000);
    
    return () => {
      window.removeEventListener('focus', checkForUpdates);
      clearInterval(intervalId);
    };
  }, [currentTables]);

  // Also update when the tables prop changes
  useEffect(() => {
    if (tables && tables.length > 0 && JSON.stringify(tables) !== JSON.stringify(currentTables)) {
      console.log('Sidebar: Tables updated from props', tables);
      setCurrentTables(tables);
    }
  }, [tables]);

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
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
        <div className="sidebar-spacer"></div>
        <IconButton 
          to="/options" 
          text={<><span className="gear-icon">⚙️</span> Options</>} 
          onClick={handleClose}
          className="options-button"
        />
                
        <div className="sidebar-search">
          <input
            type="text"
            placeholder="Search tables..."
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label="Search tables"
          />
          {searchTerm && (
            <button 
              className="clear-search" 
              onClick={clearSearch}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
        <TableList tables={currentTables} onLinkClick={handleClose} searchTerm={searchTerm} />
        
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
