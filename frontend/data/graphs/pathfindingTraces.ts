import type {
    AlgorithmTrace,
    TraceFrame,
    TraceLine,
  } from "@/types/algorithmTrace";
  
  /* =========================================================
     DIJKSTRA
  ========================================================= */
  
  const dijkstraLines: TraceLine[] = [
    {
      line: 1,
      code: "dist[start] = 0",
    },
    {
      line: 2,
      code: "while (unvisitedNodes.length > 0)",
    },
    {
      line: 3,
      code: "current = nodeWithSmallestDistance()",
    },
    {
      line: 4,
      code: "mark current as visited",
    },
    {
      line: 5,
      code: "for each neighbor of current",
    },
    {
      line: 6,
      code: "newDistance = dist[current] + weight",
    },
    {
      line: 7,
      code: "if (newDistance < dist[neighbor])",
    },
    {
      line: 8,
      code: "dist[neighbor] = newDistance",
    },
  ];
  
  const dijkstraFrames: TraceFrame[] = [
    {
      step: 0,
      line: 1,
      label: "Initialize distances",
      detail:
        "Set the distance to the starting node 1 to 0. All other nodes begin with an infinite distance.",
      activeNode: 1,
      visitedNodes: [],
      distances: {
        1: 0,
        2: Infinity,
        3: Infinity,
        4: Infinity,
        5: Infinity,
        6: Infinity,
      },
      activeEdge: null,
      pathNodes: [],
    },
  
    {
      step: 1,
      line: 3,
      label: "Select node 1",
      detail:
        "Node 1 has the smallest known distance, so it becomes the current node.",
      activeNode: 1,
      visitedNodes: [],
      distances: {
        1: 0,
        2: Infinity,
        3: Infinity,
        4: Infinity,
        5: Infinity,
        6: Infinity,
      },
      activeEdge: null,
      pathNodes: [],
    },
  
    {
      step: 2,
      line: 6,
      label: "Check edge 1 → 2",
      detail:
        "The distance through node 1 is 0 + 4 = 4.",
      activeNode: 1,
      visitedNodes: [1],
      distances: {
        1: 0,
        2: 4,
        3: Infinity,
        4: Infinity,
        5: Infinity,
        6: Infinity,
      },
      activeEdge: {
        from: 1,
        to: 2,
      },
      pathNodes: [],
    },
  
    {
      step: 3,
      line: 6,
      label: "Check edge 1 → 3",
      detail:
        "The distance through node 1 is 0 + 2 = 2.",
      activeNode: 1,
      visitedNodes: [1],
      distances: {
        1: 0,
        2: 4,
        3: 2,
        4: Infinity,
        5: Infinity,
        6: Infinity,
      },
      activeEdge: {
        from: 1,
        to: 3,
      },
      pathNodes: [],
    },
  
    {
      step: 4,
      line: 3,
      label: "Select node 3",
      detail:
        "Node 3 has the smallest unvisited distance: 2.",
      activeNode: 3,
      visitedNodes: [1],
      distances: {
        1: 0,
        2: 4,
        3: 2,
        4: Infinity,
        5: Infinity,
        6: Infinity,
      },
      activeEdge: null,
      pathNodes: [],
    },
  
    {
      step: 5,
      line: 6,
      label: "Check edge 3 → 5",
      detail:
        "The distance through node 3 is 2 + 2 = 4.",
      activeNode: 3,
      visitedNodes: [1, 3],
      distances: {
        1: 0,
        2: 4,
        3: 2,
        4: Infinity,
        5: 4,
        6: Infinity,
      },
      activeEdge: {
        from: 3,
        to: 5,
      },
      pathNodes: [],
    },
  
    {
      step: 6,
      line: 6,
      label: "Check edge 3 → 6",
      detail:
        "The distance through node 3 is 2 + 5 = 7.",
      activeNode: 3,
      visitedNodes: [1, 3],
      distances: {
        1: 0,
        2: 4,
        3: 2,
        4: Infinity,
        5: 4,
        6: 7,
      },
      activeEdge: {
        from: 3,
        to: 6,
      },
      pathNodes: [],
    },
  
    {
      step: 7,
      line: 3,
      label: "Select node 2",
      detail:
        "Node 2 has the smallest unvisited distance: 4.",
      activeNode: 2,
      visitedNodes: [1, 3],
      distances: {
        1: 0,
        2: 4,
        3: 2,
        4: Infinity,
        5: 4,
        6: 7,
      },
      activeEdge: null,
      pathNodes: [],
    },
  
    {
      step: 8,
      line: 6,
      label: "Check edge 2 → 4",
      detail:
        "The distance through node 2 is 4 + 3 = 7.",
      activeNode: 2,
      visitedNodes: [1, 2, 3],
      distances: {
        1: 0,
        2: 4,
        3: 2,
        4: 7,
        5: 4,
        6: 7,
      },
      activeEdge: {
        from: 2,
        to: 4,
      },
      pathNodes: [],
    },
  
    {
      step: 9,
      line: 6,
      label: "Check edge 2 → 5",
      detail:
        "The distance through node 2 is 4 + 1 = 5. The current distance to node 5 is already 4, so we keep 4.",
      activeNode: 2,
      visitedNodes: [1, 2, 3],
      distances: {
        1: 0,
        2: 4,
        3: 2,
        4: 7,
        5: 4,
        6: 7,
      },
      activeEdge: {
        from: 2,
        to: 5,
      },
      pathNodes: [],
    },
  
    {
      step: 10,
      line: 3,
      label: "Select node 5",
      detail:
        "Node 5 has the smallest unvisited distance: 4.",
      activeNode: 5,
      visitedNodes: [1, 2, 3],
      distances: {
        1: 0,
        2: 4,
        3: 2,
        4: 7,
        5: 4,
        6: 7,
      },
      activeEdge: null,
      pathNodes: [],
    },
  
    {
      step: 11,
      line: 6,
      label: "Check edge 5 → 6",
      detail:
        "The distance through node 5 is 4 + 2 = 6.",
      activeNode: 5,
      visitedNodes: [1, 2, 3, 5],
      distances: {
        1: 0,
        2: 4,
        3: 2,
        4: 7,
        5: 4,
        6: 6,
      },
      activeEdge: {
        from: 5,
        to: 6,
      },
      pathNodes: [],
    },
  
    {
      step: 12,
      line: 3,
      label: "Select node 6",
      detail:
        "Node 6 now has the smallest unvisited distance: 6.",
      activeNode: 6,
      visitedNodes: [1, 2, 3, 5],
      distances: {
        1: 0,
        2: 4,
        3: 2,
        4: 7,
        5: 4,
        6: 6,
      },
      activeEdge: null,
      pathNodes: [],
    },
  
    {
      step: 13,
      line: 4,
      label: "Shortest path found",
      detail:
        "The shortest path from node 1 to node 6 is 1 → 3 → 5 → 6 with a total distance of 6.",
      activeNode: 6,
      visitedNodes: [1, 2, 3, 5, 6],
      distances: {
        1: 0,
        2: 4,
        3: 2,
        4: 7,
        5: 4,
        6: 6,
      },
      activeEdge: null,
      pathNodes: [1, 3, 5, 6],
    },
  ];
  
  /* =========================================================
     PRIM'S
  ========================================================= */
  
  const primsLines: TraceLine[] = [
    {
      line: 1,
      code: "start with an empty MST",
    },
    {
      line: 2,
      code: "select a starting node",
    },
    {
      line: 3,
      code: "find the minimum weight edge",
    },
    {
      line: 4,
      code: "if node is not in MST",
    },
    {
      line: 5,
      code: "add edge to MST",
    },
    {
      line: 6,
      code: "mark node as visited",
    },
  ];
  
  const primsFrames: TraceFrame[] = [
    {
      step: 0,
      line: 1,
      label: "Initialize MST",
      detail:
        "Start with an empty minimum spanning tree.",
      activeNode: null,
      visitedNodes: [],
      selectedEdges: [],
      activeEdge: null,
      pathNodes: [],
    },
  
    {
      step: 1,
      line: 2,
      label: "Select starting node",
      detail:
        "Start Prim's algorithm from node 1.",
      activeNode: 1,
      visitedNodes: [1],
      selectedEdges: [],
      activeEdge: null,
      pathNodes: [],
    },
  
    {
      step: 2,
      line: 3,
      label: "Find minimum edge",
      detail:
        "From node 1, the available edges have weights 4 and 2. The minimum is 1 → 3 with weight 2.",
      activeNode: 1,
      visitedNodes: [1],
      selectedEdges: [],
      activeEdge: {
        from: 1,
        to: 3,
      },
      pathNodes: [],
    },
  
    {
      step: 3,
      line: 5,
      label: "Add edge 1 → 3",
      detail:
        "Add edge 1 → 3 to the minimum spanning tree.",
      activeNode: 3,
      visitedNodes: [1, 3],
      selectedEdges: [
        {
          from: 1,
          to: 3,
          weight: 2,
        },
      ],
      activeEdge: null,
      pathNodes: [],
    },
  
    {
      step: 4,
      line: 3,
      label: "Find minimum edge",
      detail:
        "The available edges from the current tree include 3 → 5 with weight 2.",
      activeNode: 3,
      visitedNodes: [1, 3],
      selectedEdges: [
        {
          from: 1,
          to: 3,
          weight: 2,
        },
      ],
      activeEdge: {
        from: 3,
        to: 5,
      },
      pathNodes: [],
    },
  
    {
      step: 5,
      line: 5,
      label: "Add edge 3 → 5",
      detail:
        "Add edge 3 → 5 because it is the minimum-weight edge connecting the tree to an unvisited node.",
      activeNode: 5,
      visitedNodes: [1, 3, 5],
      selectedEdges: [
        {
          from: 1,
          to: 3,
          weight: 2,
        },
        {
          from: 3,
          to: 5,
          weight: 2,
        },
      ],
      activeEdge: null,
      pathNodes: [],
    },
  
    {
      step: 6,
      line: 3,
      label: "Find minimum edge",
      detail:
        "From the current tree, edge 5 → 2 has weight 1, which is the smallest available edge.",
      activeNode: 5,
      visitedNodes: [1, 3, 5],
      selectedEdges: [
        {
          from: 1,
          to: 3,
          weight: 2,
        },
        {
          from: 3,
          to: 5,
          weight: 2,
        },
      ],
      activeEdge: {
        from: 2,
        to: 5,
      },
      pathNodes: [],
    },
  
    {
      step: 7,
      line: 5,
      label: "Add edge 2 → 5",
      detail:
        "Add edge 2 → 5 with weight 1 to the MST.",
      activeNode: 2,
      visitedNodes: [1, 2, 3, 5],
      selectedEdges: [
        {
          from: 1,
          to: 3,
          weight: 2,
        },
        {
          from: 3,
          to: 5,
          weight: 2,
        },
        {
          from: 2,
          to: 5,
          weight: 1,
        },
      ],
      activeEdge: null,
      pathNodes: [],
    },
  
    {
      step: 8,
      line: 3,
      label: "Find minimum edge",
      detail:
        "The remaining unvisited nodes are 4 and 6. Edge 2 → 4 has weight 3 and edge 5 → 6 has weight 2. Choose 5 → 6.",
      activeNode: 5,
      visitedNodes: [1, 2, 3, 5],
      selectedEdges: [
        {
          from: 1,
          to: 3,
          weight: 2,
        },
        {
          from: 3,
          to: 5,
          weight: 2,
        },
        {
          from: 2,
          to: 5,
          weight: 1,
        },
      ],
      activeEdge: {
        from: 5,
        to: 6,
      },
      pathNodes: [],
    },
  
    {
      step: 9,
      line: 5,
      label: "Add edge 5 → 6",
      detail:
        "Add edge 5 → 6 with weight 2 to the MST.",
      activeNode: 6,
      visitedNodes: [1, 2, 3, 5, 6],
      selectedEdges: [
        {
          from: 1,
          to: 3,
          weight: 2,
        },
        {
          from: 3,
          to: 5,
          weight: 2,
        },
        {
          from: 2,
          to: 5,
          weight: 1,
        },
        {
          from: 5,
          to: 6,
          weight: 2,
        },
      ],
      activeEdge: null,
      pathNodes: [],
    },
  
    {
      step: 10,
      line: 3,
      label: "Find final edge",
      detail:
        "Node 4 is the only unvisited node. The edge 2 → 4 has weight 3.",
      activeNode: 2,
      visitedNodes: [1, 2, 3, 5, 6],
      selectedEdges: [
        {
          from: 1,
          to: 3,
          weight: 2,
        },
        {
          from: 3,
          to: 5,
          weight: 2,
        },
        {
          from: 2,
          to: 5,
          weight: 1,
        },
        {
          from: 5,
          to: 6,
          weight: 2,
        },
      ],
      activeEdge: {
        from: 2,
        to: 4,
      },
      pathNodes: [],
    },
  
    {
      step: 11,
      line: 5,
      label: "Add edge 2 → 4",
      detail:
        "Add edge 2 → 4. Every node is now connected and the MST contains V - 1 edges.",
      activeNode: 4,
      visitedNodes: [1, 2, 3, 4, 5, 6],
      selectedEdges: [
        {
          from: 1,
          to: 3,
          weight: 2,
        },
        {
          from: 3,
          to: 5,
          weight: 2,
        },
        {
          from: 2,
          to: 5,
          weight: 1,
        },
        {
          from: 5,
          to: 6,
          weight: 2,
        },
        {
          from: 2,
          to: 4,
          weight: 3,
        },
      ],
      activeEdge: null,
      pathNodes: [],
    },
  
    {
      step: 12,
      line: 6,
      label: "Minimum spanning tree complete",
      detail:
        "The MST is complete. Its total weight is 10.",
      activeNode: null,
      visitedNodes: [1, 2, 3, 4, 5, 6],
      selectedEdges: [
        {
          from: 1,
          to: 3,
          weight: 2,
        },
        {
          from: 3,
          to: 5,
          weight: 2,
        },
        {
          from: 2,
          to: 5,
          weight: 1,
        },
        {
          from: 5,
          to: 6,
          weight: 2,
        },
        {
          from: 2,
          to: 4,
          weight: 3,
        },
      ],
      activeEdge: null,
      pathNodes: [],
    },
  ];
  const kruskalsLines: TraceLine[] = [
    {
      line: 1,
      code: "sort all edges by weight",
    },
    {
      line: 2,
      code: "for each edge",
    },
    {
      line: 3,
      code: "check whether adding edge creates a cycle",
    },
    {
      line: 4,
      code: "if no cycle",
    },
    {
      line: 5,
      code: "add edge to MST",
    },
    {
      line: 6,
      code: "continue until MST has V - 1 edges",
    },
  ];
  
  const kruskalsFrames: TraceFrame[] = [
    {
      step: 0,
      line: 1,
      label: "Sort edges",
      detail:
        "Sort all graph edges from smallest to largest weight.",
      activeNode: null,
      visitedNodes: [],
      selectedEdges: [],
      activeEdge: null,
      pathNodes: [],
    },
  
    {
      step: 1,
      line: 2,
      label: "Check edge 2 → 5",
      detail:
        "The smallest edge has weight 1. Check whether adding 2 → 5 creates a cycle.",
      activeNode: 5,
      visitedNodes: [2, 5],
      selectedEdges: [],
      activeEdge: {
        from: 2,
        to: 5,
      },
      pathNodes: [],
    },
  
    {
      step: 2,
      line: 5,
      label: "Add edge 2 → 5",
      detail:
        "No cycle would be created, so add 2 → 5 to the MST.",
      activeNode: 5,
      visitedNodes: [2, 5],
      selectedEdges: [
        {
          from: 2,
          to: 5,
          weight: 1,
        },
      ],
      activeEdge: null,
      pathNodes: [],
    },
  
    {
      step: 3,
      line: 2,
      label: "Check edge 1 → 3",
      detail:
        "The next smallest edge has weight 2. Check edge 1 → 3.",
      activeNode: 3,
      visitedNodes: [1, 2, 3, 5],
      selectedEdges: [
        {
          from: 2,
          to: 5,
          weight: 1,
        },
      ],
      activeEdge: {
        from: 1,
        to: 3,
      },
      pathNodes: [],
    },
  
    {
      step: 4,
      line: 5,
      label: "Add edge 1 → 3",
      detail:
        "Adding 1 → 3 does not create a cycle, so add it to the MST.",
      activeNode: 3,
      visitedNodes: [1, 2, 3, 5],
      selectedEdges: [
        {
          from: 2,
          to: 5,
          weight: 1,
        },
        {
          from: 1,
          to: 3,
          weight: 2,
        },
      ],
      activeEdge: null,
      pathNodes: [],
    },
  
    {
      step: 5,
      line: 2,
      label: "Check edge 1 → 3",
      detail:
        "The edge 1 → 3 has already been processed. Continue to the next edge with weight 2.",
      activeNode: 1,
      visitedNodes: [1, 2, 3, 5],
      selectedEdges: [
        {
          from: 2,
          to: 5,
          weight: 1,
        },
        {
          from: 1,
          to: 3,
          weight: 2,
        },
      ],
      activeEdge: null,
      pathNodes: [],
    },
  
    {
      step: 6,
      line: 2,
      label: "Check edge 3 → 5",
      detail:
        "Edge 3 → 5 has weight 2. Check whether it creates a cycle.",
      activeNode: 5,
      visitedNodes: [1, 2, 3, 5],
      selectedEdges: [
        {
          from: 2,
          to: 5,
          weight: 1,
        },
        {
          from: 1,
          to: 3,
          weight: 2,
        },
      ],
      activeEdge: {
        from: 3,
        to: 5,
      },
      pathNodes: [],
    },
  
    {
      step: 7,
      line: 5,
      label: "Add edge 3 → 5",
      detail:
        "Adding 3 → 5 does not create a cycle, so add it to the MST.",
      activeNode: 5,
      visitedNodes: [1, 2, 3, 5],
      selectedEdges: [
        {
          from: 2,
          to: 5,
          weight: 1,
        },
        {
          from: 1,
          to: 3,
          weight: 2,
        },
        {
          from: 3,
          to: 5,
          weight: 2,
        },
      ],
      activeEdge: null,
      pathNodes: [],
    },
  
    {
      step: 8,
      line: 2,
      label: "Check edge 5 → 6",
      detail:
        "The next useful edge has weight 2. Check edge 5 → 6.",
      activeNode: 5,
      visitedNodes: [1, 2, 3, 5],
      selectedEdges: [
        {
          from: 2,
          to: 5,
          weight: 1,
        },
        {
          from: 1,
          to: 3,
          weight: 2,
        },
        {
          from: 3,
          to: 5,
          weight: 2,
        },
      ],
      activeEdge: {
        from: 5,
        to: 6,
      },
      pathNodes: [],
    },
  
    {
      step: 9,
      line: 5,
      label: "Add edge 5 → 6",
      detail:
        "Adding 5 → 6 does not create a cycle, so add it to the MST.",
      activeNode: 6,
      visitedNodes: [1, 2, 3, 5, 6],
      selectedEdges: [
        {
          from: 2,
          to: 5,
          weight: 1,
        },
        {
          from: 1,
          to: 3,
          weight: 2,
        },
        {
          from: 3,
          to: 5,
          weight: 2,
        },
        {
          from: 5,
          to: 6,
          weight: 2,
        },
      ],
      activeEdge: null,
      pathNodes: [],
    },
  
    {
      step: 10,
      line: 2,
      label: "Check edge 2 → 4",
      detail:
        "The next edge has weight 3. Check whether 2 → 4 creates a cycle.",
      activeNode: 2,
      visitedNodes: [1, 2, 3, 5, 6],
      selectedEdges: [
        {
          from: 2,
          to: 5,
          weight: 1,
        },
        {
          from: 1,
          to: 3,
          weight: 2,
        },
        {
          from: 3,
          to: 5,
          weight: 2,
        },
        {
          from: 5,
          to: 6,
          weight: 2,
        },
      ],
      activeEdge: {
        from: 2,
        to: 4,
      },
      pathNodes: [],
    },
  
    {
      step: 11,
      line: 5,
      label: "Add edge 2 → 4",
      detail:
        "Adding 2 → 4 does not create a cycle, so add it to the MST.",
      activeNode: 4,
      visitedNodes: [1, 2, 3, 4, 5, 6],
      selectedEdges: [
        {
          from: 2,
          to: 5,
          weight: 1,
        },
        {
          from: 1,
          to: 3,
          weight: 2,
        },
        {
          from: 3,
          to: 5,
          weight: 2,
        },
        {
          from: 5,
          to: 6,
          weight: 2,
        },
        {
          from: 2,
          to: 4,
          weight: 3,
        },
      ],
      activeEdge: null,
      pathNodes: [],
    },
  
    {
      step: 12,
      line: 6,
      label: "Minimum spanning tree complete",
      detail:
        "The MST now contains V - 1 edges. Its total weight is 10.",
      activeNode: null,
      visitedNodes: [1, 2, 3, 4, 5, 6],
      selectedEdges: [
        {
          from: 2,
          to: 5,
          weight: 1,
        },
        {
          from: 1,
          to: 3,
          weight: 2,
        },
        {
          from: 3,
          to: 5,
          weight: 2,
        },
        {
          from: 5,
          to: 6,
          weight: 2,
        },
        {
          from: 2,
          to: 4,
          weight: 3,
        },
      ],
      activeEdge: null,
      pathNodes: [],
    },
  ];
  /* =========================================================
     EXPORTS
  ========================================================= */
  
  export const dijkstraTrace: AlgorithmTrace = {
    lines: dijkstraLines,
    frames: dijkstraFrames,
  };
  
  export const primsTrace: AlgorithmTrace = {
    lines: primsLines,
    frames: primsFrames,
  };
  
  export const kruskalsTrace: AlgorithmTrace = {
    lines: kruskalsLines,
    frames: kruskalsFrames,
  };