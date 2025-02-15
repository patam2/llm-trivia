import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function CreateGameComponent () {
    const navigate = useNavigate();
    function CreateGame(event) {
        event.preventDefault();
        console.log(event.target);
        const numQuestions = document.getElementById('qNum').value;
        const topic = document.getElementById('topic').value;
        const hostName = document.getElementById('name').value;
        const data = {
          numQuestions: numQuestions,
          topic: topic,
          hostName: hostName
        };
        fetch('http://localhost:8000/api/v1/rooms/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
          .then(response => response.json())
          .then(data => {
            data= JSON.parse(data);
            localStorage.setItem('gameCode', data.code);
            localStorage.setItem('gameId', data.id);
            localStorage.setItem('playerData', JSON.stringify(data.players[0]));
            navigate('/game/' + data.id);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
    }
    return (
        <div>
          <form>
            <div>
                <label>Number of questions:
                    <input type='number' id="qNum" name='numQuestions' autocomplete="off" max="25" />
                </label>
            </div>
            <div>
                <label>Topic:
                    <input type='text' id="topic" name='topic' autocomplete="off"  />
                </label>
            </div>

            <div>
                <label>Your name:
                    <input type='text' id="name" name='topic' autocomplete="off"  />
                </label>
            </div>

            <div>
                <button onClick={CreateGame} type='submit' className="btn btn-primary" value=''>Create!</button>
            </div>
          </form>
        </div>
    );  
}

export default CreateGameComponent;