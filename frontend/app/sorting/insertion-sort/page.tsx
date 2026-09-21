"use client";

import AlgorithmPage from "@/components/AlgorithmPage";
import { useInsertionSort } from "@/hooks/useInsertionSort";
import { insertionSortCode } from "@/data/algorithms/insertionSort";

export default function InsertionSortPage() {
  const {
    array,
    status,
    comparing,
    swapping,
    comparisons,
    moves,
    speed,
    setSpeed,
    start,
    pause,
    step,
    randomize,
    reset,
  } = useInsertionSort();

  return (
    <AlgorithmPage
      title="Insertion Sort"
      description="Builds a sorted portion of the array one element at a time by inserting each element into its correct position."
      array={array}
      status={status}
      comparing={comparing}
      swapping={swapping}
      comparisons={comparisons}
      moves={moves}
      speed={speed}
      setSpeed={setSpeed}
      start={start}
      pause={pause}
      step={step}
      randomize={randomize}
      reset={() => reset()}
      complexity={{
        best: "O(n)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)",
      }}
      explanation={
        <div className="space-y-4">
          <p>
            Insertion Sort divides the array into a sorted portion
            and an unsorted portion.
          </p>

          <p>
            It takes the next element from the unsorted portion and
            compares it with the elements before it.
          </p>

          <p>
            Larger elements are shifted to the right until the
            correct position for the current element is found.
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
            <p className="mb-3 font-medium text-white">
              Example
            </p>

            <div className="font-mono text-sm">
              <p>[5, 3, 4, 1]</p>
              <p>→ [3, 5, 4, 1]</p>
              <p>→ [3, 4, 5, 1]</p>
              <p>→ [1, 3, 4, 5]</p>
            </div>
          </div>
        </div>
      }
      languages={insertionSortCode}
    />
  );
}