from pydantic import BaseModel, Field


class GraphNode(BaseModel):
    id: int
    label: str | None = None
    x: float | None = None
    y: float | None = None


class GraphEdge(BaseModel):
    from_: int = Field(alias="from")
    to: int
    weight: float | None = None

    class Config:
        populate_by_name = True


class GraphRequest(BaseModel):
    nodes: list[GraphNode]
    edges: list[GraphEdge]
    start_node: int


class BFSResponse(BaseModel):
    visited: list[int]
    order: list[int]


class DFSResponse(BaseModel):
    visited: list[int]
    order: list[int]