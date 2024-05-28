import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Pong.css';


const Pong = () => {
  const navigate = useNavigate();

  return (
    <div className="pong-container">
      <h2>Pong Placeholder</h2>
      <button onClick={() => navigate('/')}>Back to Home</button>
    </div>
  );
};

export default Pong;
