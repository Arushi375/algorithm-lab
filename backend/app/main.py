
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.searching import router as searching_router
from app.routes.sorting import router as sorting_router

app = FastAPI(
    title="Algorithm Lab API",
    description="Backend API for the Algorithm Lab project",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(searching_router)
app.include_router(sorting_router)

@app.get("/")
def root():
    return {
        "message": "Algorithm Lab API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }

