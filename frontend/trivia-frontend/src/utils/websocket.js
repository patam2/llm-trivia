import { useEffect, useRef, useState } from 'react';


export const useWebsocket = (roomId, playerId, setRoomData, setQuestionData, setAnswerData, setPlayerData) => {
    const ws = useRef(WebSocket);
    const [gameState, setGameState] = useState("not_started");
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const connectWebsocket = () => {
            ws.current = new WebSocket(`ws://trivia.ptamm.ee:8005/ws/game/${roomId}/${playerId}`);

            ws.current.onopen = () => {
                setIsConnected(true);
            }

            ws.current.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log("Websocket message:", message);
                switch (message.type) {
                    case 'game_started':
                        setGameState("ongoing");
                        break;
                    case 'question':
                        setGameState("ongoing");
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
                    case 'game_ended':
                        setTimeout(() => {
                            setGameState("ended");
                        }, 5000);
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