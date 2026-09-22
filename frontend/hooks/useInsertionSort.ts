"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { insertionSortAPI } from "@/lib/api";
export type SortStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed";

const DEFAULT_ARRAY = [64, 34, 25, 12, 22, 11, 90];

export function useInsertionSort(
  initialArray: number[] = DEFAULT_ARRAY
) {
  const [array, setArray] = useState<number[]>([
    ...initialArray,
  ]);

  const [status, setStatus] = useState<SortStatus>("idle");

  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);

  const [comparisons, setComparisons] = useState(0);
  const [moves, setMoves] = useState(0);

  const [speed, setSpeed] = useState(500);

  // Keep the actual algorithm state in refs.
  const arrayRef = useRef([...initialArray]);

  // i = current element being inserted
  const iRef = useRef(1);

  // j = element we are comparing against
  const jRef = useRef(0);

  // The value currently being inserted
  const keyRef = useRef<number | null>(null);

  const statusRef = useRef<SortStatus>("idle");
  const backendResultRef = useRef<number[] | null>(null);

  /*
   * Perform ONE step of insertion sort.
   */
  const step = useCallback(() => {
    if (statusRef.current === "completed") {
      return;
    }

    const values = [...arrayRef.current];
    const n = values.length;

    // Array is already sorted / finished.
    if (iRef.current >= n) {
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

    /*
     * Start processing a new element.
     */
    if (keyRef.current === null) {
      keyRef.current = values[iRef.current];
      jRef.current = iRef.current - 1;
    }

    const j = jRef.current;
    const i = iRef.current;

    // Compare current element with the previous element.
    if (j >= 0) {
      setComparing([j, i]);
      setComparisons((prev) => prev + 1);

      /*
       * Move the larger element one position to the right.
       */
      if (values[j] > keyRef.current) {
        values[j + 1] = values[j];

        arrayRef.current = values;

        setArray(values);

        setSwapping([j, j + 1]);
        setMoves((prev) => prev + 1);

        jRef.current--;

        return;
      }
    }

    /*
     * Insert the key into its correct position.
     */
    const insertIndex = j + 1;

    values[insertIndex] = keyRef.current!;

    arrayRef.current = values;

    setArray(values);

    setSwapping([insertIndex]);

    /*
     * Move to the next element.
     */
    iRef.current++;
    keyRef.current = null;
    jRef.current = 0;
  }, []);

  /*
   * Automatically execute steps while running.
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

  /*
   * Start sorting.
   */
  const start = useCallback(async () => {
    if (statusRef.current === "completed") {
      return;
    }
  
    try {
      const result = await insertionSortAPI(
        arrayRef.current
      );
  
      backendResultRef.current = result.array;
  
      statusRef.current = "running";
      setStatus("running");
    } catch (error) {
      console.error(
        "Insertion Sort API error:",
        error
      );
    }
  }, []);

  /*
   * Pause sorting.
   */
  const pause = useCallback(() => {
    statusRef.current = "paused";
    setStatus("paused");

    setComparing([]);
    setSwapping([]);
  }, []);

  /*
   * Execute exactly one step.
   */
  const stepSort = useCallback(() => {
    if (statusRef.current === "running") {
      return;
    }

    step();
  }, [step]);

  /*
   * Reset the algorithm.
   */
  const reset = useCallback(
    (newArray?: number[]) => {
      const valuesToUse = Array.isArray(newArray)
        ? newArray
        : initialArray;
  
      const values = [...valuesToUse];
  
      arrayRef.current = values;
      iRef.current = 1;
      jRef.current = 0;
      keyRef.current = null;
      statusRef.current = "idle";
  
      backendResultRef.current = null;
  
      setArray(values);
      setStatus("idle");
      setComparing([]);
      setSwapping([]);
      setComparisons(0);
      setMoves(0);
    },
    [initialArray]
  );

  /*
   * Generate a random array.
   */
  const randomize = useCallback(() => {
    const newArray = Array.from(
      { length: 8 },
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
    moves,

    speed,
    setSpeed,

    start,
    pause,
    step: stepSort,

    reset,
    randomize,
  };
}