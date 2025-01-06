from fastapi import FastAPI, Request
from ..schemas.room import Room, Player
from redis.asyncio import Redis



class GameService:
    def __init__(self, request: Request):

        self.redis = request.app.state.redis
        print('initiazing')
    async def create_room(self, room: Room):
        await self.redis.set(
            room.id, room.model_dump_json(), ex=3600
        )
        return room
    
    async def get_room(self, room_id: str):
        room = await self.redis.get(room_id)
        if room is None:
            return None
        return room
