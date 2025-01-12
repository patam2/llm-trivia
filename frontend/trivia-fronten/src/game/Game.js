import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWebsocket } from '../utils/websocket';
import { LobbyGrid, GameGrid } from './GameGrid';


export default function Game () {
    const [roomData, setRoomData] = useState(null);
    const [questionData, setQuestionData] = useState(null);
    const [answerData, setAnswerData] = useState("");

    const { roomId } = useParams();
    var player_data = JSON.parse(localStorage.getItem('playerData'));
    const { gameState, isConnected, playerData, sendMessage } = useWebsocket(roomId, player_data.id, setRoomData, setQuestionData, setAnswerData);

    const StartGame = () => {
        console.log('Game started');

        sendMessage({
            'type': 'start_game',
            'data': null
        });
    }

    const EntireGame = () => {
        return (
            <div>
                <div className='sticky-top bg-dark text-light p-2 d-flex align-items-center position-relative'>
                    <div className='d-none d-sm-block  position-absolute start-0 mx-2 ps-3"'>
                        <h4 className='m-0'>Code: {roomData.code}</h4>
                    </div>
                    <div className='mx-auto mb-0 m-0'>
                        <h4 className='m-0'>Players: {roomData.players.length}</h4>
                    </div>
                    <div className='d-none d-sm-block position-absolute text-end end-0 mx-2 pe-3"'>
                        <h4 className='m-0'>Host: {roomData.players[0].name}</h4>
                    </div>
                </div>
                <div className='container text-center'>
                    <div className=''>
                        <h4>{answerData}</h4>
                        <div>
                            <LobbyGrid playerData={roomData.players} roomData={roomData} />
                            {(gameState && questionData) && <GameGrid questionTitle={questionData.question} questionChoices={questionData.answers} sendWebsocket={sendMessage} />}
                        </div>
                        
                        {(player_data.is_host && !gameState) && <div>
                            <button type="button" onClick={StartGame} className='btn btn-primary'>Start Game</button>
                        </div>}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            {roomData ?
                <EntireGame/>: null}
        </>
    );
 }