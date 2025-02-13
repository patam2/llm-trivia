from pydantic import BaseModel
from typing import List, Optional


class Player(BaseModel):
    id: str
    name: str
    is_host: bool = False
    is_ready: bool
    points: int
    has_answered: bool



class Room(BaseModel):
    id: str
    name: str
    topic: str
    players: List[Player] = []
    max_players: int
    max_questions: int
    code: Optional[str] = None
    current_question: Optional[str] = None
    current_question_index: Optional[int] = 1
    current_question_options: Optional[List[str]] = None
    current_question_answer: Optional[str] = None
    last_questions: List[str] = []


class PublicPlayer(BaseModel):
    name: str
    is_host: bool = False
    is_ready: bool = False
    points: int
    has_answered: bool

class PublicRoom(BaseModel):
    id: str
    name: str
    topic: str
    max_questions: int
    code: Optional[str] = None
    players: List[PublicPlayer] = []
    max_players: int
    current_question: Optional[str] = None
    current_question_options: Optional[List[str]] = None
    current_question_index: Optional[int] = None

    @classmethod
    def from_room(cls, room: Room):
        players = []
        for player in room.players:
            players.append(PublicPlayer(
                name=player.name,
                is_host=player.is_host,
                is_ready=player.is_ready,
                points=player.points,
                has_answered=player.has_answered
            ))

        return cls(
            id=room.id,
            topic=room.topic,
            name=room.name,
            code=room.code,
            players=players,
            max_players=room.max_players,
            max_questions=room.max_questions,
            current_question=room.current_question,
            current_question_options=room.current_question_options,
            current_question_index=room.current_question_index

        )
