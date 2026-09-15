from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Algorithm Lab API",
    description="Backend API for the Algorithm Lab project",
    version="1.0.0",
)

# Allow requests from our local Next.js frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Welcome to the Algorithm Lab API"
    }


@app.get("/health")
def health_check():
    return {
        "status": "ok"
    }
