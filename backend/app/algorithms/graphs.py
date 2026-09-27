from collections import deque

from app.schemas.graphs import GraphRequest


def build_adjacency_list(graph: GraphRequest) -> dict[int, list[int]]:
    adjacency: dict[int, list[int]] = {
        node.id: []
        for node in graph.nodes
    }

    for edge in graph.edges:
        if edge.from_ not in adjacency:
            adjacency[edge.from_] = []

        if edge.to not in adjacency:
            adjacency[edge.to] = []

        adjacency[edge.from_].append(edge.to)
        adjacency[edge.to].append(edge.from_)

    return adjacency


def bfs(graph: GraphRequest) -> list[int]:
    adjacency = build_adjacency_list(graph)

    if graph.start_node not in adjacency:
        return []

    visited: set[int] = set()
    order: list[int] = []

    queue = deque([graph.start_node])

    visited.add(graph.start_node)

    while queue:
        current = queue.popleft()

        order.append(current)

        for neighbor in adjacency[current]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return order


def dfs(graph: GraphRequest) -> list[int]:
    adjacency = build_adjacency_list(graph)

    if graph.start_node not in adjacency:
        return []

    visited: set[int] = set()
    order: list[int] = []

    stack = [graph.start_node]

    while stack:
        current = stack.pop()

        if current in visited:
            continue

        visited.add(current)
        order.append(current)

        # Reverse so traversal follows the same
        # general neighbor order as the graph definition.
        for neighbor in reversed(adjacency[current]):
            if neighbor not in visited:
                stack.append(neighbor)

    return order