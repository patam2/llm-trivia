import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWebsocket } from '../utils/websocket';


export default function Game () {
    const { roomId } = useParams();

    var player_data = JSON.parse(localStorage.getItem('playerData'));

    return (
        <div>
            <h1>Game</h1>
            <h3>Welcome here, {player_data.name}</h3>
        </div>
    );
 }