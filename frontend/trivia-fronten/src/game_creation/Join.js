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
            document.getElementById('joinbtn').disabled = false;
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
          <label className='rounded-top bg-warning-subtle w-100 p-2 text-center fs-3'>Game code:          </label>

            <div><input type='text' name='gameCode' onInput={CheckCodeValidity}/></div>
        </div>
        {gameCode && <PlayerNameSelectionComponent />}
        <div>
          <button id='joinbtn' onClick={(event) => JoinGame(event, gameCode)} type='submit' className="w-100 rounded-bottom fs-3 bg-warning-subtle text-black" value='' disabled>Join!</button>
        </div>
      </form>
    </div>
  );
}

export default JoinGameComponent;