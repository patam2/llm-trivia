from fastapi import APIRouter, HTTPException, Depends, Request
from ...schemas.room import Room, Player
from ...services.gameservice import GameService


import uuid

router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.post("/create")
async def create_room(
    request: Request,
    host_name: str = 'Host',
    game_service: GameService = Depends(GameService)
):
    data = await request.json()
    
    room = Room(
        id=uuid.uuid4().__str__(), 
        topic=data.get("topic"),
        max_questions=data.get("numQuestions"),
        players=[
            Player(
                id=uuid.uuid4().__str__(),
                name=data.get("hostName", host_name),
                is_host=True,
                is_ready=False,
                points=0,
                has_answered=False
            )
        ],
        max_players=4
    )

    newroom = await game_service.create_room(
        room
    )
    return newroom.model_dump_json()

@router.get("/{room_id}")
async def get_room(request: Request, room_id: str, game_service: GameService = Depends(GameService)):
    room = await game_service.get_room(room_id)
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    return room

@router.post('/join/{room_code}')
async def join_room(request: Request, room_code:str, game_service: GameService = Depends(GameService)):
    data = await request.json()    
    return await game_service.join_room(room_code, data.get("playerName"))


@router.get("/validity/{room_code}")
async def check_room_validity(request: Request, room_code: str, game_service: GameService = Depends(GameService)):
    return await game_service.check_room_validity(room_code)


@router.get("/delete/{room_id}")
async def delete_room(request: Request, room_id: str, game_service: GameService = Depends(GameService)):
    return await game_service.delete_room(room_id)