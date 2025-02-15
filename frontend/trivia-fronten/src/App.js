import './main.css';
import { useState, useEffect } from 'react';
import JoinGameComponent from './game_creation/Join.js';
import CreateGameComponent from './game_creation/Create.js';

function App() {
  const [displayCreateGame, setDisplayCreateGame] = useState(false);
  const [displayJoinGame, setDisplayJoinGame] = useState(false);

  const handleJoinGameClick = () => {
    setDisplayJoinGame(true);
    setDisplayCreateGame(false);
  };

  const handleCreateGameClick = () => {
    setDisplayCreateGame(true);
    setDisplayJoinGame(false);
  };

  return (
    <div className='row g-0' id='app'>
      <div id="full" onClick={handleJoinGameClick} className='align-items-center justify-content-center col-12 col-md-6 bg-primary-subtle d-flex'>
        {!displayJoinGame && <p id="joingameText" className='fs-4'>Join a game</p>}
        {displayJoinGame && <JoinGameComponent />}
      </div>
      <div id="full-2" onClick={handleCreateGameClick} className='align-items-center justify-content-center col-12 col-md-6 bg-warning-subtle d-flex'>
        {!displayCreateGame && <p className='fs-4'>Create a game</p>}
        {displayCreateGame && <CreateGameComponent />}
      </div>
    </div>
  );
}

export default App;
