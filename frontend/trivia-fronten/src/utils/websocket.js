import { useEffect, useRef, useState } from 'react';



export const useWebsocket = (roomId, playerId) => {
    const ws = useRef(WebSocket);
    const [gameState, setGameState] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    
    useEffect(() => {
        const connectWebsocket = () => {
            ws.current = new WebSocket(`ws://localhost:8000/ws/game/${roomId}/${playerId}`);

            ws.current.onopen = () => {
                setIsConnected(true);
            }

            ws.current.onmessage = (event) => {
                const message = JSON.parse(event.data);

                switch (message.type) {
                    case 'game_state':
                        setGameState(true);
                        break;
                    case 'question':
                        //
                        break;
                    case 'answer':
                        //
                        break;
                }
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