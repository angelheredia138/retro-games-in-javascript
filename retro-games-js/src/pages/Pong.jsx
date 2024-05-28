// src/PongGame.jsx
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Pong.css';

const Pong = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Game constants
    const canvasWidth = 800;
    const canvasHeight = 600;
    const paddleWidth = 10;
    const paddleHeight = 100;
    const ballSize = 10;
    const paddleSpeed = 6;
    const ballSpeed = 4;

    let playerY = (canvasHeight - paddleHeight) / 2;
    let aiY = (canvasHeight - paddleHeight) / 2;
    let ballX = canvasWidth / 2;
    let ballY = canvasHeight / 2;
    let ballVelocityX = ballSpeed;
    let ballVelocityY = ballSpeed;

    const draw = () => {
      // Clear the canvas
      context.clearRect(0, 0, canvasWidth, canvasHeight);

      // Draw player paddle
      context.fillStyle = 'white';
      context.fillRect(0, playerY, paddleWidth, paddleHeight);

      // Draw AI paddle
      context.fillStyle = 'white';
      context.fillRect(canvasWidth - paddleWidth, aiY, paddleWidth, paddleHeight);

      // Draw ball
      context.fillStyle = 'white';
      context.fillRect(ballX, ballY, ballSize, ballSize);
    };

    const update = () => {
      // Move the ball
      ballX += ballVelocityX;
      ballY += ballVelocityY;

      // Ball collision with top and bottom walls
      if (ballY <= 0 || ballY + ballSize >= canvasHeight) {
        ballVelocityY = -ballVelocityY;
      }

      // Ball collision with player paddle
      if (ballX <= paddleWidth && ballY + ballSize >= playerY && ballY <= playerY + paddleHeight) {
        ballVelocityX = -ballVelocityX;
      }

      // Ball collision with AI paddle
      if (ballX + ballSize >= canvasWidth - paddleWidth && ballY + ballSize >= aiY && ballY <= aiY + paddleHeight) {
        ballVelocityX = -ballVelocityX;
      }

      // Ball out of bounds
      if (ballX <= 0) {
        setAiScore(prevScore => prevScore + 1);
        resetBall();
      } else if (ballX + ballSize >= canvasWidth) {
        setPlayerScore(prevScore => prevScore + 1);
        resetBall();
      }

      // Simple AI movement
      if (aiY + paddleHeight / 2 < ballY) {
        aiY += paddleSpeed;
      } else {
        aiY -= paddleSpeed;
      }

      // Update player paddle position based on mouse movement
      const updatePlayerPosition = (event) => {
        const rect = canvas.getBoundingClientRect();
        playerY = event.clientY - rect.top - paddleHeight / 2;

        // Ensure the paddle stays within the canvas bounds
        if (playerY < 0) playerY = 0;
        if (playerY + paddleHeight > canvasHeight) playerY = canvasHeight - paddleHeight;
      };

      canvas.addEventListener('mousemove', updatePlayerPosition);

      draw();
    };

    const resetBall = () => {
      ballX = canvasWidth / 2;
      ballY = canvasHeight / 2;
      ballVelocityX = ballSpeed * (Math.random() > 0.5 ? 1 : -1); // Randomize initial direction
      ballVelocityY = (Math.random() - 0.5) * ballSpeed * 2;
    };

    const gameLoop = () => {
      if (!gameStarted) return;
      if (playerScore >= 20 || aiScore >= 20) {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        context.fillStyle = 'white';
        context.font = '48px sans-serif';
        context.textAlign = 'center';
        context.fillText(playerScore >= 20 ? 'Player Wins!' : 'AI Wins!', canvasWidth / 2, canvasHeight / 2);
        return;
      }
      update();
      requestAnimationFrame(gameLoop);
    };

    if (gameStarted) {
      gameLoop();
    }
  }, [playerScore, aiScore, gameStarted]);

  const handleStart = () => {
    setGameStarted(true);
  };

  const handleRestart = () => {
    setPlayerScore(0);
    setAiScore(0);
    setGameStarted(false);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    resetBall();
  };

  return (
    <div className="pong-container">
      <button onClick={() => navigate('/')}>Back to Home</button>
      {!gameStarted ? (
        <button onClick={handleStart}>Start Game</button>
      ) : (
        <button onClick={handleRestart}>Restart</button>
      )}
      <h2>Pong</h2>
      <h3>Game ends at 20 points</h3>
      <h4>Score: Player {playerScore} - AI {aiScore}</h4>
      <canvas ref={canvasRef} width="800" height="600" style={{ border: '1px solid white' }} />
      
    </div>
  );
};

export default Pong;
