#.\venv\Scripts\activate
#uvicorn app.main:app --reload
from fastapi import FastAPI, WebSocket
from .api.v1 import rooms, websocket
from .core.settings import get_settings
import redis.asyncio as redis
from fastapi.middleware.cors import CORSMiddleware


async def lifespan(app):
    app.state.redis = redis.Redis.from_url(
        'redis://localhost:6379/0',
        decode_responses=True,
    )
    
    yield

    await app.state.redis.close()


settings = get_settings()

app = FastAPI(
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CORS_ORIGINS ],
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
app.include_router(websocket.WebSocketRouter, prefix="/api/v1", tags=["ws"])




@app.get("/")
def read_root():
    return {"Hello": "World"}

