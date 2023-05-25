import React from 'react';

import './StartScreen.css';

const StartScreen = () => {
  localStorage.setItem('elementPosition', JSON.stringify({x: 0, y: 0}));
  
  return (
    <div className="StartScreen">
      <h1>Scotland Yard</h1>
	  <button onClick={() => window.location.href = "/game"}>New Game</button>
	  {/* <button onClick={() => window.location.href = "/load"}>Load Game</button> */}
	  <button onClick={() => window.location.href = "/howtoplay"}>How To Play</button>
	  {/* <button onClick={() => window.location.href = "/options"}>Options</button> */}
	  <button onClick={() => window.location.href = "/about"}>About</button>
    </div>
  );
};

export default StartScreen;