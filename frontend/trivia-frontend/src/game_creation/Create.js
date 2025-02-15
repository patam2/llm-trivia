import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function CreateGameComponent () {
    const [numQuestions, setNumQuestions] = useState(1);

    function setNumQuestionsEvent(event) {
        setNumQuestions(event.target.value);
    }

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
            <div >
              <input placeholder='Game topic' className='form-control text-center' type='text' id="topic" name='topic' autocomplete="off"  />
            </div>

            <div className=''>
              <label for="qNum" class="form-label d-inline-block w-100">{numQuestions} questions</label>
              <input type="range" class="form-range" id="qNum" min="1" max="25" value={numQuestions} onChange={setNumQuestionsEvent}/>

            </div>

            <div>
              <input type='text' id="name" name='topic' className="form-control text-center mb-2" placeholder='Your name' autocomplete="off"  />
            </div>

            <div>
                <button onClick={CreateGame} type='submit' className="w-100 rounded fs-3 bg-primary-subtle text-black" value=''>Create!</button>
            </div>
          </form>
        </div>
    );  
}

export default CreateGameComponent;