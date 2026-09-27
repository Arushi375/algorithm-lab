import type {
    GraphData,
    GraphEdge,
  } from "@/types/graph";
  
  const ROWS = 6;
  const COLS = 10;
  
  function nodeId(row: number, col: number) {
    return row * COLS + col + 1;
  }
  
  export const pathfindingGrid: GraphData = {
    nodes: Array.from(
      { length: ROWS * COLS },
      (_, index) => {
        const row = Math.floor(index / COLS);
        const col = index % COLS;
  
        return {
          id: index + 1,
          x: col,
          y: row,
        };
      }
    ),
  
    edges: createEdges(),
  };
  
  function createEdges(): GraphEdge[] {
    const edges: GraphEdge[] = [];
  
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const current = nodeId(row, col);
  
        // Right
        if (col < COLS - 1) {
          const right = nodeId(row, col + 1);
  
          edges.push({
            from: current,
            to: right,
            weight: getWeight(current, right),
          });
        }
  
        // Down
        if (row < ROWS - 1) {
          const down = nodeId(row + 1, col);
  
          edges.push({
            from: current,
            to: down,
            weight: getWeight(current, down),
          });
        }
      }
    }
  
    return edges;
  }
  
  function getWeight(
    from: number,
    to: number
  ) {
    return 1 + ((from * 7 + to * 3) % 4);
  }