from pydantic import BaseModel
from typing import List, Optional


class Player(BaseModel):
    id: int
    name: str
    is_host: bool = False
    is_ready: bool
    points: int
    has_answered: bool
    room_id: Optional[int] = None


class Room(BaseModel):
    id: int
    name: str



