import heapq

from app.schemas.pathfinding import (
    DijkstraStep,
    PathfindingRequest,
    PrimEdge,
    PrimStep,
    KruskalEdge,
    KruskalStep,
)


def build_adjacency_list(
    graph: PathfindingRequest,
) -> dict[int, list[tuple[int, float]]]:
    adjacency: dict[
        int,
        list[tuple[int, float]],
    ] = {
        node.id: []
        for node in graph.nodes
    }

    for edge in graph.edges:
        adjacency.setdefault(
            edge.from_,
            [],
        )

        adjacency.setdefault(
            edge.to,
            [],
        )

        adjacency[edge.from_].append(
            (
                edge.to,
                edge.weight,
            )
        )

        adjacency[edge.to].append(
            (
                edge.from_,
                edge.weight,
            )
        )

    return adjacency


def serialize_distances(
    distances: dict[int, float],
) -> dict[int, float | None]:
    return {
        node: (
            None
            if distance == float("inf")
            else distance
        )
        for node, distance in distances.items()
    }


def dijkstra(
    graph: PathfindingRequest,
) -> tuple[
    list[int],
    dict[int, float | None],
    list[DijkstraStep],
]:
    adjacency = build_adjacency_list(graph)

    distances: dict[int, float] = {
        node.id: float("inf")
        for node in graph.nodes
    }

    if graph.start_node not in distances:
        return [], {}, []

    distances[graph.start_node] = 0

    visited: set[int] = set()

    order: list[int] = []

    priority_queue: list[
        tuple[float, int]
    ] = [
        (0, graph.start_node)
    ]

    steps: list[DijkstraStep] = []

    # ---------------------------------------------------------
    # INITIALIZE
    # ---------------------------------------------------------

    steps.append(
        DijkstraStep(
            line=2,
            label="Initialize distances",
            detail=(
                f"Starting from node {graph.start_node}. "
                "Its distance is set to 0 while "
                "all other distances are initially infinity."
            ),
            active_node=graph.start_node,
            visited_nodes=[],
            distances=serialize_distances(
                distances
            ),
            active_edge=None,
        )
    )

    # ---------------------------------------------------------
    # MAIN DIJKSTRA LOOP
    # ---------------------------------------------------------

    while priority_queue:
        current_distance, current_node = (
            heapq.heappop(priority_queue)
        )

        # Ignore outdated queue entries.
        if current_node in visited:
            continue

        if (
            current_distance
            != distances[current_node]
        ):
            continue

        # -----------------------------------------------------
        # SELECT NODE
        # -----------------------------------------------------

        steps.append(
            DijkstraStep(
                line=4,
                label=(
                    f"Select node {current_node}"
                ),
                detail=(
                    f"Node {current_node} has the "
                    f"smallest known distance of "
                    f"{current_distance}."
                ),
                active_node=current_node,
                visited_nodes=list(order),
                distances=serialize_distances(
                    distances
                ),
                active_edge=None,
            )
        )

        # -----------------------------------------------------
        # VISIT NODE
        # -----------------------------------------------------

        visited.add(current_node)

        order.append(current_node)

        steps.append(
            DijkstraStep(
                line=5,
                label=(
                    f"Visit node {current_node}"
                ),
                detail=(
                    f"Node {current_node} is marked "
                    "as visited."
                ),
                active_node=current_node,
                visited_nodes=list(order),
                distances=serialize_distances(
                    distances
                ),
                active_edge=None,
            )
        )

        # -----------------------------------------------------
        # RELAX EDGES
        # -----------------------------------------------------

        for neighbor, weight in adjacency.get(
            current_node,
            [],
        ):
            if neighbor in visited:
                continue

            new_distance = (
                distances[current_node]
                + weight
            )

            old_distance = distances[neighbor]

            if new_distance < old_distance:
                distances[neighbor] = new_distance

                heapq.heappush(
                    priority_queue,
                    (
                        new_distance,
                        neighbor,
                    ),
                )

                old_distance_text = (
                    "∞"
                    if old_distance == float("inf")
                    else str(old_distance)
                )

                steps.append(
                    DijkstraStep(
                        line=6,
                        label=(
                            f"Relax edge "
                            f"{current_node} — {neighbor}"
                        ),
                        detail=(
                            f"The distance to node "
                            f"{neighbor} improves from "
                            f"{old_distance_text} "
                            f"to {new_distance}."
                        ),
                        active_node=current_node,
                        visited_nodes=list(order),
                        distances=serialize_distances(
                            distances
                        ),
                        active_edge={
                            "from": current_node,
                            "to": neighbor,
                        },
                    )
                )

    # ---------------------------------------------------------
    # COMPLETE
    # ---------------------------------------------------------

    steps.append(
        DijkstraStep(
            line=7,
            label="Dijkstra complete",
            detail=(
                "All reachable nodes have been "
                "processed and the shortest "
                "known distances are complete."
            ),
            active_node=None,
            visited_nodes=list(order),
            distances=serialize_distances(
                distances
            ),
            active_edge=None,
        )
    )

    return (
        order,
        serialize_distances(distances),
        steps,
    )
def prims(
    graph: PathfindingRequest,
) -> tuple[
    list[int],
    list[PrimEdge],
    list[PrimStep],
]:
    adjacency = build_adjacency_list(graph)

    if graph.start_node not in {
        node.id for node in graph.nodes
    }:
        return [], [], []

    visited: set[int] = set()
    order: list[int] = []

    selected_edges: list[PrimEdge] = []

    steps: list[PrimStep] = []

    # Min heap:
    # (weight, from_node, to_node)
    priority_queue: list[
        tuple[float, int, int]
    ] = []

    visited.add(graph.start_node)
    order.append(graph.start_node)

    steps.append(
        PrimStep(
            line=2,
            label="Initialize Prim's Algorithm",
            detail=(
                f"Starting the minimum spanning tree "
                f"from node {graph.start_node}."
            ),
            active_node=graph.start_node,
            visited_nodes=list(order),
            active_edge=None,
            selected_edges=[],
        )
    )

    # Add starting node's edges.
    for neighbor, weight in adjacency.get(
        graph.start_node,
        [],
    ):
        heapq.heappush(
            priority_queue,
            (
                weight,
                graph.start_node,
                neighbor,
            ),
        )

    while priority_queue:
        weight, from_node, to_node = (
            heapq.heappop(priority_queue)
        )

        # Ignore edges whose destination is already
        # inside the growing MST.
        if to_node in visited:
            continue

        # Also handle the case where the other endpoint
        # is the visited node.
        if from_node not in visited:
            continue

        active_edge = {
            "from": from_node,
            "to": to_node,
        }

        steps.append(
            PrimStep(
                line=4,
                label=(
                    f"Select edge "
                    f"{from_node} — {to_node}"
                ),
                detail=(
                    f"Edge {from_node} — {to_node} "
                    f"has weight {weight} and is the "
                    "minimum crossing edge."
                ),
                active_node=from_node,
                visited_nodes=list(order),
                active_edge=active_edge,
                selected_edges=[
                    PrimEdge(
                        from_=edge.from_,
                        to=edge.to,
                        weight=edge.weight,
                    )
                    for edge in selected_edges
                ],
            )
        )

        # Add the edge to the MST.
        selected_edge = PrimEdge(
            from_=from_node,
            to=to_node,
            weight=weight,
        )

        selected_edges.append(
            selected_edge
        )

        steps.append(
            PrimStep(
                line=5,
                label=(
                    f"Add edge "
                    f"{from_node} — {to_node}"
                ),
                detail=(
                    f"The edge is added to the minimum "
                    "spanning tree because it connects "
                    "the existing tree to an unvisited node."
                ),
                active_node=from_node,
                visited_nodes=list(order),
                active_edge=active_edge,
                selected_edges=[
                    PrimEdge(
                        from_=edge.from_,
                        to=edge.to,
                        weight=edge.weight,
                    )
                    for edge in selected_edges
                ],
            )
        )

        # Add the new node.
        visited.add(to_node)
        order.append(to_node)

        steps.append(
            PrimStep(
                line=6,
                label=f"Add node {to_node}",
                detail=(
                    f"Node {to_node} is now part of "
                    "the growing minimum spanning tree."
                ),
                active_node=to_node,
                visited_nodes=list(order),
                active_edge=active_edge,
                selected_edges=[
                    PrimEdge(
                        from_=edge.from_,
                        to=edge.to,
                        weight=edge.weight,
                    )
                    for edge in selected_edges
                ],
            )
        )

        # Add the newly available crossing edges.
        for neighbor, neighbor_weight in adjacency.get(
            to_node,
            [],
        ):
            if neighbor not in visited:
                heapq.heappush(
                    priority_queue,
                    (
                        neighbor_weight,
                        to_node,
                        neighbor,
                    ),
                )

        # MST is complete when V - 1 edges exist.
        if len(selected_edges) >= max(
            len(graph.nodes) - 1,
            0,
        ):
            break

    steps.append(
        PrimStep(
            line=7,
            label="Prim's complete",
            detail=(
                "The minimum spanning tree is complete. "
                "Every reachable node has been connected "
                "using the selected minimum-weight edges."
            ),
            active_node=(
                order[-1]
                if order
                else None
            ),
            visited_nodes=list(order),
            active_edge=None,
            selected_edges=[
                PrimEdge(
                    from_=edge.from_,
                    to=edge.to,
                    weight=edge.weight,
                )
                for edge in selected_edges
            ],
        )
    )

    return (
        order,
        selected_edges,
        steps,
    )
def kruskals(
    graph: PathfindingRequest,
) -> tuple[
    list[int],
    list[KruskalEdge],
    list[KruskalStep],
]:
    edges = sorted(
        graph.edges,
        key=lambda edge: edge.weight,
    )

    parent: dict[int, int] = {
        node.id: node.id
        for node in graph.nodes
    }

    rank: dict[int, int] = {
        node.id: 0
        for node in graph.nodes
    }

    order: list[int] = []
    selected_edges: list[KruskalEdge] = []
    steps: list[KruskalStep] = []

    def find(node: int) -> int:
        while parent[node] != node:
            parent[node] = parent[parent[node]]
            node = parent[node]

        return node

    def union(first: int, second: int) -> bool:
        root_first = find(first)
        root_second = find(second)

        if root_first == root_second:
            return False

        if rank[root_first] < rank[root_second]:
            parent[root_first] = root_second
        elif rank[root_first] > rank[root_second]:
            parent[root_second] = root_first
        else:
            parent[root_second] = root_first
            rank[root_first] += 1

        return True

    steps.append(
        KruskalStep(
            line=2,
            label="Initialize Kruskal's Algorithm",
            detail=(
                "All graph edges are sorted by weight. "
                "Each node starts in its own separate set."
            ),
            active_node=None,
            visited_nodes=[],
            active_edge=None,
            selected_edges=[],
        )
    )

    for edge in edges:
        from_node = edge.from_
        to_node = edge.to
        weight = edge.weight

        active_edge = {
            "from": from_node,
            "to": to_node,
        }

        steps.append(
            KruskalStep(
                line=4,
                label=f"Consider edge {from_node} — {to_node}",
                detail=(
                    f"Considering edge {from_node} — {to_node} "
                    f"with weight {weight}."
                ),
                active_node=from_node,
                visited_nodes=list(order),
                active_edge=active_edge,
                selected_edges=[
                    KruskalEdge(
                        from_=selected.from_,
                        to=selected.to,
                        weight=selected.weight,
                    )
                    for selected in selected_edges
                ],
            )
        )

        if union(from_node, to_node):
            selected_edge = KruskalEdge(
                from_=from_node,
                to=to_node,
                weight=weight,
            )

            selected_edges.append(selected_edge)

            if from_node not in order:
                order.append(from_node)

            if to_node not in order:
                order.append(to_node)

            steps.append(
                KruskalStep(
                    line=5,
                    label=f"Add edge {from_node} — {to_node}",
                    detail=(
                        f"Edge {from_node} — {to_node} "
                        f"is added because it connects two "
                        f"different components without creating a cycle."
                    ),
                    active_node=to_node,
                    visited_nodes=list(order),
                    active_edge=active_edge,
                    selected_edges=[
                        KruskalEdge(
                            from_=selected.from_,
                            to=selected.to,
                            weight=selected.weight,
                        )
                        for selected in selected_edges
                    ],
                )
            )

            if len(selected_edges) == max(
                len(graph.nodes) - 1,
                0,
            ):
                break

        else:
            steps.append(
                KruskalStep(
                    line=6,
                    label=f"Reject edge {from_node} — {to_node}",
                    detail=(
                        f"Edge {from_node} — {to_node} "
                        "is rejected because it would create a cycle."
                    ),
                    active_node=from_node,
                    visited_nodes=list(order),
                    active_edge=active_edge,
                    selected_edges=[
                        KruskalEdge(
                            from_=selected.from_,
                            to=selected.to,
                            weight=selected.weight,
                        )
                        for selected in selected_edges
                    ],
                )
            )

    steps.append(
        KruskalStep(
            line=7,
            label="Kruskal's complete",
            detail=(
                "The minimum spanning tree is complete. "
                "The selected edges connect the graph using "
                "the minimum possible total weight."
            ),
            active_node=(
                order[-1]
                if order
                else None
            ),
            visited_nodes=list(order),
            active_edge=None,
            selected_edges=[
                KruskalEdge(
                    from_=selected.from_,
                    to=selected.to,
                    weight=selected.weight,
                )
                for selected in selected_edges
            ],
        )
    )

    return order, selected_edges, steps