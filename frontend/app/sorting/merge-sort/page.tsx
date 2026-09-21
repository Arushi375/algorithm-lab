
"use client";

import { useMergeSort } from "@/hooks/useMergeSort";
import AlgorithmPage from "@/components/AlgorithmPage";
import { mergeSortCode } from "@/data/algorithms/mergeSort";

export default function MergeSortPage() {
  const mergeSort = useMergeSort();

  return (
    <AlgorithmPage
      title="Merge Sort"
      description="Merge Sort divides an array into smaller subarrays, recursively sorts them, and then merges the sorted pieces together."
      array={mergeSort.array}
      status={mergeSort.status}
      comparing={mergeSort.comparing}
      swapping={mergeSort.swapping}
      comparisons={mergeSort.comparisons}
      moves={mergeSort.moves}
      speed={mergeSort.speed}
      setSpeed={mergeSort.setSpeed}
      start={mergeSort.start}
      pause={mergeSort.pause}
      step={mergeSort.step}
      randomize={mergeSort.randomize}
      reset={mergeSort.reset}
      explanation={
        <>
          <p>
            Merge Sort uses a divide-and-conquer approach. It repeatedly
            divides the array into smaller sections until each section
            contains only one element.
          </p>

          <p className="mt-4">
            The algorithm then compares elements from the smaller sections
            and merges them back together in sorted order.
          </p>

          <p className="mt-4">
            Because the array is repeatedly divided into halves, Merge Sort
            has a time complexity of O(n log n).
          </p>
        </>
      }
      complexity={{
        best: "O(n log n)",
        average: "O(n log n)",
        worst: "O(n log n)",
        space: "O(n)",
      }}
      languages={mergeSortCode}
    />
  );
}
