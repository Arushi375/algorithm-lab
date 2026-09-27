
  
  export type GraphEdge = {
    from: number;
    to: number;
    weight?: number;
  };
  
  export type GraphNode = {
    id: number;
    label: string;
    x: number;
    y: number;
  };
  
  export type GraphData = {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  
  