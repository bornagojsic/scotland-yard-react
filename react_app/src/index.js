import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import './index.css';
import About from './About/About';
import Game from './Game/Game';
import GameOver from './GameOverScreen/GameOver';
import HowToPlay from './HowToPlay/HowToPlay';
import StartScreen from './StartScreen/StartScreen';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/game" element={<Game />} />
      <Route path="/about" element={<About />} />
      <Route path="/howtoplay" element={<HowToPlay />} />
      <Route path="/gameover" element={<GameOver />} />
    </Routes>
  </Router>
);