#.\venv\Scripts\activate
#uvicorn app.main:app --reload
from fastapi import FastAPI, Response
from .api.v1 import rooms, websocket
from .core.settings import get_settings
import redis.asyncio as redis
from fastapi.middleware.cors import CORSMiddleware


settings = get_settings()

async def lifespan(app):
    app.state.redis = redis.Redis.from_url(
        settings.REDIS_URL,
        decode_responses=True,
    )
    yield
    await app.state.redis.close()




app = FastAPI(
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    try:
        # Check Redis connection
        await app.state.redis.ping()
        return {
            "status": "healthy",
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }


app.include_router(rooms.router, prefix="/api/v1", tags=["rooms"])
app.include_router(websocket.WebSocketRouter, prefix="/ws", tags=["ws"])



@app.get("/")
def read_root():
    return Response(status_code=404)

