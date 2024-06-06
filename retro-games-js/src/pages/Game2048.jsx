import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Game2048.css";

const Game2048 = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const gridSize = 4;
  const cellSize = 100;

  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const canvasWidth = gridSize * cellSize;
    const canvasHeight = gridSize * cellSize;

    // Set the canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Function to draw the grid
    const drawGrid = () => {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.strokeStyle = "white";
      for (let i = 0; i <= gridSize; i++) {
        context.beginPath();
        context.moveTo(i * cellSize, 0);
        context.lineTo(i * cellSize, canvasHeight);
        context.stroke();
        context.beginPath();
        context.moveTo(0, i * cellSize);
        context.lineTo(canvasWidth, i * cellSize);
        context.stroke();
      }
    };

    // Function to draw the pixel with a number
    const drawPixel = () => {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      drawGrid();
      context.fillStyle = "white";
      context.fillRect(
        position.x * cellSize,
        position.y * cellSize,
        cellSize,
        cellSize
      );
      context.fillStyle = "black";
      context.font = "30px Arial";
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(
        "2",
        position.x * cellSize + cellSize / 2,
        position.y * cellSize + cellSize / 2
      );
    };

    // Function to handle key press
    const handleKeyDown = (event) => {
      setPosition((prev) => {
        let newX = prev.x;
        let newY = prev.y;
        switch (event.key) {
          case "w":
            newY = Math.max(prev.y - 1, 0);
            break;
          case "a":
            newX = Math.max(prev.x - 1, 0);
            break;
          case "s":
            newY = Math.min(prev.y + 1, gridSize - 1);
            break;
          case "d":
            newX = Math.min(prev.x + 1, gridSize - 1);
            break;
          default:
            break;
        }
        return { x: newX, y: newY };
      });
    };

    // Add event listener for keydown
    window.addEventListener("keydown", handleKeyDown);

    // Draw the initial grid and pixel
    drawPixel();

    // Redraw the grid and pixel whenever the position changes
    const draw = () => {
      drawPixel();
    };

    draw();

    // Cleanup event listener
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [position]);

  return (
    <div className="game2048-container">
      <h2>2048</h2>
      <canvas
        ref={canvasRef}
        width={gridSize * cellSize}
        height={gridSize * cellSize}
        style={{ border: "1px solid white" }}
      />
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default Game2048;
