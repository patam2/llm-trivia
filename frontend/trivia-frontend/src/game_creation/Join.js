import { useState } from 'react';
import { useNavigate } from 'react-router-dom';



function PlayerNameSelectionComponent() {
    return (
        <div>
            <input placeholder="Your name" className='form-control text-center mb-1' type='text' id='playerName' name='playerName' />
        </div>
    )
  }
  


function JoinGameComponent() {
  const navigate = useNavigate();
  function JoinGame(event, code){
    console.log('Joining game with code:', code);
    event.preventDefault();
    var playerName = document.getElementById('playerName').value;
    const data = {
        playerName: playerName
    };
    fetch(`/api/v1/rooms/join/${code}`, {
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
            <input className='form-control text-center mb-1 rounded-top' type='text' name='gameCode' onInput={CheckCodeValidity} placeholder='Game code'/>
        </div>
        {gameCode && <PlayerNameSelectionComponent />}
        <div>
          <button id='joinbtn' onClick={(event) => JoinGame(event, gameCode)} type='submit' className="w-100 rounded fs-3 bg-warning-subtle text-black" value=''  >Join!</button>
        </div>
      </form>
    </div>
  );
}

export default JoinGameComponent;