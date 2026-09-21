
"use client";

import { useBubbleSort } from "@/hooks/useBubbleSort";
import AlgorithmPage from "@/components/AlgorithmPage";
import { bubbleSortCode } from "@/data/algorithms/bubbleSort";

export default function BubbleSortPage() {
  const bubbleSort = useBubbleSort();

  return (
    <AlgorithmPage
      title="Bubble Sort"
      description="Bubble Sort repeatedly compares adjacent elements and swaps them when they are in the wrong order."
      array={bubbleSort.array}
      status={bubbleSort.status}
      comparing={bubbleSort.comparing}
      swapping={bubbleSort.swapping}
      comparisons={bubbleSort.comparisons}
      moves={bubbleSort.swaps}
      speed={bubbleSort.speed}
      setSpeed={bubbleSort.setSpeed}
      start={bubbleSort.start}
      pause={bubbleSort.pause}
      step={bubbleSort.step}
      randomize={bubbleSort.randomize}
      reset={bubbleSort.reset}
      explanation={
        <>
          <p>
            Bubble Sort works by repeatedly comparing neighboring elements.
            If two adjacent elements are in the wrong order, they are swapped.
          </p>

          <p className="mt-4">
            After each complete pass, the largest unsorted element moves to
            the end of the array. This process continues until the entire
            array is sorted.
          </p>

          <p className="mt-4">
            It is simple to understand and useful for learning sorting
            concepts, although it is not usually efficient for large datasets.
          </p>
        </>
      }
      complexity={{
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)",
      }}
      languages={bubbleSortCode}
    />
  );
}

