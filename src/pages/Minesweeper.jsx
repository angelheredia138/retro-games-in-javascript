// src/Minesweeper.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Minesweeper.css";

const Minesweeper = () => {
  const navigate = useNavigate();
  const [grid, setGrid] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);

  const handleStartGame = (rows, cols, minesPlaced) => {
    setGrid(createEmptyGrid(rows, cols, minesPlaced));
    setIsGameOver(false);
    setIsWin(false);
  };

  const handleClick = (row, col) => {
    if (isGameOver || grid[row][col].isFlagged) return;

    if (grid[row][col].isMine) {
      revealAllMines();
      setIsGameOver(true);
    } else {
      // Reveal cells recursively
      setGrid((prevGrid) => {
        const newGrid = [...prevGrid];
        revealCells(newGrid, row, col);
        if (checkWin(newGrid)) {
          setIsGameOver(true);
          setIsWin(true);
        }
        return newGrid;
      });
    }
  };

  const handleRightClick = (event, row, col) => {
    event.preventDefault(); // Prevent the default context menu
    if (isGameOver || grid[row][col].isRevealed) return;

    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged;
      return newGrid;
    });
  };

  const revealAllMines = () => {
    setGrid((prevGrid) => {
      const newGrid = prevGrid.map((row) =>
        row.map((cell) => ({
          ...cell,
          isRevealed: cell.isMine || cell.isRevealed,
        }))
      );
      return newGrid;
    });
  };

  const checkWin = (grid) => {
    for (let row of grid) {
      for (let cell of row) {
        if (!cell.isMine && !cell.isRevealed) {
          return false;
        }
      }
    }
    return true;
  };

  return (
    <div className="minesweeper-container">
      <button onClick={() => navigate("/")}>Back to Home</button>
      {!grid && (
        <div className="difficulty-selection">
          <h2>Select Difficulty</h2>
          <button onClick={() => handleStartGame(8, 8, 10)}>Easy</button>
          <button onClick={() => handleStartGame(9, 9, 10)}>Medium</button>
          <button onClick={() => handleStartGame(10, 10, 10)}>Hard</button>
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
                  className={`cell ${cell.isRevealed ? "revealed" : ""}`}
                  onClick={() => handleClick(rowIndex, colIndex)}
                  onContextMenu={(event) =>
                    handleRightClick(event, rowIndex, colIndex)
                  }
                >
                  {cell.isRevealed &&
                    (cell.isMine
                      ? "💣"
                      : cell.adjacentMines > 0
                      ? cell.adjacentMines
                      : "")}
                  {cell.isFlagged && !cell.isRevealed && "🚩"}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
      {(isGameOver || isWin) && (
        <div className="game-over">
          <h2>{isWin ? "You Win!" : "Game Over"}</h2>
          <button
            onClick={() =>
              handleStartGame(
                grid.length,
                grid[0].length,
                grid.flat().filter((cell) => cell.isMine).length
              )
            }
          >
            Restart
          </button>
          {isWin && (
            <div>
              <button onClick={() => handleStartGame(8, 8, 10)}>
                Try Easy
              </button>
              <button onClick={() => handleStartGame(9, 9, 10)}>
                Try Medium
              </button>
              <button onClick={() => handleStartGame(10, 10, 10)}>
                Try Hard
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const createEmptyGrid = (rows, cols, minesCount) => {
  const grid = [];
  for (let i = 0; i < rows; i++) {
    grid.push(
      Array(cols)
        .fill()
        .map(() => ({
          isMine: false,
          isRevealed: false,
          isFlagged: false,
          adjacentMines: 0,
        }))
    );
  }

  // Randomly place mines
  let minesPlaced = 0;
  var count = 0;
  while (minesPlaced < minesCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    count++;
    if (!grid[row][col].isMine) {
      console.log(`bomb ${count} placed: (${col}, ${row})`);
      grid[row][col].isMine = true;
      minesPlaced++;
    }
  }

  return grid;
};

const countAdjacentMines = (grid, row, col) => {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  let count = 0;
  for (let [dx, dy] of directions) {
    const newRow = row + dx;
    const newCol = col + dy;
    if (
      newRow >= 0 &&
      newRow < grid.length &&
      newCol >= 0 &&
      newCol < grid[0].length &&
      grid[newRow][newCol].isMine
    ) {
      count++;
    }
  }

  return count;
};

const revealCells = (grid, row, col) => {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  const stack = [[row, col]];
  while (stack.length) {
    const [currentRow, currentCol] = stack.pop();
    if (grid[currentRow][currentCol].isRevealed) continue;

    grid[currentRow][currentCol].isRevealed = true;
    const adjacentMines = countAdjacentMines(grid, currentRow, currentCol);
    grid[currentRow][currentCol].adjacentMines = adjacentMines;

    if (adjacentMines === 0) {
      for (let [dx, dy] of directions) {
        const newRow = currentRow + dx;
        const newCol = currentCol + dy;
        if (
          newRow >= 0 &&
          newRow < grid.length &&
          newCol >= 0 &&
          newCol < grid[0].length &&
          !grid[newRow][newCol].isRevealed
        ) {
          stack.push([newRow, newCol]);
        }
      }
    }
  }
};

export default Minesweeper;
