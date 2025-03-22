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
      
      <div className="options-section">
        <h2>Credits</h2>
        <div className="option-item">
          <div className="option-description">
            <h3>Background Image</h3>
            <p>
              <a href="https://www.freepik.com/free-vector/old-paper-texture_967378.htm" target="_blank" rel="noopener noreferrer">
                Image by kjpargeter on Freepik
              </a>
            </p>
          </div>
        </div>
        
        <div className="option-item">
          <div className="option-description">
            <h3>Logo</h3>
            <p>
              <a href="https://commons.wikimedia.org/wiki/File:Twenty_sided_dice.svg" target="_blank" rel="noopener noreferrer">
                Twenty sided dice by wirelizard on Wikimedia Commons
              </a>
            </p>
          </div>
        </div>
        
        <div className="option-item">
          <div className="option-description">
            <h3>Title Image</h3>
            <p>
              <a href="https://commons.wikimedia.org/wiki/File:Dungeons_%26_Dragons_Dice.jpg" target="_blank" rel="noopener noreferrer">
                Dungeons & Dragons Dice by Turn2538 on Wikimedia Commons
              </a>
            </p>
          </div>
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
