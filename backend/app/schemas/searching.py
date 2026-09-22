
from pydantic import BaseModel


class SearchRequest(BaseModel):
    array: list[int]
    target: int


class SearchResponse(BaseModel):
    found: bool
    index: int
    comparisons: int
    
