"use client";

import AlgorithmPage from "@/components/AlgorithmPage";

import { useSelectionSort } from "@/hooks/useSelectionSort";

import { selectionSortCode } from "@/data/algorithms/selectionSort";

export default function SelectionSortPage() {
  const {
    array,
    status,
    comparing,
    swapping,
    comparisons,
    swaps,
    speed,
    setSpeed,
    start,
    pause,
    step,
    randomize,
    reset,
  } = useSelectionSort();

  return (
    <AlgorithmPage
      title="Selection Sort"
      description="Repeatedly finds the smallest element in the unsorted portion and places it at the beginning."
      array={array}
      status={status}
      comparing={comparing}
      swapping={swapping}
      comparisons={comparisons}
      moves={swaps}
      speed={speed}
      setSpeed={setSpeed}
      start={start}
      pause={pause}
      step={step}
      randomize={randomize}
      reset={() => reset()}
      complexity={{
        best: "O(n²)",
        average: "O(n²)",
        worst: "O(n²)",
        space: "O(1)",
      }}
      explanation={
        <div className="space-y-4">
          <p>
            Selection Sort divides the array into a sorted portion
            and an unsorted portion.
          </p>

          <p>
            During each pass, it searches the unsorted portion to
            find the smallest element.
          </p>

          <p>
            Once the smallest element is found, it is swapped with
            the first element of the unsorted portion.
          </p>

          <p>
            The sorted portion grows by one element after every pass.
          </p>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
            <p className="mb-3 font-medium text-white">
              Example
            </p>

            <div className="font-mono text-sm">
              <p>[5, 3, 4, 1]</p>
              <p>→ [1, 3, 4, 5]</p>
            </div>
          </div>
        </div>
      }
      languages={selectionSortCode}
    />
  );
}