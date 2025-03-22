import React, { useState, useEffect, useRef } from 'react';
import { rollOnTable } from '../utils/tableUtils';
import { TEXT } from '../constants/text';
import './RollMode.css';

const RollMode = ({ table, rollStyle, rollHistory, onRoll, onResetHistory }) => {
  // Internal state for tracking the current roll
  const [currentRoll, setCurrentRoll] = useState(null);
  // Internal state for tracking roll counts
  const [rollCounts, setRollCounts] = useState({});
  // Internal state for tracking roll style
  const [currentRollStyle, setCurrentRollStyle] = useState(rollStyle);
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
      if (tableHistory.style) {
        setCurrentRollStyle(tableHistory.style);
      }
    }
  }, [table, rollHistory]);

  // Scroll highlighted item into view when it changes
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
  }, [currentRoll]);

  // Check if all items have been rolled in noRepeat mode
  const allItemsRolled = currentRollStyle === 'noRepeat' && 
    table?.items?.length > 0 && 
    table.items.every((_, index) => rollCounts[index] > 0);

  const handleRoll = () => {
    if (!table || !table.id || isRolling || allItemsRolled) return;
    
    // Prevent recursive calls
    setIsRolling(true);
    
    try {
      const result = rollOnTable(table, currentRollStyle, rollCounts);
      
      // If no result, just return
      if (!result) {
        setIsRolling(false);
        return;
      }
      
      // Update local state immediately
      setCurrentRoll(result.result);
      setRollCounts(prev => ({
        ...prev,
        [result.index]: (prev[result.index] || 0) + 1
      }));
      
      // Also update parent state
      onRoll(table.id, result.index, result.result, currentRollStyle);
    } finally {
      // Always reset the rolling flag
      setIsRolling(false);
    }
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
    
    // Also reset parent state
    onResetHistory(table.id);
  };

  return (
    <div className="roll-mode">
      <h2>{TEXT.roll.title}</h2>
      <div className="roll-controls">
        <select 
          value={currentRollStyle} 
          onChange={(e) => handleStyleChange(e.target.value)}
        >
          <option value="normal">Normal Roll</option>
          <option value="weighted">Weighted (Less Common Repeats)</option>
          <option value="noRepeat">No Repeats</option>
        </select>
        <button onClick={handleResetHistory}>
          {TEXT.roll.resetButton}
        </button>
      </div>
      
      {currentRoll && (
        <div className="roll-result">
          <p>Rolled: {currentRoll}</p>
        </div>
      )}
      
      <div className="roll-table" ref={tableContainerRef}>
        <table>
          <tbody>
            {table.items.map((item, index) => {
              const count = rollCounts[index] || 0;
              const isHighlighted = item === currentRoll;
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
                        ({count} {count === 1 ? 'time' : 'times'})
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
        <span className="roll-icon">🎲</span>
        <span className="roll-text">{allItemsRolled ? 'All Rolled' : 'Roll'}</span>
      </button>
    </div>
  );
};

export default RollMode;
