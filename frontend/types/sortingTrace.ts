export type SortingTraceLine = {
    line: number;
    code: string;
  };
  
  export type SortingTraceFrame = {
    step: number;
    line: number;
  
    label: string;
    detail: string;
  
    comparing: number[];
    swapping: number[];
  
    array: number[];
  
    comparisons: number;
    moves: number;
  };
  
  export type SortingTrace = {
    lines: SortingTraceLine[];
    frames: SortingTraceFrame[];
  };