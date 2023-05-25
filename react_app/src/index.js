import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GameOverPlayers, GameOverMrX } from './GameOver';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/gameover/players" element={<GameOverPlayers />} />
      <Route path="/gameover/mrx" element={<GameOverMrX />} />
    </Routes>
  </Router>
);