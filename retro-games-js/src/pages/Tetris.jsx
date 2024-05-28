import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Tetris.css';


const Tetris = () => {
  const navigate = useNavigate();

  return (
    <div className="tetris-container">
      <h2>Tetris Placeholder</h2>
      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
};

export default Tetris;
