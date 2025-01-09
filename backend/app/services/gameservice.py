from fastapi import FastAPI, Request
from ..schemas.room import Room, Player
from redis.asyncio import Redis
import json
import random
import string



class GameService:
    def __init__(self, request: Request):
        self.redis = request.app.state.redis

    async def create_room(self, room: Room):
        random_code = "".join(random.choices(string.ascii_uppercase, k=6))
        check = await self.redis.get(f"code:{random_code}")
        while check is not None:
            random_code = "".join(random.choices(string.ascii_uppercase, k=6))
            check = await self.redis.get(f"code:{random_code}")
        room.code = random_code

        await self.redis.set(
            f"room:{room.id}", room.model_dump_json(), ex=3600
        )
        await self.redis.set(
            f"code:{room.code}", room.id, ex=3600
        )
        return room

    async def join_room(self, room_code: str, player_name: str):
        player = Player(
            name=player_name,
            is_host=False,
            is_ready=False,
            points=0,
            has_answered=False,
        )
        room_id = await self.get_room_id_from_code(room_code)
        print(room_id)
        room = await self.get_room(room_id)
        room.players.append(player)
        await self.redis.set(
            f"room:{room_id}", room.model_dump_json(), ex=3600
        )
        return {'roomId': room.id, 'player': player.model_dump()}
    
    async def get_room(self, room_id: str):
        room = await self.redis.get(f"room:{room_id}")
        room = json.loads(room)
        if room is None:
            return None
        return Room(**room)

    async def check_room_validity(self, room_code: str):
        room = await self.redis.get(f"code:{room_code}")
        if room is None:
            return {"status": "invalid"}
        return {"status": "success"}

    async def get_room_id_from_code(self, room_code: str):
        return await self.redis.get(f"code:{room_code}")
    

    async def delete_room(self, room_id: str):
        await self.redis.delete(f"room:{room_id}")
        return {"status": "success"}