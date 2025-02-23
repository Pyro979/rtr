import React from 'react';
import { rollOnTable } from '../utils/tableUtils';
import './RollMode.css';

const RollMode = ({ table, rollStyle, rollHistory, onRoll, onResetHistory }) => {
  const handleRoll = () => {
    const result = rollOnTable(table, rollStyle, rollHistory[table.id]);
    
    if (!result) {
      // All items have been rolled in noRepeat mode
      onResetHistory(table.id);
      handleRoll();
      return;
    }

    onRoll(table.id, result.index, result.result);
  };

  return (
    <div className="roll-mode">
      <h3>{table.name}</h3>
      <div className="roll-controls">
        <select 
          value={rollStyle} 
          onChange={(e) => onRoll(table.id, null, null, e.target.value)}
        >
          <option value="normal">Normal Roll</option>
          <option value="weighted">Weighted (Less Common Repeats)</option>
          <option value="noRepeat">No Repeats</option>
        </select>
        <button onClick={handleRoll}>Roll</button>
        <button onClick={() => onResetHistory(table.id)}>Reset Memory</button>
      </div>
      <div className="roll-result">
        {rollHistory.lastResult && <p>{rollHistory.lastResult}</p>}
      </div>
    </div>
  );
};

export default RollMode;
