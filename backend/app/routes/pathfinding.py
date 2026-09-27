from fastapi import APIRouter

from app.algorithms.pathfinding import (
    dijkstra,
    kruskals,
    prims,
)

from app.schemas.pathfinding import (
    DijkstraResponse,
    PathfindingRequest,
    PrimResponse,
    KruskalResponse,
)


router = APIRouter(
    prefix="/api/pathfinding",
    tags=["pathfinding"],
)


@router.post(
    "/dijkstra",
    response_model=DijkstraResponse,
)
def run_dijkstra(
    graph: PathfindingRequest,
):
    order, distances, steps = dijkstra(graph)

    return DijkstraResponse(
        order=order,
        distances=distances,
        steps=steps,
    )


@router.post(
    "/prims",
    response_model=PrimResponse,
)
def run_prims(
    graph: PathfindingRequest,
):
    order, selected_edges, steps = prims(graph)

    return PrimResponse(
        order=order,
        selected_edges=selected_edges,
        steps=steps,
    )
    
@router.post(
    "/kruskals",
    response_model=KruskalResponse,
)
def run_kruskals(
    graph: PathfindingRequest,
):
    order, selected_edges, steps = kruskals(graph)

    return KruskalResponse(
        order=order,
        selected_edges=selected_edges,
        steps=steps,
    )