from fastapi import APIRouter

from app.algorithms.sorting import bubble_sort, insertion_sort, selection_sort, merge_sort, quick_sort
from app.schemas.sorting import SortRequest, SortResponse


router = APIRouter(
    prefix="/api/sorting",
    tags=["Sorting"],
)


@router.post(
    "/bubble-sort",
    response_model=SortResponse,
)
def run_bubble_sort(request: SortRequest):
    return bubble_sort(request.array)


@router.post(
    "/insertion-sort",
    response_model=SortResponse,
)
def run_insertion_sort(request: SortRequest):
    return insertion_sort(request.array)


@router.post(
    "/selection-sort",
    response_model=SortResponse,
)
def run_selection_sort(request: SortRequest):
    return selection_sort(request.array)

@router.post(
    "/merge-sort",
    response_model=SortResponse,
)
def run_merge_sort(request: SortRequest):
    return merge_sort(request.array)

@router.post(
    "/quick-sort",
    response_model=SortResponse,
)
def run_quick_sort(request: SortRequest):
    return quick_sort(request.array)
