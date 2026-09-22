
from fastapi import APIRouter

from app.algorithms.searching import linear_search,binary_search
from app.schemas.searching import SearchRequest, SearchResponse


router = APIRouter(
    prefix="/api/searching",
    tags=["Searching"],
)


@router.post(
    "/linear-search",
    response_model=SearchResponse,
)
def run_linear_search(request: SearchRequest):
    return linear_search(
        request.array,
        request.target,
    )
@router.post(
    "/binary-search",
    response_model=SearchResponse,
)
def run_binary_search(request: SearchRequest):
    return binary_search(
        request.array,
        request.target,
    )
