
"use client";

import SearchAlgorithmPage from "@/components/SearchAlgorithmPage";
import { binarySearchLanguages } from "@/data/algorithms/binarySearch";
import { useBinarySearch } from "@/hooks/useBinarySearch";

export default function BinarySearchPage() {
  const binarySearch = useBinarySearch();

  return (
    <SearchAlgorithmPage
      title="Binary Search"
      description="Find a target value by repeatedly dividing a sorted array in half."
      array={binarySearch.array}
      target={binarySearch.target}
      status={binarySearch.status}
      currentIndex={binarySearch.currentIndex}
      comparisons={binarySearch.comparisons}
      speed={binarySearch.speed}
      setSpeed={binarySearch.setSpeed}
      setTarget={binarySearch.setTarget}
      start={binarySearch.start}
      pause={binarySearch.pause}
      step={binarySearch.step}
      randomize={binarySearch.randomize}
      reset={binarySearch.reset}
      explanation={
        <>
          <p>
            Binary Search works on a sorted array. Instead of checking
            every element one by one, it checks the middle element and
            eliminates half of the remaining search space.
          </p>

          <p className="mt-4">
            If the middle value is smaller than the target, we continue
            searching on the right side. If the middle value is larger
            than the target, we continue searching on the left side.
          </p>

          <p className="mt-4">
            We repeat this process until the target is found or there
            are no elements left to search.
          </p>
        </>
      }
      complexity={{
        best: "O(1)",
        average: "O(log n)",
        worst: "O(log n)",
        space: "O(1)",
      }}
      languages={binarySearchLanguages}
    />
  );
}
