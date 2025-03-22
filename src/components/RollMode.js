import React, { useState, useEffect } from 'react';
import { rollOnTable } from '../utils/tableUtils';
import { TEXT } from '../constants/text';
import './RollMode.css';

const RollMode = ({ table, rollStyle, rollHistory, onRoll, onResetHistory }) => {
  // Internal state for tracking the current roll
  const [currentRoll, setCurrentRoll] = useState(null);
  // Internal state for tracking roll counts
  const [rollCounts, setRollCounts] = useState({});
  
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
    }
  }, [table, rollHistory]);

  const handleRoll = () => {
    if (!table || !table.id) return;
    
    const result = rollOnTable(table, rollStyle, rollCounts);
    if (!result) {
      // All items have been rolled in noRepeat mode
      handleResetHistory();
      handleRoll();
      return;
    }
    
    // Update local state immediately
    setCurrentRoll(result.result);
    setRollCounts(prev => ({
      ...prev,
      [result.index]: (prev[result.index] || 0) + 1
    }));
    
    // Also update parent state
    onRoll(table.id, result.index, result.result, rollStyle);
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
          value={rollStyle} 
          onChange={(e) => onRoll(table?.id, null, null, e.target.value)}
        >
          <option value="normal">Normal Roll</option>
          <option value="weighted">Weighted (Less Common Repeats)</option>
          <option value="noRepeat">No Repeats</option>
        </select>
        <button onClick={handleRoll}>{TEXT.roll.rollButton}</button>
        <button onClick={handleResetHistory}>{TEXT.roll.resetButton}</button>
      </div>
      
      {currentRoll && (
        <div className="roll-result">
          <p>Rolled: {currentRoll}</p>
        </div>
      )}
      
      <div className="roll-table">
        <table>
          <tbody>
            {table.items.map((item, index) => {
              const count = rollCounts[index] || 0;
              const isHighlighted = item === currentRoll;
              
              return (
                <tr 
                  key={index} 
                  className={isHighlighted ? 'highlighted' : ''}
                >
                  <td>{index + 1}</td>
                  <td>
                    {item}
                    {count > 0 && (
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
    </div>
  );
};

export default RollMode;
