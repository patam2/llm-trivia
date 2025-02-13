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


export const useWebsocket = (roomId, playerId, setRoomData, setQuestionData, setAnswerData, setPlayerData) => {
    const ws = useRef(WebSocket);
    const [gameState, setGameState] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const connectWebsocket = () => {
            ws.current = new WebSocket(`ws://localhost:8000/api/v1/ws/game/${roomId}/${playerId}`);

            ws.current.onopen = () => {
                setIsConnected(true);
            }

            ws.current.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log("Websocket message:", message);
                switch (message.type) {
                    case 'game_started':
                        setGameState(true);
                        break;
                    case 'question':
                        setGameState(true);
                        setQuestionData(message.data);
                        break;
                    case 'results':
                        setAnswerData(message.data);
                        break;
                    case 'player_data':
                        setPlayerData(message.data);
                        break;
                    case 'room_info':
                        setRoomData(message.data);
                        break;
                    case 'game_over':
                        setGameState(false);
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
    return {gameState, isConnected, sendMessage};
}