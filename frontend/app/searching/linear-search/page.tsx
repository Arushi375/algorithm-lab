
"use client";

import SearchAlgorithmPage from "@/components/SearchAlgorithmPage";
import { useLinearSearch } from "@/hooks/useLinearSearch";
import { linearSearchLanguages } from "@/data/algorithms/linearSearch";

export default function LinearSearchPage() {
  const linearSearch = useLinearSearch();

  return (
    <SearchAlgorithmPage
      title="Linear Search"
      description="Linear Search checks each element in an array one by one until the target value is found or every element has been checked."
      array={linearSearch.array}
      target={linearSearch.target}
      status={linearSearch.status}
      currentIndex={linearSearch.currentIndex}
      comparisons={linearSearch.comparisons}
      speed={linearSearch.speed}
      setSpeed={linearSearch.setSpeed}
      setTarget={linearSearch.setTarget}
      start={linearSearch.start}
      pause={linearSearch.pause}
      step={linearSearch.step}
      randomize={linearSearch.randomize}
      reset={linearSearch.reset}
      explanation={
        <>
          <p>
            Linear Search is one of the simplest searching algorithms.
            It starts at the first element and compares each value with
            the target.
          </p>

          <p className="mt-4">
            If the current element matches the target, the search stops
            and the target has been found.
          </p>

          <p className="mt-4">
            If the current element does not match, the algorithm moves
            to the next element and continues until the target is found
            or the entire array has been checked.
          </p>

          <p className="mt-4">
            Linear Search does not require the array to be sorted.
          </p>
        </>
      }
      complexity={{
        best: "O(1)",
        average: "O(n)",
        worst: "O(n)",
        space: "O(1)",
      }}
      languages={linearSearchLanguages}
    />
  );
}

