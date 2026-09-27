import type {
    SortingTrace,
    SortingTraceFrame,
    SortingTraceLine,
  } from "@/types/sortingTrace";
  
  const bubbleSortLines: SortingTraceLine[] = [
    {
      line: 1,
      code: "for each pass through the array",
    },
    {
      line: 2,
      code: "for each adjacent pair",
    },
    {
      line: 3,
      code: "compare current and next element",
    },
    {
      line: 4,
      code: "if current > next",
    },
    {
      line: 5,
      code: "swap the elements",
    },
    {
      line: 6,
      code: "continue until no swaps are needed",
    },
    {
      line: 7,
      code: "return the sorted array",
    },
  ];
  
  export function createBubbleSortFrame({
    step,
    line,
    label,
    detail,
    comparing,
    swapping,
    array,
    comparisons,
    moves,
  }: Omit<SortingTraceFrame, "step"> & {
    step: number;
  }): SortingTraceFrame {
    return {
      step,
      line,
      label,
      detail,
      comparing,
      swapping,
      array: [...array],
      comparisons,
      moves,
    };
  }
  
  export function createBubbleSortTrace(
    frames: SortingTraceFrame[]
  ): SortingTrace {
    return {
      lines: bubbleSortLines,
      frames,
    };
  }