from pydantic import BaseModel


class SortRequest(BaseModel):
    array: list[int]


class SortResponse(BaseModel):
    array: list[int]
    comparisons: int
    swaps: int