import React from 'react';
import { Link } from 'react-router-dom';
import './OptionsPage.css';

const OptionsPage = ({ onResetAllHistory }) => {
  const [showResetPrompt, setShowResetPrompt] = React.useState(false);
  const [confirmText, setConfirmText] = React.useState('');
  
  const handleResetClick = () => {
    setShowResetPrompt(true);
  };
  
  const handleConfirmReset = () => {
    if (confirmText === 'DELETE ALL DATA') {
      // Reset all data
      onResetAllHistory();
      
      // Clear the input
      setConfirmText('');
      setShowResetPrompt(false);
      
      // Refresh the page
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };
  
  const handleCancelReset = () => {
    setShowResetPrompt(false);
    setConfirmText('');
  };

  return (
    <div className="options-page">
      <div className="options-header">
        <Link to="/" className="back-button">
          &larr; Back
        </Link>
        <h1>Options</h1>
      </div>
      
      <div className="options-section">
        <h2>Data Management</h2>
        <div className="option-item">
          <div className="option-description">
            <h3>Reset All Data</h3>
            <p>Delete all tables and roll history. This action cannot be undone.</p>
          </div>
          <button 
            className="reset-all-button"
            onClick={handleResetClick}
          >
            Reset All Data
          </button>
        </div>
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
  );
};

export default OptionsPage;
