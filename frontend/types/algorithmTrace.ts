export type TraceLine = {
    line: number;
    code: string;
  };
  
  export type TraceFrame = {
    step: number;
    line: number;
  
    label: string;
    detail: string;
  
    activeNode: number | null;
  
    visitedNodes: number[];
  
    queue?: number[];
    stack?: number[];
  
    distances?: Record<number, number>;
  
    activeEdge?: {
      from: number;
      to: number;
    } | null;
  
    selectedEdges?: {
      from: number;
      to: number;
      weight?: number;
    }[];
  
    pathNodes?: number[];
  };
  
  export type AlgorithmTrace = {
    lines: TraceLine[];
    frames: TraceFrame[];
  };