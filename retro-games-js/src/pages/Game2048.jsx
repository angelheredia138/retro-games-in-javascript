import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Game2048.css';


const Game2048 = () => {
  const navigate = useNavigate();

  return (
    <div className="game2048-container">
      <h2>Game2048 Placeholder</h2>
      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
};

export default Game2048;
