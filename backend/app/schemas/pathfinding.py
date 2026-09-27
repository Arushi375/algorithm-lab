from pydantic import BaseModel, Field


class PathNode(BaseModel):
    id: int
    label: str | None = None
    x: float | None = None
    y: float | None = None


class PathEdge(BaseModel):
    from_: int = Field(alias="from")
    to: int
    weight: float = 1

    model_config = {
        "populate_by_name": True
    }


class PathfindingRequest(BaseModel):
    nodes: list[PathNode]
    edges: list[PathEdge]
    start_node: int


class DijkstraStep(BaseModel):
    line: int
    label: str
    detail: str
    active_node: int | None = None
    visited_nodes: list[int] = []
    distances: dict[int, float | None] = {}
    active_edge: dict[str, int] | None = None


class DijkstraResponse(BaseModel):
    order: list[int]
    distances: dict[int, float | None]
    steps: list[DijkstraStep]
    
class PrimEdge(BaseModel):
    from_: int = Field(alias="from")
    to: int
    weight: float

    model_config = {
        "populate_by_name": True
    }


class PrimStep(BaseModel):
    line: int
    label: str
    detail: str
    active_node: int | None = None
    visited_nodes: list[int] = []
    active_edge: dict[str, int] | None = None
    selected_edges: list[PrimEdge] = []


class PrimResponse(BaseModel):
    order: list[int]
    selected_edges: list[PrimEdge]
    steps: list[PrimStep]

class KruskalEdge(BaseModel):
    from_: int = Field(alias="from")
    to: int
    weight: float

    model_config = {"populate_by_name": True}


class KruskalStep(BaseModel):
    line: int
    label: str
    detail: str
    active_node: int | None = None
    visited_nodes: list[int] = []
    active_edge: dict[str, int] | None = None
    selected_edges: list[KruskalEdge] = []


class KruskalResponse(BaseModel):
    order: list[int]
    selected_edges: list[KruskalEdge]
    steps: list[KruskalStep]