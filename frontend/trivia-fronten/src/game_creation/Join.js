import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



function PlayerNameSelectionComponent() {
    return (
      <>
        <div>
          <label>Player name:
            <input type='text' id='playerName' name='playerName' />
         </label>
        </div>
      </>
    )
  }
  


function JoinGameComponent() {
  const navigate = useNavigate();
  function JoinGame(event, code){
    
    event.preventDefault();
    var playerName = document.getElementById('playerName').value;
    const data = {
        playerName: playerName
    };
    fetch(`http://localhost:8000/api/v1/rooms/join/${code}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        //data = JSON.parse(data);
        console.log(data);
        localStorage.setItem('gameId', data.roomId);
        localStorage.setItem('playerData', JSON.stringify(data.player));
        navigate('/game/' + data.roomId);
      }
    )
  }

  const [gameCode, setGameCode] = useState('');

  function CheckCodeValidity(event) {

    const code = event.target.value;
    if (code.length === 6) {
      fetch(`http://localhost:8000/api/v1/rooms/validity/${code}`)
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            setGameCode(code);
          } else {
            setGameCode('');
          }
        })
    } else {
      setGameCode('');
    }
  }
  return (
    <div>
      <form>
        <div>
          <label>Game code:
            <input type='text' name='gameCode' onInput={CheckCodeValidity}/>
          </label>
        </div>
        {gameCode && <PlayerNameSelectionComponent />}
        <div>
          <button onClick={(event) => JoinGame(event, gameCode)} type='submit' className="btn btn-primary" value=''>Join!</button>
        </div>
      </form>
    </div>
  );
}

export default JoinGameComponent;