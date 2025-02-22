from typing import Dict
from fastapi import WebSocket


class WebSocketService:
    def __init__(self):
        self.rooms: Dict[str, Dict[str, WebSocket]] = {}
    
    async def connect(self, websocket, room_id, player_id):
        print(websocket.state)
        await websocket.accept()
        if room_id not in self.rooms:
            self.rooms[room_id] = {}
        self.rooms[room_id][player_id] = websocket

    async def broadcast_to_room(self, room_id, message, exclude_player_id=False):
        for player_id, ws in self.rooms[room_id].items():
            if player_id != exclude_player_id:
                await ws.send_text(message)

    async def unicast_to_player(self, room_id, player_id, message):
        await self.rooms[room_id][player_id].send_text(message)

    async def disconnect(self, room_id):
        for player_id, ws in self.rooms[room_id].items():
            await ws.close()
        del self.rooms[room_id]
        