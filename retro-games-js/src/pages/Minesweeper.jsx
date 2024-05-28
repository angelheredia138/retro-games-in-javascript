// src/Minesweeper.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Minesweeper.css';

const Minesweeper = () => {
    const navigate = useNavigate();
    const [grid, setGrid] = useState(null);
  
    const handleStartGame = (rows, cols) => {
      setGrid(createEmptyGrid(rows, cols));
    };
  
    const handleClick = (row, col) => {
      console.log(`Clicked on cell: (${row}, ${col})`);
      // Add your game logic here
    };
  
    return (
      <div className="minesweeper-container">
        <button onClick={() => navigate('/')}>Back to Home</button>
        {!grid && (
          <div className="difficulty-selection">
            <h2>Select Difficulty</h2>
            <button onClick={() => handleStartGame(5, 5)}>Easy</button>
            <button onClick={() => handleStartGame(7, 7)}>Medium</button>
            <button onClick={() => handleStartGame(10, 10)}>Hard</button>
          </div>
        )}
        {grid && (
          <div className="minesweeper">
            <h2>Minesweeper</h2>
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                {row.map((cell, colIndex) => (
                  <div
                    key={colIndex}
                    className="cell"
                    onClick={() => handleClick(rowIndex, colIndex)}
                  ></div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  const createEmptyGrid = (rows, cols) => {
    const grid = [];
    for (let i = 0; i < rows; i++) {
      grid.push(Array(cols).fill(null));
    }
    return grid;
  };
  
  export default Minesweeper;
