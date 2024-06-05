import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/Snake.css";

const Snake = () => {
  const navigate = useNavigate();

  return (
    <div className="snake-container">
      <h2>Snake Placeholder</h2>
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default Snake;
