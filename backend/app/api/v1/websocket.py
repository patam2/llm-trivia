from fastapi import WebSocket, APIRouter
from ...schemas.room import PublicRoom
from ...services.websocket import WebSocketService
from ...services.gameservice import GameService
from ...core.questiongenerator import ClaudeGenerator
import json


WebSocketRouter = APIRouter(prefix="/ws", tags=["ws"])
manager = WebSocketService()
question_generator = ClaudeGenerator()


async def handle_game_start(game_service, topic, room_id: str):
    await manager.broadcast_to_room(
        room_id, 
        json.dumps({"type": "game_started", "data": None}), 
        None
    )
    #gameservice.start_game(room_id)
    await send_new_question(game_service, topic, room_id)


async def send_new_question(game_service, topic, room_id: str, past_questions=[], index=0):
    question = await question_generator.generate_question(topic, 1, "medium", past_questions)
    question = question['questions'][0]

    public_question = {
        "question": question['question'],
        "answers": question['options']
    }

    await game_service.set_last_question(room_id, question['question'])
    await game_service.set_current_question(room_id, question['question'], question["correct_answer"], question['options'], index)
    await manager.broadcast_to_room(
        room_id, 
        json.dumps({"type": "question", "data": public_question}), 
        None
    )


async def send_results(game_service, room_id: str):
    room = await game_service.get_room(room_id)
    await manager.broadcast_to_room(
        room_id, 
        json.dumps({"type": "results", "data": room.current_question_answer}), 
        None
    )
    await game_service.nullify_answers(room_id)


@WebSocketRouter.websocket("/game/{room_id}/{player_id}")
async def websocket_endpoint(
        websocket: WebSocket, 
        room_id: str, player_id: str, 
    ): 
    GameServiceO = GameService(websocket)
    await manager.connect(websocket, room_id, player_id)

    room_data = PublicRoom.from_room(await GameServiceO.get_room(room_id))

    await manager.broadcast_to_room(
        room_id, 
        json.dumps({"type": "room_info", "data": room_data.model_dump()}), 
    )
    if room_data.current_question:
        await manager.broadcast_to_room(
            room_id, 
            json.dumps(
                {
                    "type": "question", 
                    "data": {
                        "question": room_data.current_question, 
                        "answers": room_data.current_question_options
                    }
                }
            ), 
            None
        )
        None

    while True:
        try:
            data = json.loads(await websocket.receive_text())
            if data.get("type") == "start_game":
                await handle_game_start(GameServiceO, room_data.topic, room_id)
            elif data.get("type") == "answer":
                status = await GameServiceO.handle_submit_answer(room_id, player_id, data.get("data"))


                room_data = PublicRoom.from_room(await GameServiceO.get_room(room_id))

                await manager.broadcast_to_room(
                    room_id, 
                    json.dumps({"type": "room_info", "data": room_data.model_dump()}), 
                    None
                )


                if status["has_everyone_answered"]:
                    room = await GameServiceO.get_room(room_id)
                    if room.current_question_index + 1 == room.max_questions:
                        await send_results(GameServiceO, room_id)
                        for player in room.players:
                            await manager.unicast_to_player(room_id, player.id,
                                json.dumps({"type": "player_data", "data": player.model_dump()})                    
                        )
                            
                        room_data = PublicRoom.from_room(await GameServiceO.get_room(room_id))

                        await manager.broadcast_to_room(
                            room_id, 
                            json.dumps({"type": "room_info", "data": room_data.model_dump()}), 
                            None
                        )

                        await manager.broadcast_to_room(
                            room_id, 
                            json.dumps({"type": "game_ended", "data": None}), 
                            None
                        )


                        await manager.disconnect(room_id)
                        await GameServiceO.delete_room(room_id)
                        return
                    index = room.current_question_index + 1
                    await send_results(GameServiceO, room_id)
                    room_data = PublicRoom.from_room(await GameServiceO.get_room(room_id))

                    await manager.broadcast_to_room(
                        room_id, 
                        json.dumps({"type": "room_info", "data": room_data.model_dump()}), 
                        None
                    )
                    for player in room.players:
                        await manager.unicast_to_player(room_id, player.id,
                            json.dumps({"type": "player_data", "data": player.model_dump()})                    
                    )

                    await send_new_question(GameServiceO, room_data.topic, room_id, room.last_questions, index)

        except Exception as WebSocketError: #99.9% cases  it's a websocket disconnect -> remove the object
            if room_id in manager.rooms:
                del manager.rooms[room_id][player_id]
                break