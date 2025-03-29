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
    if (confirmText === TEXT.resetData.confirmText) {
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
        data-testid="hamburger-menu-button"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`sidebar ${isOpen ? 'open' : ''}`} data-testid="sidebar">
        <Link to="/" className="sidebar-header" onClick={handleClose} data-testid="sidebar-header">
          <h2 data-testid="sidebar-title">{TEXT.sidebar.title}</h2>
        </Link>
        <IconButton to="/import" text={<><i className="fas fa-plus"></i> {TEXT.sidebar.importButton}</>} onClick={handleClose} data-testid="import-button" />
        <div className="sidebar-spacer"></div>
        <IconButton 
          to="/options" 
          text={<><i className="fas fa-cog"></i> {TEXT.sidebar.optionsButton}</>} 
          onClick={handleClose}
          className="options-button"
          data-testid="options-button"
        />
                
        <div className="sidebar-search" data-testid="sidebar-search">
          <input
            type="text"
            placeholder={TEXT.search.placeholder}
            value={searchTerm}
            onChange={handleSearchChange}
            aria-label={TEXT.search.placeholder}
            data-testid="sidebar-search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search" 
              onClick={clearSearch}
              aria-label={TEXT.search.clearAriaLabel}
              data-testid="clear-search-button"
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        <TableList tables={currentTables} onLinkClick={handleClose} searchTerm={searchTerm} data-testid="table-list" />
        
        {showResetPrompt && (
          <div className="reset-prompt-overlay" data-testid="reset-prompt-overlay">
            <div className="reset-prompt" data-testid="reset-prompt">
              <h3 data-testid="reset-prompt-title">{TEXT.resetData.title}</h3>
              <p data-testid="reset-prompt-warning"><i className="fas fa-exclamation-triangle"></i> {TEXT.resetData.warning}</p>
              <p data-testid="reset-prompt-confirm-message">{TEXT.resetData.confirmMessage}</p>
              <p data-testid="reset-prompt-type-instruction">{TEXT.resetData.typeInstruction}</p>
              <input 
                type="text" 
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={TEXT.resetData.confirmText}
                data-testid="reset-prompt-input"
              />
              <div className="reset-prompt-buttons" data-testid="reset-prompt-buttons">
                <button 
                  onClick={handleConfirmReset}
                  disabled={confirmText !== TEXT.resetData.confirmText}
                  className={confirmText === TEXT.resetData.confirmText ? 'confirm-button' : 'disabled-button'}
                  data-testid="reset-prompt-confirm-button"
                >
                  {TEXT.resetData.confirmButton}
                </button>
                <button onClick={handleCancelReset} data-testid="reset-prompt-cancel-button">
                  {TEXT.resetData.cancelButton}
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
          data-testid="sidebar-overlay"
        />
      )}
    </>
  );
};

export default Sidebar;
