const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://127.0.0.1:8000";

/* =========================================================
   SEARCHING
========================================================= */

export type SearchResponse = {
  found: boolean;
  index: number;
  comparisons: number;
};

export async function linearSearchAPI(
  array: number[],
  target: number,
): Promise<SearchResponse> {
  const response = await fetch(
    `${API_URL}/api/searching/linear-search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        array,
        target,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to run Linear Search API",
    );
  }

  return response.json();
}

export async function binarySearchAPI(
  array: number[],
  target: number,
): Promise<SearchResponse> {
  const response = await fetch(
    `${API_URL}/api/searching/binary-search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        array,
        target,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to run Binary Search API",
    );
  }

  return response.json();
}

/* =========================================================
   SORTING
========================================================= */

export type SortResponse = {
  array: number[];
  comparisons: number;
  swaps: number;
};

export async function bubbleSortAPI(
  array: number[],
): Promise<SortResponse> {
  const response = await fetch(
    `${API_URL}/api/sorting/bubble-sort`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        array,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to run Bubble Sort API",
    );
  }

  return response.json();
}

export async function insertionSortAPI(
  array: number[],
): Promise<SortResponse> {
  const response = await fetch(
    `${API_URL}/api/sorting/insertion-sort`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        array,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to run Insertion Sort API",
    );
  }

  return response.json();
}

export async function selectionSortAPI(
  array: number[],
): Promise<SortResponse> {
  const response = await fetch(
    `${API_URL}/api/sorting/selection-sort`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        array,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to run Selection Sort API",
    );
  }

  return response.json();
}

export async function mergeSortAPI(
  array: number[],
): Promise<SortResponse> {
  const response = await fetch(
    `${API_URL}/api/sorting/merge-sort`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        array,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to run Merge Sort API",
    );
  }

  return response.json();
}

export async function quickSortAPI(
  array: number[],
): Promise<SortResponse> {
  const response = await fetch(
    `${API_URL}/api/sorting/quick-sort`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        array,
      }),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to run Quick Sort API",
    );
  }

  return response.json();
}

/* =========================================================
   GRAPH TYPES
========================================================= */

export type GraphNodeAPI = {
  id: number;
  label?: string;
  x?: number;
  y?: number;
};

export type GraphEdgeAPI = {
  from: number;
  to: number;
  weight?: number;
};

export type GraphRequest = {
  nodes: GraphNodeAPI[];
  edges: GraphEdgeAPI[];
  start_node: number;
};

/* =========================================================
   BFS
========================================================= */

export type BFSResponse = {
  visited: number[];
  order: number[];
};

export async function bfsAPI(
  graph: GraphRequest,
): Promise<BFSResponse> {
  const response = await fetch(
    `${API_URL}/api/graphs/bfs`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graph),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to run BFS API",
    );
  }

  return response.json();
}

/* =========================================================
   DFS
========================================================= */

export type DFSResponse = {
  visited: number[];
  order: number[];
};

export async function dfsAPI(
  graph: GraphRequest,
): Promise<DFSResponse> {
  const response = await fetch(
    `${API_URL}/api/graphs/dfs`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graph),
    },
  );

  if (!response.ok) {
    throw new Error(
      "Failed to run DFS API",
    );
  }

  return response.json();
}

/* =========================================================
   DIJKSTRA
========================================================= */

export type DijkstraStepAPI = {
  line: number;
  label: string;
  detail: string;
  active_node: number | null;
  visited_nodes: number[];
  distances: Record<string, number | null>;
  active_edge: {
    from: number;
    to: number;
  } | null;
};

export type DijkstraResponse = {
  order: number[];
  distances: Record<string, number | null>;
  steps: DijkstraStepAPI[];
};

export async function dijkstraAPI(
  graph: GraphRequest,
): Promise<DijkstraResponse> {
  const response = await fetch(
    `${API_URL}/api/pathfinding/dijkstra`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graph),
    },
  );

  if (!response.ok) {
    const detail = await response.text();

    throw new Error(
      `Dijkstra API failed (${response.status}): ${
        detail || response.statusText
      }`,
    );
  }

  return response.json();
}

/* =========================================================
   PRIM'S
========================================================= */

export type PrimEdgeAPI = {
  from: number;
  to: number;
  weight: number;
};

export type PrimStepAPI = {
  line: number;
  label: string;
  detail: string;
  active_node: number | null;
  visited_nodes: number[];
  active_edge: {
    from: number;
    to: number;
  } | null;
  selected_edges: PrimEdgeAPI[];
};

export type PrimResponse = {
  order: number[];
  selected_edges: PrimEdgeAPI[];
  steps: PrimStepAPI[];
};

export async function primsAPI(
  graph: GraphRequest,
): Promise<PrimResponse> {
  const response = await fetch(
    `${API_URL}/api/pathfinding/prims`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(graph),
    },
  );

  if (!response.ok) {
    const detail = await response.text();

    throw new Error(
      `Prim's API failed (${response.status}): ${
        detail || response.statusText
      }`,
    );
  }

  return response.json();
}

/* =========================================================
   KRUSKAL'S
========================================================= */

export type MSTResponse = {
  order: number[];
  selected_edges: PrimEdgeAPI[];
  steps: PrimStepAPI[];
};

export async function kruskalsAPI(data: {
    nodes: {
      id: number;
      label?: string;
      x?: number;
      y?: number;
    }[];
    edges: {
      from: number;
      to: number;
      weight?: number;
    }[];
    start_node: number;
  }) {
    const response = await fetch(`${API_URL}/api/pathfinding/kruskals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  
    if (!response.ok) {
      throw new Error(`Kruskal API error: ${response.status}`);
    }
  
    return response.json();
  }