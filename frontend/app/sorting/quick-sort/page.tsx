
"use client";

import { useQuickSort } from "@/hooks/useQuickSort";
import AlgorithmPage from "@/components/AlgorithmPage";
import { quickSortLanguages } from "@/data/algorithms/quickSort";

export default function QuickSortPage() {
  const quickSort = useQuickSort();

  return (
    <AlgorithmPage
      title="Quick Sort"
      description="Quick Sort uses a pivot to partition an array into smaller sections and recursively sorts those sections."
      array={quickSort.array}
      status={quickSort.status}
      comparing={quickSort.comparing}
      swapping={quickSort.swapping}
      comparisons={quickSort.comparisons}
      moves={quickSort.moves}
      speed={quickSort.speed}
      setSpeed={quickSort.setSpeed}
      start={quickSort.start}
      pause={quickSort.pause}
      step={quickSort.step}
      randomize={quickSort.randomize}
      reset={quickSort.reset}
      explanation={
        <>
          <p>
            Quick Sort uses a divide-and-conquer strategy. It selects an
            element as a pivot and rearranges the array so that smaller
            elements are placed before the pivot and larger elements are
            placed after it.
          </p>

          <p className="mt-4">
            The pivot is then in its final sorted position. Quick Sort
            recursively applies the same process to the elements on the
            left and right of the pivot.
          </p>

          <p className="mt-4">
            With a reasonably balanced partition, Quick Sort runs in
            O(n log n) time. Its worst case occurs when partitions are
            highly unbalanced.
          </p>
        </>
      }
      complexity={{
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n²)",
        space: "O(log n)",
      }}
      languages={quickSortLanguages}
    />
  );
}

