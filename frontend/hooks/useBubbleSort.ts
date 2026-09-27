"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { bubbleSortAPI } from "@/lib/api";
import type { SortingTraceFrame } from "@/types/sortingTrace";

export type SortStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed";

const DEFAULT_ARRAY = [35, 75, 25, 90, 45, 10, 60, 50];

export function useBubbleSort(
  initialArray: number[] = DEFAULT_ARRAY
) {
  const [array, setArray] = useState<number[]>([
    ...initialArray,
  ]);

  const [status, setStatus] =
    useState<SortStatus>("idle");

  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);

  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);

  const [speed, setSpeed] = useState(500);

  // -----------------------------------------
  // TRACE STATE
  // -----------------------------------------

  const [traceFrames, setTraceFrames] = useState<
    SortingTraceFrame[]
  >([]);

  const [currentTraceStep, setCurrentTraceStep] =
    useState(0);

  // -----------------------------------------
  // REFS
  // -----------------------------------------

  const arrayRef = useRef([...initialArray]);
  const iRef = useRef(0);
  const jRef = useRef(0);
  const statusRef = useRef<SortStatus>("idle");

  const comparisonsRef = useRef(0);
  const swapsRef = useRef(0);

  const backendResultRef = useRef<number[] | null>(null);

  // -----------------------------------------
  // CREATE TRACE FRAME
  // -----------------------------------------

  const addTraceFrame = useCallback(
    ({
      line,
      label,
      detail,
      comparing: comparingIndexes = [],
      swapping: swappingIndexes = [],
    }: {
      line: number;
      label: string;
      detail: string;
      comparing?: number[];
      swapping?: number[];
    }) => {
      const frame: SortingTraceFrame = {
        step: currentTraceStep + 1,
        line,
        label,
        detail,

        comparing: [...comparingIndexes],
        swapping: [...swappingIndexes],

        array: [...arrayRef.current],

        comparisons: comparisonsRef.current,
        moves: swapsRef.current,
      };

      setTraceFrames((frames) => [
        ...frames,
        frame,
      ]);

      setCurrentTraceStep((step) => step + 1);
    },
    [currentTraceStep]
  );

  // -----------------------------------------
  // BUBBLE SORT STEP
  // -----------------------------------------

  const step = useCallback(() => {
    const values = [...arrayRef.current];
    const n = values.length;

    if (n < 2) {
      statusRef.current = "completed";
      setStatus("completed");

      addTraceFrame({
        line: 7,
        label: "Array already sorted",
        detail:
          "The array contains fewer than two elements, so no sorting is required.",
      });

      return;
    }

    // -----------------------------------------
    // SORTING COMPLETE
    // -----------------------------------------

    if (iRef.current >= n - 1) {
      statusRef.current = "completed";
      setStatus("completed");

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

      addTraceFrame({
        line: 7,
        label: "Array sorted",
        detail:
          "All passes are complete. The array is now sorted.",
      });

      return;
    }

    const left = jRef.current;
    const right = jRef.current + 1;

    // -----------------------------------------
    // COMPARE
    // -----------------------------------------

    setComparing([left, right]);
    setSwapping([]);

    comparisonsRef.current += 1;

    setComparisons(
      comparisonsRef.current
    );

    addTraceFrame({
      line: 3,
      label: "Compare elements",
      detail: `Compare ${values[left]} and ${values[right]}.`,
      comparing: [left, right],
    });

    // -----------------------------------------
    // SWAP
    // -----------------------------------------

    if (values[left] > values[right]) {
      addTraceFrame({
        line: 4,
        label: "Elements are out of order",
        detail: `${values[left]} is greater than ${values[right]}, so the elements need to be swapped.`,
        comparing: [left, right],
      });

      const temporary = values[left];

      values[left] = values[right];
      values[right] = temporary;

      arrayRef.current = values;

      setArray([...values]);

      setSwapping([left, right]);

      swapsRef.current += 1;

      setSwaps(swapsRef.current);

      addTraceFrame({
        line: 5,
        label: "Swap elements",
        detail: `Swap ${values[right]} and ${values[left]}.`,
        swapping: [left, right],
      });
    } else {
      addTraceFrame({
        line: 6,
        label: "No swap needed",
        detail: `${values[left]} and ${values[right]} are already in the correct order.`,
        comparing: [left, right],
      });
    }

    // -----------------------------------------
    // MOVE TO NEXT PAIR
    // -----------------------------------------

    jRef.current++;

    if (
      jRef.current >=
      n - iRef.current - 1
    ) {
      jRef.current = 0;
      iRef.current++;
    }

    // -----------------------------------------
    // FINAL COMPLETION CHECK
    // -----------------------------------------

    if (iRef.current >= n - 1) {
      statusRef.current = "completed";
      setStatus("completed");

      if (backendResultRef.current) {
        arrayRef.current = [
          ...backendResultRef.current,
        ];

        setArray([
          ...backendResultRef.current,
        ]);
      }

      setComparing([]);
      setSwapping([]);

      addTraceFrame({
        line: 7,
        label: "Sorting complete",
        detail:
          "Bubble Sort has finished and the array is sorted.",
      });
    }
  }, [addTraceFrame]);

  // -----------------------------------------
  // AUTOMATIC EXECUTION
  // -----------------------------------------

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const interval = window.setInterval(() => {
      if (statusRef.current === "running") {
        step();
      }
    }, speed);

    return () => {
      window.clearInterval(interval);
    };
  }, [status, speed, step]);

  // -----------------------------------------
  // START
  // -----------------------------------------

  const start = useCallback(async () => {
    if (statusRef.current === "completed") {
      return;
    }

    try {
      const result = await bubbleSortAPI(
        arrayRef.current
      );

      backendResultRef.current =
        result.array;

      statusRef.current = "running";

      setStatus("running");
    } catch (error) {
      console.error(
        "Bubble Sort API error:",
        error
      );
    }
  }, []);

  // -----------------------------------------
  // PAUSE
  // -----------------------------------------

  const pause = useCallback(() => {
    statusRef.current = "paused";
    setStatus("paused");
  }, []);

  // -----------------------------------------
  // RESET
  // -----------------------------------------

  const reset = useCallback(
    (newArray?: number[]) => {
      const values = Array.isArray(newArray)
        ? newArray
        : initialArray;

      const copiedArray = [...values];

      arrayRef.current = copiedArray;

      iRef.current = 0;
      jRef.current = 0;

      comparisonsRef.current = 0;
      swapsRef.current = 0;

      statusRef.current = "idle";

      backendResultRef.current = null;

      setArray(copiedArray);
      setStatus("idle");

      setComparing([]);
      setSwapping([]);

      setComparisons(0);
      setSwaps(0);

      // Reset trace
      setTraceFrames([]);
      setCurrentTraceStep(0);
    },
    [initialArray]
  );

  // -----------------------------------------
  // RANDOMIZE
  // -----------------------------------------

  const randomize = useCallback(() => {
    console.log(
      "randomize function called"
    );

    const randomArray = Array.from(
      { length: 8 },
      () =>
        Math.floor(
          Math.random() * 90
        ) + 10
    );

    console.log(
      "new array:",
      randomArray
    );

    reset(randomArray);
  }, [reset]);

  // -----------------------------------------
  // RETURN
  // -----------------------------------------

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
    reset,
    randomize,
    step,

    // Trace
    traceFrames,
    currentTraceStep,
  };
}