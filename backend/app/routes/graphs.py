from fastapi import APIRouter

from app.algorithms.graphs import bfs, dfs
from app.schemas.graphs import (
    BFSResponse,
    DFSResponse,
    GraphRequest,
)


router = APIRouter(
    prefix="/api/graphs",
    tags=["graphs"],
)


@router.post("/bfs", response_model=BFSResponse)
def run_bfs(graph: GraphRequest):
    order = bfs(graph)

    return BFSResponse(
        visited=order,
        order=order,
    )


@router.post("/dfs", response_model=DFSResponse)
def run_dfs(graph: GraphRequest):
    order = dfs(graph)

    return DFSResponse(
        visited=order,
        order=order,
    )