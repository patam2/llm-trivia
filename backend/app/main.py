#.\venv\Scripts\activate
#uvicorn app.main:app --reload
from fastapi import FastAPI
from .api.v1 import rooms, websocket
import redis.asyncio as redis


async def lifespan(app):
    app.state.redis = redis.Redis.from_url(
        'redis://localhost:6379/0',
        decode_responses=True,
    )
    
    yield

    await app.state.redis.close()


app = FastAPI(
    lifespan=lifespan,
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





@app.get("/")
def read_root():
    return {"Hello": "World"}

