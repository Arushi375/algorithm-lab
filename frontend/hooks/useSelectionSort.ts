"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { selectionSortAPI } from "@/lib/api";
export type SortStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed";

const DEFAULT_ARRAY = [64, 25, 12, 22, 11, 90, 34];

export function useSelectionSort(
  initialArray: number[] = DEFAULT_ARRAY
) {
  const [array, setArray] = useState<number[]>([
    ...initialArray,
  ]);

  const [status, setStatus] = useState<SortStatus>("idle");

  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);

  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);

  const [speed, setSpeed] = useState(500);

  const arrayRef = useRef([...initialArray]);

  // Current position where we need to place the minimum.
  const iRef = useRef(0);

  // Current element being searched.
  const jRef = useRef(1);

  // Index of the smallest element found so far.
  const minIndexRef = useRef(0);

  const statusRef = useRef<SortStatus>("idle");
  const backendResultRef = useRef<number[] | null>(null);
  const step = useCallback(() => {
    if (statusRef.current === "completed") {
      return;
    }

    const values = [...arrayRef.current];
    const n = values.length;

    // Sorting is finished.
    if (iRef.current >= n - 1) {
      setStatus("completed");
    
      statusRef.current = "completed";
    
      setComparing([]);
    
      setSwapping([]);
    
      if (backendResultRef.current) {
        arrayRef.current = [
          ...backendResultRef.current,
        ];
    
        setArray([
          ...backendResultRef.current,
        ]);
      }
    
      return;
    }

    const i = iRef.current;
    const j = jRef.current;
    const minIndex = minIndexRef.current;

    // Compare current element with current minimum.
    setComparing([j, minIndex]);
    setComparisons((prev) => prev + 1);

    if (values[j] < values[minIndex]) {
      minIndexRef.current = j;
    }

    // Move to the next element.
    jRef.current++;

    /*
     * We have finished searching the remaining
     * unsorted portion.
     */
    if (jRef.current >= n) {
      const newMinIndex = minIndexRef.current;

      // Swap the minimum with the current position.
      if (newMinIndex !== i) {
        const temp = values[i];

        values[i] = values[newMinIndex];
        values[newMinIndex] = temp;

        arrayRef.current = values;

        setArray(values);

        setSwapping([i, newMinIndex]);
        setSwaps((prev) => prev + 1);
      }

      // Start the next selection.
      iRef.current++;
      jRef.current = iRef.current + 1;
      minIndexRef.current = iRef.current;
    }
  }, []);

  /*
   * Automatically run while the algorithm is active.
   */
  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const timer = window.setInterval(() => {
      step();
    }, speed);

    return () => {
      window.clearInterval(timer);
    };
  }, [status, speed, step]);

  const start = useCallback(async () => {
    if (statusRef.current === "completed") {
      return;
    }
  
    try {
      const result = await selectionSortAPI(
        arrayRef.current
      );
  
      backendResultRef.current = result.array;
  
      statusRef.current = "running";
      setStatus("running");
    } catch (error) {
      console.error(
        "Selection Sort API error:",
        error
      );
    }
  }, []);

  const pause = useCallback(() => {
    statusRef.current = "paused";
    setStatus("paused");

    setComparing([]);
    setSwapping([]);
  }, []);

  const stepSort = useCallback(() => {
    if (statusRef.current === "running") {
      return;
    }

    step();
  }, [step]);

  const reset = useCallback(
    (newArray?: number[]) => {
      const valuesToUse = Array.isArray(newArray)
        ? newArray
        : initialArray;
  
      const values = [...valuesToUse];
  
      arrayRef.current = values;
  
      iRef.current = 0;
      jRef.current = 1;
      minIndexRef.current = 0;
  
      statusRef.current = "idle";
  
      backendResultRef.current = null;
  
      setArray(values);
      setStatus("idle");
      setComparing([]);
      setSwapping([]);
      setComparisons(0);
      setSwaps(0);
    },
    [initialArray]
  );

  const randomize = useCallback(() => {
    const newArray = Array.from(
      { length: 7 },
      () => Math.floor(Math.random() * 90) + 10
    );

    reset(newArray);
  }, [reset]);

  return {
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
    step: stepSort,

    reset,
    randomize,
  };
}