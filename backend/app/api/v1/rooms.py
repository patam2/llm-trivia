from fastapi import APIRouter, HTTPException, Depends, Request
from ...schemas.room import Room, Player
from ...services.gameservice import GameService

router = APIRouter(prefix="/rooms", tags=["rooms"])


@router.get("/create")
async def create_room(
    request: Request,
    host_name: str = 'Host',
    game_service: GameService = Depends(GameService)
):
    print(request.state, dir(request.state))
    await game_service.create_room(Room(id=1, name='Room 1'))
    return {"status": "success"}

@router.get("/{room_id}")
async def get_room(request: Request, room_id: str, game_service: GameService = Depends(GameService)):
    room = await game_service.get_room(room_id)
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    return room