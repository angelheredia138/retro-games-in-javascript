import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Snake.css";

const Snake = () => {
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [snake, setSnake] = useState([{ x: 400, y: 300 }]);
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [nextDirection, setNextDirection] = useState({ x: 0, y: 0 });
  const [foodPosition, setFoodPosition] = useState({ x: 0, y: 0 });
  const [foodDrawn, setFoodDrawn] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [foodCount, setFoodCount] = useState(0);
  const [gameWin, setGameWin] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const canvasWidth = 800;
    const canvasHeight = 600;

    // Set the canvas dimensions
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Function to draw a pixel
    const drawPixel = (x, y, color) => {
      context.fillStyle = color;
      context.fillRect(x, y, 10, 10);
      context.strokeStyle = "black";
      context.strokeRect(x, y, 10, 10);
    };

    // Function to generate random food position
    const generateFoodPosition = () => {
      let x, y;
      do {
        x = Math.floor(Math.random() * (canvasWidth / 10)) * 10;
        y = Math.floor(Math.random() * (canvasHeight / 10)) * 10;
      } while (snake.some((segment) => segment.x === x && segment.y === y));
      setFoodPosition({ x, y });
    };

    // Function to update the position
    const updatePosition = () => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        // Apply the next direction
        head.x += nextDirection.x * 10;
        head.y += nextDirection.y * 10;

        // Check for collisions with walls
        if (
          head.x < 0 ||
          head.x >= canvasWidth ||
          head.y < 0 ||
          head.y >= canvasHeight
        ) {
          drawPixel(head.x, head.y, "white"); // Draw final position
          setTimeout(() => setGameOver(true), 30); // Show the final frame before game over
          return prevSnake;
        }

        // Check for collisions with itself (ignore current head position)
        if (
          newSnake
            .slice(1)
            .some((segment) => segment.x === head.x && segment.y === head.y)
        ) {
          drawPixel(head.x, head.y, "white"); // Draw final position
          setTimeout(() => setGameOver(true), 30); // Show the final frame before game over
          return prevSnake;
        }

        newSnake.unshift(head);
        if (head.x === foodPosition.x && head.y === foodPosition.y) {
          setFoodCount((prevCount) => {
            const newCount = prevCount + 1;
            if (newCount >= 100) {
              setGameWin(true);
              setGameOver(true);
            }
            return newCount;
          });
          generateFoodPosition();
        } else {
          newSnake.pop();
        }

        // Update the current direction after moving
        setDirection(nextDirection);

        return newSnake;
      });
    };

    // Function to handle key press
    const handleKeyDown = (event) => {
      if (gameOver) return; // Prevent movement when the game is over
      if (event.key === "Escape") {
        setPaused((prevPaused) => !prevPaused);
        return;
      }
      if (paused) return; // Prevent movement when the game is paused

      const newDirection = { ...direction };
      switch (event.key) {
        case "w":
          if (direction.y === 0) setNextDirection({ x: 0, y: -1 });
          break;
        case "a":
          if (direction.x === 0) setNextDirection({ x: -1, y: 0 });
          break;
        case "s":
          if (direction.y === 0) setNextDirection({ x: 0, y: 1 });
          break;
        case "d":
          if (direction.x === 0) setNextDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    // Add event listener for keydown
    window.addEventListener("keydown", handleKeyDown);

    // Set interval to update position
    const intervalId = setInterval(() => {
      if (!gameOver && !paused) {
        updatePosition();
      }
    }, 30); // Adjust the interval time as needed

    // Generate initial food position
    if (!foodDrawn) {
      generateFoodPosition();
      setFoodDrawn(true);
    }

    // Draw the initial state
    const draw = () => {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      snake.forEach((segment) => drawPixel(segment.x, segment.y, "white"));
      drawPixel(foodPosition.x, foodPosition.y, "red");
    };

    draw();

    // Cleanup event listener and interval
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(intervalId);
    };
  }, [nextDirection, foodDrawn, snake, foodPosition, gameOver, paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const canvasWidth = 800;
    const canvasHeight = 600;

    // Function to draw a pixel
    const drawPixel = (x, y, color) => {
      context.fillStyle = color;
      context.fillRect(x, y, 10, 10);
      context.strokeStyle = "black";
      context.strokeRect(x, y, 10, 10);
    };

    const draw = () => {
      context.clearRect(0, 0, canvasWidth, canvasHeight);
      snake.forEach((segment) => drawPixel(segment.x, segment.y, "white"));
      drawPixel(foodPosition.x, foodPosition.y, "red");
    };

    draw();
  }, [snake, foodPosition]);

  const handleRestart = () => {
    setSnake([{ x: 400, y: 300 }]);
    setDirection({ x: 0, y: 0 });
    setNextDirection({ x: 0, y: 0 });
    setFoodDrawn(false);
    setGameOver(false);
    setPaused(false);
    setFoodCount(0);
    setGameWin(false);
  };

  return (
    <div className="snake-container">
      <h2>Snake</h2>
      <h3>Eat 100 pellets to win!</h3>
      <h4>Press esc to pause, and WASD to move the snake!</h4>
      <canvas
        ref={canvasRef}
        width="800"
        height="600"
        style={{ border: "1px solid white" }}
      />
      {paused && <h3>Game Paused</h3>}
      {gameOver && gameWin && (
        <div className="game-win-screen">
          <h2>Game Win!</h2>
          <button onClick={handleRestart}>Restart</button>
        </div>
      )}
      {gameOver && !gameWin && (
        <div className="game-over-screen">
          <h2>Game Over</h2>
          <button onClick={handleRestart}>Restart</button>
        </div>
      )}
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default Snake;
