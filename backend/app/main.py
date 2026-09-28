
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.searching import router as searching_router
from app.routes.sorting import router as sorting_router
from app.routes import graphs
from app.routes import pathfinding

import os

cors_origins = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
).split(",")


app = FastAPI(
    title="Algorithm Lab API",
    description="Backend API for the Algorithm Lab project",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pathfinding.router)
app.include_router(searching_router)
app.include_router(sorting_router)
app.include_router(graphs.router)

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

