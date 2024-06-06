import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Retro Game Simulator in JavaScript</h1>
      <ul>
        <li>
          <Link to="/pong">Pong</Link>
        </li>
        <li>
          <Link to="/2048">2048</Link>
        </li>
        <li>
          <Link to="/snake">Snake</Link>
        </li>
        <li>
          <Link to="/minesweeper">Minesweeper</Link>
        </li>
      </ul>
    </div>
  );
};

export default Home;
