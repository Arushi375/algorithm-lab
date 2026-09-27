export type TraceLine = {
    line: number;
    code: string;
  };
  
  export type AlgorithmTraceStep = {
    line: number;
    label: string;
    description: string;
  
    activeNode: number | null;
  
    visitedNodes: number[];
  
    queue?: number[];
    stack?: number[];
  
    distances?: Record<number, number>;
  };