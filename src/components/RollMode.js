import React, { useState, useEffect, useRef, useCallback } from 'react';
import { rollOnTable, parseDiceNotation } from '../utils/tableUtils';
import { TEXT } from '../constants/text';
import './RollMode.css';

const RollMode = ({ table, rollStyle, rollHistory, onRoll, onResetHistory, isCondensed = false, onToggleCondense }) => {
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
  // Internal state for condensed view option
  const [condensed, setCondensed] = useState(isCondensed);
  // Ref for the highlighted row
  const highlightedRowRef = useRef(null);
  // Ref for the table container
  const tableContainerRef = useRef(null);
  
  // Update internal roll style when prop changes
  useEffect(() => {
    setCurrentRollStyle(rollStyle);
  }, [rollStyle]);
  
  // Update internal condensed state when prop changes
  useEffect(() => {
    setCondensed(isCondensed);
  }, [isCondensed]);
  
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
      if (tableHistory.style) {
        setCurrentRollStyle(tableHistory.style);
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
        if (highlightedRowRef.current) {
          highlightedRowRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }
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
    
    // For noRepeat mode, we need to pass the actual counts to ensure we don't roll the same item twice
    const historyForRoll = currentRollStyle === 'noRepeat' ? rollCounts : tableHistory.counts || {};
    
    // Roll on the table
    const rollResult = rollOnTable(table, currentRollStyle, historyForRoll);
    
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
    console.log(`Changing roll style to: ${newStyle}`);
    
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

  // Function to toggle condensed view
  const handleToggleCondense = () => {
    const newCondensed = !condensed;
    setCondensed(newCondensed);
    if (onToggleCondense) {
      onToggleCondense(newCondensed);
    }
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

  // Function to condense consecutive duplicate items
  const getCondensedItems = useCallback(() => {
    if (!table || !table.items) {
      return [];
    }

    // If not condensed, just map each item with its roll status
    if (!condensed) {
      return table.items.map((item, index) => {
        // For no-repeat mode, an item is considered rolled if it has a roll count > 0
        const isRolled = currentRollStyle === 'noRepeat' && (rollCounts[index] || 0) > 0;
        
        return { 
          item, 
          index, 
          startIndex: index, 
          endIndex: index,
          isRolled,
          rollCount: rollCounts[index] || 0,
          rolledIndices: isRolled ? [index] : []
        };
      });
    }

    const condensedItems = [];
    let currentGroup = null;

    table.items.forEach((item, index) => {
      // For all modes, we need to consider the item text
      if (!currentGroup) {
        // Start a new group
        currentGroup = { 
          item, 
          index, 
          startIndex: index, 
          endIndex: index,
          rollCount: rollCounts[index] || 0,
          rolledIndices: rollCounts[index] > 0 ? [index] : []
        };
      } else if (currentGroup.item === item) {
        // Extend the current group
        currentGroup.endIndex = index;
        // Add to the total roll count for this group
        currentGroup.rollCount += (rollCounts[index] || 0);
        // Track which indices in the group have been rolled (for noRepeat mode)
        if (rollCounts[index] > 0) {
          currentGroup.rolledIndices.push(index);
        }
      } else {
        // End the current group and start a new one
        condensedItems.push(currentGroup);
        currentGroup = { 
          item, 
          index, 
          startIndex: index, 
          endIndex: index,
          rollCount: rollCounts[index] || 0,
          rolledIndices: rollCounts[index] > 0 ? [index] : []
        };
      }
    });

    // Add the last group
    if (currentGroup) {
      condensedItems.push(currentGroup);
    }

    return condensedItems;
  }, [table, condensed, currentRollStyle, rollCounts]);

  // Calculate the total number of items that have been rolled in noRepeat mode
  const getTotalRolledItems = useCallback(() => {
    if (!table || !table.items || currentRollStyle !== 'noRepeat') {
      return 0;
    }
    
    return Object.values(rollCounts).filter(count => count > 0).length;
  }, [table, rollCounts, currentRollStyle]);

  return (
    <div className="roll-mode" data-testid="roll-mode">
      <h2 data-testid="roll-table-title">{TEXT.roll.title}</h2>
      <div className="roll-controls" data-testid="roll-controls">
        <div className="roll-controls-group">
          <select 
            value={currentRollStyle} 
            onChange={(e) => handleStyleChange(e.target.value)}
            data-testid="roll-style-select"
          >
            <option value="normal" data-testid="roll-style-normal">{TEXT.roll.styles.normal}</option>
            <option value="weighted" data-testid="roll-style-weighted">{TEXT.roll.styles.weighted}</option>
            <option value="noRepeat" data-testid="roll-style-no-repeat">{TEXT.roll.styles.noRepeat}</option>
          </select>
          <button onClick={handleResetHistory} data-testid="reset-history-button">
            <i className="fas fa-history"></i> {TEXT.roll.resetButton}
          </button>
          <label className="condense-option" title={TEXT.roll.condenseOption.tooltip}>
            <input 
              type="checkbox" 
              checked={condensed} 
              onChange={handleToggleCondense} 
              data-testid="condense-checkbox"
            />
            {TEXT.roll.condenseOption.label}
          </label>
        </div>
      </div>
      
      {currentRoll && (
        <div className="roll-result" data-testid="roll-result">
          <div className="result-container">
            <p>{TEXT.roll.rolledPrefix} {currentRoll}</p>
            <button 
              className="copy-button" 
              onClick={handleCopyResult} 
              title={TEXT.roll.copyTooltip}
              data-testid="copy-button"
            >
              <i className="fas fa-copy"></i>
            </button>
          </div>
        </div>
      )}
      
      {currentRollStyle === 'noRepeat' && (
        <div className="roll-progress">
          <span className="roll-progress-text">
            {TEXT.roll.noRepeatCount.format.replace('{rolled}', getTotalRolledItems()).replace('{total}', table?.items?.length || 0)}
          </span>
          <div className="roll-progress-bar">
            <div 
              className="roll-progress-fill" 
              style={{ width: `${table?.items?.length ? (getTotalRolledItems() / table.items.length) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="roll-table" ref={tableContainerRef} data-testid="roll-table-container">
        <table>
          <tbody>
            {getCondensedItems().map((item) => {
              const isHighlighted = rolledIndex !== null && item.startIndex <= rolledIndex && rolledIndex <= item.endIndex;
              const isCondensed = item.startIndex !== item.endIndex;
              const itemCount = item.endIndex - item.startIndex + 1;
              const rolledCount = item.rolledIndices?.length || 0;
              
              // For noRepeat mode, an item is considered rolled if any of its indices have been rolled
              // or if the isRolled flag is set (for non-condensed view)
              const isRolled = currentRollStyle === 'noRepeat' && (rolledCount > 0 || item.isRolled);
              
              return (
                <tr 
                  key={item.startIndex} 
                  className={`
                    ${isHighlighted ? 'highlighted' : ''}
                    ${isRolled && !isCondensed ? 'rolled' : ''}
                  `}
                  ref={isHighlighted ? highlightedRowRef : null}
                  data-testid={`roll-table-row-${item.startIndex}`}
                >
                  <td data-testid={`roll-table-item-${item.startIndex}`}>
                    {isCondensed ? `${item.startIndex + 1}-${item.endIndex + 1}` : (item.startIndex + 1)}
                  </td>
                  <td className={isRolled ? 'rolled-text' : ''}>
                    {item.item}
                    {/* Show counts for weighted mode */}
                    {currentRollStyle === 'weighted' && item.rollCount > 0 && (
                      <span className="roll-count" data-testid={`roll-count-${item.startIndex}`}>
                        ({item.rollCount} {item.rollCount === 1 ? TEXT.roll.rollCount.singular : TEXT.roll.rollCount.plural})
                      </span>
                    )}
                    
                    {/* For condensed items in noRepeat mode, show how many are rolled */}
                    {currentRollStyle === 'noRepeat' && isCondensed && (
                      <span className="roll-count" data-testid={`roll-count-${item.startIndex}`}>
                        ({rolledCount}/{itemCount} rolled)
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
        data-testid="floating-roll-button"
      >
        <img src={process.env.PUBLIC_URL + "/logo.svg"} alt="d20 dice" className="roll-icon-svg" />
        <span className="roll-text">{allItemsRolled ? TEXT.roll.floatingButton.done : TEXT.roll.floatingButton.roll}</span>
      </button>
    </div>
  );
};

export default RollMode;
