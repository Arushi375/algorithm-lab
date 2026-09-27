import type { GraphData } from "@/types/graph";
import type {
  AlgorithmTrace,
  TraceFrame,
  TraceLine,
} from "@/types/algorithmTrace";

const getNeighbors = (
  graph: GraphData,
  nodeId: number
) => {
  return graph.edges
    .filter((edge) => edge.from === nodeId)
    .map((edge) => edge.to);
};

function createFrame(
  frames: TraceFrame[],
  data: Omit<TraceFrame, "step">
) {
  frames.push({
    ...data,
    step: frames.length + 1,
  });
}

/* ------------------------------------------------------------------ */
/* BFS                                                                */
/* ------------------------------------------------------------------ */

export function createBFSTrace(
  graph: GraphData
): AlgorithmTrace {
  const lines: TraceLine[] = [
    {
      line: 1,
      code: "queue ← [start]",
    },
    {
      line: 2,
      code: "while queue is not empty",
    },
    {
      line: 3,
      code: "current ← queue.dequeue()",
    },
    {
      line: 4,
      code: "visit current",
    },
    {
      line: 5,
      code: "for each neighbor",
    },
    {
      line: 6,
      code: "enqueue unvisited neighbor",
    },
    {
      line: 7,
      code: "return traversal",
    },
  ];

  const frames: TraceFrame[] = [];

  if (graph.nodes.length === 0) {
    return { lines, frames };
  }

  const start = graph.nodes[0].id;

  const queue = [start];
  const discovered = new Set<number>([start]);
  const visited = new Set<number>();

  createFrame(frames, {
    line: 1,
    label: "Initialize queue",
    detail: `Node ${start} is added to the queue.`,
    activeNode: start,
    visitedNodes: [],
    queue: [...queue],
  });

  while (queue.length > 0) {
    createFrame(frames, {
      line: 2,
      label: "Check queue",
      detail: `The queue contains ${queue.length} node${
        queue.length === 1 ? "" : "s"
      }.`,
      activeNode: queue[0],
      visitedNodes: [...visited],
      queue: [...queue],
    });

    const current = queue.shift()!;

    createFrame(frames, {
      line: 3,
      label: "Remove next node",
      detail: `Node ${current} is removed from the front of the queue.`,
      activeNode: current,
      visitedNodes: [...visited],
      queue: [...queue],
    });

    visited.add(current);

    createFrame(frames, {
      line: 4,
      label: "Visit node",
      detail: `Node ${current} is now marked as visited.`,
      activeNode: current,
      visitedNodes: [...visited],
      queue: [...queue],
    });

    const neighbors = getNeighbors(graph, current);

    for (const neighbor of neighbors) {
      createFrame(frames, {
        line: 5,
        label: "Inspect neighbor",
        detail: `Checking whether node ${neighbor} has already been discovered.`,
        activeNode: neighbor,
        visitedNodes: [...visited],
        queue: [...queue],
      });

      if (!discovered.has(neighbor)) {
        discovered.add(neighbor);
        queue.push(neighbor);

        createFrame(frames, {
          line: 6,
          label: "Enqueue neighbor",
          detail: `Node ${neighbor} is added to the queue.`,
          activeNode: neighbor,
          visitedNodes: [...visited],
          queue: [...queue],
        });
      }
    }
  }

  createFrame(frames, {
    line: 7,
    label: "Traversal complete",
    detail: "Every reachable node has been processed.",
    activeNode: null,
    visitedNodes: [...visited],
    queue: [],
  });

  return {
    lines,
    frames,
  };
}

/* ------------------------------------------------------------------ */
/* DFS                                                                */
/* ------------------------------------------------------------------ */

export function createDFSTrace(
  graph: GraphData
): AlgorithmTrace {
  const lines: TraceLine[] = [
    {
      line: 1,
      code: "stack ← [start]",
    },
    {
      line: 2,
      code: "while stack is not empty",
    },
    {
      line: 3,
      code: "current ← stack.pop()",
    },
    {
      line: 4,
      code: "visit current",
    },
    {
      line: 5,
      code: "for each neighbor",
    },
    {
      line: 6,
      code: "push unvisited neighbor",
    },
    {
      line: 7,
      code: "return traversal",
    },
  ];

  const frames: TraceFrame[] = [];

  if (graph.nodes.length === 0) {
    return { lines, frames };
  }

  const start = graph.nodes[0].id;

  const stack = [start];
  const visited = new Set<number>();
  const discovered = new Set<number>([start]);

  createFrame(frames, {
    line: 1,
    label: "Initialize stack",
    detail: `Node ${start} is pushed onto the stack.`,
    activeNode: start,
    visitedNodes: [],
    stack: [...stack],
  });

  while (stack.length > 0) {
    createFrame(frames, {
      line: 2,
      label: "Check stack",
      detail: `The stack contains ${stack.length} node${
        stack.length === 1 ? "" : "s"
      }.`,
      activeNode: stack[stack.length - 1],
      visitedNodes: [...visited],
      stack: [...stack],
    });

    const current = stack.pop()!;

    createFrame(frames, {
      line: 3,
      label: "Pop next node",
      detail: `Node ${current} is removed from the top of the stack.`,
      activeNode: current,
      visitedNodes: [...visited],
      stack: [...stack],
    });

    if (visited.has(current)) {
      continue;
    }

    visited.add(current);

    createFrame(frames, {
      line: 4,
      label: "Visit node",
      detail: `Node ${current} is now marked as visited.`,
      activeNode: current,
      visitedNodes: [...visited],
      stack: [...stack],
    });

    const neighbors = getNeighbors(graph, current);

    for (const neighbor of [...neighbors].reverse()) {
      createFrame(frames, {
        line: 5,
        label: "Inspect neighbor",
        detail: `Checking node ${neighbor} before adding it to the stack.`,
        activeNode: neighbor,
        visitedNodes: [...visited],
        stack: [...stack],
      });

      if (
        !visited.has(neighbor) &&
        !discovered.has(neighbor)
      ) {
        discovered.add(neighbor);
        stack.push(neighbor);

        createFrame(frames, {
          line: 6,
          label: "Push neighbor",
          detail: `Node ${neighbor} is pushed onto the stack.`,
          activeNode: neighbor,
          visitedNodes: [...visited],
          stack: [...stack],
        });
      }
    }
  }

  createFrame(frames, {
    line: 7,
    label: "Traversal complete",
    detail: "Every reachable node has been processed.",
    activeNode: null,
    visitedNodes: [...visited],
    stack: [],
  });

  return {
    lines,
    frames,
  };
}

/* ------------------------------------------------------------------ */
/* DIJKSTRA                                                           */
/* ------------------------------------------------------------------ */

export function createDijkstraTrace(
  graph: GraphData
): AlgorithmTrace {
  const lines: TraceLine[] = [
    {
      line: 1,
      code: "distance[start] ← 0",
    },
    {
      line: 2,
      code: "while unvisited nodes remain",
    },
    {
      line: 3,
      code: "current ← node with lowest distance",
    },
    {
      line: 4,
      code: "mark current visited",
    },
    {
      line: 5,
      code: "for each neighbor",
    },
    {
      line: 6,
      code: "newDistance ← distance + weight",
    },
    {
      line: 7,
      code: "if newDistance < distance[neighbor]",
    },
    {
      line: 8,
      code: "update distance[neighbor]",
    },
    {
      line: 9,
      code: "return shortest distances",
    },
  ];

  const frames: TraceFrame[] = [];

  if (graph.nodes.length === 0) {
    return { lines, frames };
  }

  const start = graph.nodes[0].id;

  const distances: Record<number, number> = {};

  graph.nodes.forEach((node) => {
    distances[node.id] = Infinity;
  });

  distances[start] = 0;

  const visited = new Set<number>();

  createFrame(frames, {
    line: 1,
    label: "Initialize distances",
    detail: `Starting distance for node ${start} is set to 0.`,
    activeNode: start,
    visitedNodes: [],
    distances: { ...distances },
  });

  while (visited.size < graph.nodes.length) {
    createFrame(frames, {
      line: 2,
      label: "Check unvisited nodes",
      detail: "Dijkstra searches for the unvisited node with the smallest known distance.",
      activeNode: null,
      visitedNodes: [...visited],
      distances: { ...distances },
    });

    let current: number | null = null;

    for (const node of graph.nodes) {
      if (visited.has(node.id)) {
        continue;
      }

      if (
        current === null ||
        distances[node.id] <
          distances[current]
      ) {
        current = node.id;
      }
    }

    if (
      current === null ||
      distances[current] === Infinity
    ) {
      break;
    }

    createFrame(frames, {
      line: 3,
      label: "Select lowest-distance node",
      detail: `Node ${current} has the smallest known distance: ${distances[current]}.`,
      activeNode: current,
      visitedNodes: [...visited],
      distances: { ...distances },
    });

    visited.add(current);

    createFrame(frames, {
      line: 4,
      label: "Mark node visited",
      detail: `Node ${current} is finalized and will not be processed again.`,
      activeNode: current,
      visitedNodes: [...visited],
      distances: { ...distances },
    });

    const edges = graph.edges.filter(
      (edge) => edge.from === current
    );

    for (const edge of edges) {
      createFrame(frames, {
        line: 5,
        label: "Inspect neighbor",
        detail: `Checking edge ${current} → ${edge.to}.`,
        activeNode: edge.to,
        visitedNodes: [...visited],
        distances: { ...distances },
      });

      const weight = edge.weight ?? 1;

      const newDistance =
        distances[current] + weight;

      createFrame(frames, {
        line: 6,
        label: "Calculate new distance",
        detail: `${distances[current]} + ${weight} = ${newDistance}.`,
        activeNode: edge.to,
        visitedNodes: [...visited],
        distances: { ...distances },
      });

      createFrame(frames, {
        line: 7,
        label: "Compare distances",
        detail: `Compare ${newDistance} with the current distance of node ${edge.to}.`,
        activeNode: edge.to,
        visitedNodes: [...visited],
        distances: { ...distances },
      });

      if (newDistance < distances[edge.to]) {
        distances[edge.to] = newDistance;

        createFrame(frames, {
          line: 8,
          label: "Update shortest distance",
          detail: `Node ${edge.to} now has shortest known distance ${newDistance}.`,
          activeNode: edge.to,
          visitedNodes: [...visited],
          distances: { ...distances },
        });
      }
    }
  }

  createFrame(frames, {
    line: 9,
    label: "Shortest paths complete",
    detail: "The shortest known distance to every reachable node has been determined.",
    activeNode: null,
    visitedNodes: [...visited],
    distances: { ...distances },
  });

  return {
    lines,
    frames,
  };
}