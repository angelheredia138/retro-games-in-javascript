// src/PongGame.jsx
import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/Pong.css";

const Pong = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const [aiScore, setAiScore] = useState(0);
  const [humanScore, setHumanScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState(null);
  const [aiReactionSpeed, setAiReactionSpeed] = useState(0);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Game constants
    const canvasWidth = 800;
    const canvasHeight = 600;
    const paddleWidth = 10;
    const paddleHeight = 100;
    let ballSize = 10;
    let paddleSpeed = 3;
    let ballSpeed = 4;

    let playerY = (canvasHeight - paddleHeight) / 2;
    let aiY = (canvasHeight - paddleHeight) / 2;
    let ballX = canvasWidth / 2;
    let ballY = canvasHeight / 2;
    let ballVelocityX = ballSpeed;
    let ballVelocityY = ballSpeed;
    let aiDirection = 1;

    const draw = () => {
      // Clear the canvas
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      // Draw player paddle
      context.fillStyle = "white";
      context.fillRect(0, playerY, paddleWidth, paddleHeight);

      // Draw AI paddle
      context.fillStyle = "white";
      context.fillRect(
        canvasWidth - paddleWidth,
        aiY,
        paddleWidth,
        paddleHeight
      );

      // Draw ball
      context.fillStyle = "white";
      context.fillRect(ballX, ballY, ballSize, ballSize);
    };

    const update = () => {
      ballX += ballVelocityX;
      ballY += ballVelocityY;

      // Ball collision with top and bottom walls
      if (ballY <= 0 || ballY + ballSize >= canvasHeight) {
        ballVelocityY = -ballVelocityY;
      }

      // Ball collision with player paddle
      if (
        ballX <= paddleWidth &&
        ballY + ballSize >= playerY &&
        ballY <= playerY + paddleHeight
      ) {
        ballVelocityX = -ballVelocityX;
      }

      // Ball collision with AI paddle
      if (
        ballX + ballSize >= canvasWidth - paddleWidth &&
        ballY + ballSize >= aiY &&
        ballY <= aiY + paddleHeight
      ) {
        ballVelocityX = -ballVelocityX;
      }

      // Ball out of bounds
      if (ballX <= 0) {
        setAiScore((prevScore) => {
          const newScore = prevScore + 1;
          if (newScore >= 20) {
            setWinner("AI Wins!");
            ballVelocityX = 0;
            ballVelocityY = 0;
            paddleSpeed = 0;
            ballSpeed = 0;
            setGameStarted(false);
          }
          return newScore;
        });
        resetBall("human");
      } else if (ballX + ballSize >= canvasWidth) {
        setHumanScore((prevScore) => {
          const newScore = prevScore + 1;
          if (newScore >= 20) {
            setWinner("Human Wins!");
            ballVelocityX = 0;
            ballVelocityY = 0;
            paddleSpeed = 0;
            ballSpeed = 0;
            setGameStarted(false);
          }
          return newScore;
        });
        resetBall("ai");
      }

      // Hybrid AI paddle movement
      // Constant speed component
      aiY += aiDirection * paddleSpeed;
      if (aiY <= 0 || aiY + paddleHeight >= canvasHeight) {
        aiDirection *= -1; // Change direction when hitting the top or bottom
      }
      // Position adjustment component
      if (ballVelocityX > 0 && ballX > canvasWidth / 2) {
        // Only adjust when ball is moving towards AI
        if (ballY < aiY + paddleHeight / 2) {
          aiY -= aiReactionSpeed; // Adjust reaction speed based on difficulty
        } else if (ballY > aiY + paddleHeight / 2) {
          aiY += aiReactionSpeed; // Adjust reaction speed based on difficulty
        }
      }

      // Update player paddle position based on mouse movement
      const updatePlayerPosition = (event) => {
        const rect = canvas.getBoundingClientRect();
        playerY = event.clientY - rect.top - paddleHeight / 2;

        // Ensure the paddle stays within the canvas bounds
        if (playerY < 0) playerY = 0;
        if (playerY + paddleHeight > canvasHeight)
          playerY = canvasHeight - paddleHeight;
      };

      canvas.addEventListener("mousemove", updatePlayerPosition);
      draw();
    };

    const resetBall = (lastLoser) => {
      ballX = canvasWidth / 2;
      ballY = canvasHeight / 2;
      if (lastLoser === "ai") {
        ballVelocityX = ballSpeed; // Serve to AI
      } else if (lastLoser === "human") {
        ballVelocityX = -ballSpeed; // Serve to Human
      } else {
        ballVelocityX = ballSpeed * (Math.random() > 0.5 ? 1 : -1); // Randomize initial direction
      }
      ballVelocityY = (Math.random() - 0.5) * ballSpeed * 2;
    };

    const gameLoop = () => {
      if (!gameStarted) return;
      update();
      requestAnimationFrame(gameLoop);
    };

    if (gameStarted) {
      gameLoop();
    }
  }, [gameStarted, aiReactionSpeed]);

  const handleStart = () => {
    setAiScore(0);
    setHumanScore(0);
    setWinner(null);
    setGameStarted(true);
  };

  const handleDifficultySelect = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    switch (selectedDifficulty) {
      case "easy":
        setAiReactionSpeed(1);
        break;
      case "medium":
        setAiReactionSpeed(5);
        break;
      case "hard":
        setAiReactionSpeed(8);
        break;
      default:
        setAiReactionSpeed(1);
        break;
    }
    handleStart();
  };

  return (
    <div className="pong-container">
      {!gameStarted && winner && (
        <div className="winner-screen">
          <h2>{winner}</h2>
          <button onClick={handleStart}>Start Game</button>
          <div className="difficulty-selection">
            <button onClick={() => handleDifficultySelect("easy")}>Easy</button>
            <button onClick={() => handleDifficultySelect("medium")}>
              Medium
            </button>
            <button onClick={() => handleDifficultySelect("hard")}>Hard</button>
          </div>
        </div>
      )}
      <button onClick={() => navigate("/")}>Back to Home</button>
      <h2>Pong</h2>
      <h3>
        Game ends at 20 points (if the game starts lagging, try refreshing!)
      </h3>
      <h4>
        Score: Human {humanScore} - AI {aiScore}
      </h4>
      <canvas
        ref={canvasRef}
        width="800"
        height="600"
        style={{ border: "1px solid white" }}
      />
      {!gameStarted && !winner && (
        <div className="difficulty-selection">
          <h2>Select Difficulty</h2>
          <button onClick={() => handleDifficultySelect("easy")}>Easy</button>
          <button onClick={() => handleDifficultySelect("medium")}>
            Medium
          </button>
          <button onClick={() => handleDifficultySelect("hard")}>Hard</button>
        </div>
      )}
    </div>
  );
};

export default Pong;
