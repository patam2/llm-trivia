import { useEffect, useRef, useState } from 'react';

var example_msg = {
    type: 'game_started',
    data: null
};

var example_sent_msg = {
    from: 'player',
    type: 'start_game',
    data: null
};


export const useWebsocket = (roomId, playerId, setRoomData, setQuestionData, setAnswerData) => {
    const ws = useRef(WebSocket);
    const [gameState, setGameState] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [playerData, setPlayerData] = useState(null);
    
    useEffect(() => {
        const connectWebsocket = () => {
            ws.current = new WebSocket(`ws://localhost:8000/api/v1/ws/game/${roomId}/${playerId}`);

            ws.current.onopen = () => {
                setIsConnected(true);
            }

            ws.current.onmessage = (event) => {
                const message = JSON.parse(event.data);

                switch (message.type) {
                    case 'game_started':
                        setGameState(true);
                        break;
                    case 'question':
                        setQuestionData(message.data);
                        break;
                    case 'results':
                        setAnswerData(message.data);
                        break;
                    case 'player_data':

                    case 'room_info':
                        console.log(message.data);

                        setRoomData(message.data);
                        break;
                }
            }

            ws.current.onclose = () => {
                setIsConnected(false);
            }
        }
        connectWebsocket();
        return () => {ws.current.close()};

    }, [roomId, playerId]);
    const sendMessage = (message) => {
        ws.current.send(JSON.stringify(message));
    }
    return {gameState, isConnected, playerData, sendMessage};
}