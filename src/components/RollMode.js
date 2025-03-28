import React, { useState, useEffect, useRef, useCallback } from 'react';
import { rollOnTable, parseDiceNotation } from '../utils/tableUtils';
import { TEXT } from '../constants/text';
import './RollMode.css';

const RollMode = ({ table, rollStyle, rollHistory, onRoll, onResetHistory }) => {
  // Internal state for tracking the current roll
  const [currentRoll, setCurrentRoll] = useState(null);
  // Internal state for tracking roll counts
  const [rollCounts, setRollCounts] = useState({});
  // Internal state for tracking roll style
  const [currentRollStyle, setCurrentRollStyle] = useState(rollStyle);
  // Internal state for tracking rolled index
  const [rolledIndex, setRolledIndex] = useState(null);
  // Track if we're currently processing a roll to prevent infinite recursion
  const [isRolling, setIsRolling] = useState(false);
  // Ref for the highlighted row
  const highlightedRowRef = useRef(null);
  // Ref for the table container
  const tableContainerRef = useRef(null);
  
  // Update internal roll style when prop changes
  useEffect(() => {
    setCurrentRollStyle(rollStyle);
  }, [rollStyle]);
  
  // Initialize from props when component mounts or rollHistory changes
  useEffect(() => {
    if (table && table.id && rollHistory[table.id]) {
      const tableHistory = rollHistory[table.id];
      if (tableHistory.result) {
        setCurrentRoll(tableHistory.result);
      }
      if (tableHistory.counts) {
        setRollCounts(tableHistory.counts);
      }
      if (tableHistory.rolledIndex !== undefined) {
        setRolledIndex(tableHistory.rolledIndex);
      }
    }
  }, [table, rollHistory]);

  // Add keyboard shortcut for rolling
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only trigger if 'r' is pressed and we're not in an input field
      if (e.key === 'r' && 
          !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        handleRoll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [table, isRolling, rollHistory, currentRollStyle]);

  // Scroll to highlighted row when it changes
  useEffect(() => {
    if (highlightedRowRef.current && tableContainerRef.current) {
      // Use a small timeout to ensure the DOM has updated
      setTimeout(() => {
        highlightedRowRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  }, [rolledIndex]);

  // Check if all items have been rolled in noRepeat mode
  const allItemsRolled = currentRollStyle === 'noRepeat' && 
    table?.items?.length > 0 && 
    table.items.every((_, index) => rollCounts[index] > 0);

  const handleRoll = () => {
    if (!table || !table.id || isRolling || allItemsRolled) return;
    
    setIsRolling(true);
    
    // Get the current history for this table
    const tableHistory = rollHistory[table.id] || {};
    
    // Roll on the table
    const rollResult = rollOnTable(table, currentRollStyle, tableHistory);
    
    if (!rollResult) {
      // All items have been rolled, need to reset
      handleResetHistory();
      setIsRolling(false);
      return;
    }
    
    // Update the roll counts for display
    const newCounts = { ...rollCounts };
    newCounts[rollResult.index] = (newCounts[rollResult.index] || 0) + 1;
    setRollCounts(newCounts);
    
    // Process any dice notation in the rolled result
    const processedResult = parseDiceNotation(rollResult.result);
    
    // Set the current roll text and index
    setCurrentRoll(processedResult.text);
    setRolledIndex(rollResult.index);
    
    // Call the parent's onRoll handler
    onRoll(table.id, rollResult.index);
    
    // Reset the rolling state after a short delay
    setTimeout(() => {
      setIsRolling(false);
    }, 500);
  };
  
  const handleStyleChange = (newStyle) => {
    // Reset history when switching to any mode
    handleResetHistory();
    
    setCurrentRollStyle(newStyle);
    if (table && table.id) {
      // Update parent state with new style
      onRoll(table.id, null, null, newStyle);
    }
  };
  
  const handleResetHistory = () => {
    if (!table || !table.id) return;
    
    // Reset local state
    setCurrentRoll(null);
    setRollCounts({});
    setRolledIndex(null);
    
    // Also reset parent state
    onResetHistory(table.id);
  };

  // Function to copy the roll result to clipboard
  const handleCopyResult = useCallback(() => {
    if (!currentRoll) return;
    
    navigator.clipboard.writeText(currentRoll)
      .then(() => {
        // Show a check icon for 3 seconds
        const copyButton = document.querySelector('.copy-button i');
        if (copyButton) {
          copyButton.className = 'fas fa-check';
          setTimeout(() => {
            copyButton.className = 'fas fa-copy';
          }, 3000);
        }
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  }, [currentRoll]);

  return (
    <div className="roll-mode">
      <h2>{TEXT.roll.title}</h2>
      <div className="roll-controls">
        <select 
          value={currentRollStyle} 
          onChange={(e) => handleStyleChange(e.target.value)}
        >
          <option value="normal">{TEXT.roll.styles.normal}</option>
          <option value="weighted">{TEXT.roll.styles.weighted}</option>
          <option value="noRepeat">{TEXT.roll.styles.noRepeat}</option>
        </select>
        <button onClick={handleResetHistory}>
          <i className="fas fa-history"></i> {TEXT.roll.resetButton}
        </button>
      </div>
      
      {currentRoll && (
        <div className="roll-result">
          <div className="result-container">
            <p>{TEXT.roll.rolledPrefix} {currentRoll}</p>
            <button 
              className="copy-button" 
              onClick={handleCopyResult} 
              title={TEXT.roll.copyTooltip}
            >
              <i className="fas fa-copy"></i>
            </button>
          </div>
        </div>
      )}
      
      <div className="roll-table" ref={tableContainerRef}>
        <table>
          <tbody>
            {table.items.map((item, index) => {
              const count = rollCounts[index] || 0;
              const isHighlighted = index === rolledIndex;
              const isRolled = currentRollStyle === 'noRepeat' && count > 0;
              
              return (
                <tr 
                  key={index} 
                  className={`
                    ${isHighlighted ? 'highlighted' : ''}
                    ${isRolled ? 'rolled' : ''}
                  `}
                  ref={isHighlighted ? highlightedRowRef : null}
                >
                  <td>{index + 1}</td>
                  <td>
                    {item}
                    {/* Only show counts for weighted mode */}
                    {currentRollStyle === 'weighted' && count > 0 && (
                      <span className="roll-count">
                        ({count} {count === 1 ? TEXT.roll.rollCount.singular : TEXT.roll.rollCount.plural})
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Floating action button for rolling */}
      <button 
        className={`floating-roll-button ${allItemsRolled ? 'disabled' : ''}`}
        onClick={handleRoll}
        disabled={isRolling || allItemsRolled}
        aria-label="Roll on table"
      >
        <img src={process.env.PUBLIC_URL + "/logo.svg"} alt="d20 dice" className="roll-icon-svg" />
        <span className="roll-text">{allItemsRolled ? TEXT.roll.floatingButton.done : TEXT.roll.floatingButton.roll}</span>
      </button>
    </div>
  );
};

export default RollMode;
