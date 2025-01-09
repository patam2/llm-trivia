from pydantic import BaseModel
from typing import List, Optional


class Player(BaseModel):
    name: str
    is_host: bool = False
    is_ready: bool
    points: int
    has_answered: bool
    room_id: Optional[int] = None


class Room(BaseModel):
    id: str
    name: str
    players: List[Player] = []
    max_players: int
    code: Optional[str] = None


