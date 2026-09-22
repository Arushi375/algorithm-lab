"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { quickSortAPI } from "@/lib/api";

type SortStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed";

type QuickSortStep =
  | {
      type: "compare";
      index1: number;
      index2: number;
    }
  | {
      type: "swap";
      index1: number;
      index2: number;
      array: number[];
    };

const initialArray = [
  72,
  34,
  91,
  18,
  56,
  43,
  27,
  65,
];

export function useQuickSort() {
  const [array, setArray] =
    useState<number[]>([
      ...initialArray,
    ]);

  const [status, setStatus] =
    useState<SortStatus>("idle");

  const [comparing, setComparing] =
    useState<number[]>([]);

  const [swapping, setSwapping] =
    useState<number[]>([]);

  const [comparisons, setComparisons] =
    useState(0);

  const [moves, setMoves] =
    useState(0);

  const [speed, setSpeed] =
    useState(500);

  const stepsRef =
    useRef<QuickSortStep[]>([]);

  const stepIndexRef =
    useRef(0);

  const statusRef =
    useRef<SortStatus>("idle");

  const backendResultRef =
    useRef<number[] | null>(null);

  /*
   * Create all Quick Sort visualization
   * operations before the animation starts.
   */
  const createSteps = useCallback(
    (inputArray: number[]) => {
      const arr = [...inputArray];

      const steps: QuickSortStep[] = [];

      const partition = (
        low: number,
        high: number
      ): number => {
        const pivot = arr[high];

        let i = low - 1;

        for (
          let j = low;
          j < high;
          j++
        ) {
          /*
           * One comparison.
           */
          steps.push({
            type: "compare",
            index1: j,
            index2: high,
          });

          if (arr[j] < pivot) {
            i++;

            if (i !== j) {
              /*
               * One swap.
               */
              const temp = arr[i];

              arr[i] = arr[j];
              arr[j] = temp;

              steps.push({
                type: "swap",
                index1: i,
                index2: j,
                array: [...arr],
              });
            }
          }
        }

        /*
         * Put pivot into its final position.
         */
        if (i + 1 !== high) {
          const temp = arr[i + 1];

          arr[i + 1] = arr[high];
          arr[high] = temp;

          steps.push({
            type: "swap",
            index1: i + 1,
            index2: high,
            array: [...arr],
          });
        }

        return i + 1;
      };

      const sort = (
        low: number,
        high: number
      ): void => {
        if (low >= high) {
          return;
        }

        const pivotIndex = partition(
          low,
          high
        );

        sort(
          low,
          pivotIndex - 1
        );

        sort(
          pivotIndex + 1,
          high
        );
      };

      sort(
        0,
        arr.length - 1
      );

      return steps;
    },
    []
  );

  /*
   * Perform exactly ONE visualization
   * operation.
   */
  const performStep = useCallback(() => {
    const steps = stepsRef.current;

    const currentIndex =
      stepIndexRef.current;

    /*
     * Sorting is finished.
     */
    if (
      currentIndex >= steps.length
    ) {
      setComparing([]);
      setSwapping([]);

      if (
        backendResultRef.current
      ) {
        setArray([
          ...backendResultRef.current,
        ]);
      }

      statusRef.current =
        "completed";

      setStatus("completed");

      return;
    }

    const currentStep =
      steps[currentIndex];

    /*
     * Comparison step.
     */
    if (
      currentStep.type ===
      "compare"
    ) {
      setComparing([
        currentStep.index1,
        currentStep.index2,
      ]);

      setSwapping([]);

      setComparisons(
        (value) => value + 1
      );
    }

    /*
     * Swap step.
     */
    if (
      currentStep.type ===
      "swap"
    ) {
      setComparing([]);

      setSwapping([
        currentStep.index1,
        currentStep.index2,
      ]);

      setArray([
        ...currentStep.array,
      ]);

      setMoves(
        (value) => value + 1
      );
    }

    stepIndexRef.current++;
  }, []);

  /*
   * Automatically perform one step
   * according to the selected speed.
   */
  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const timer =
      window.setInterval(() => {
        if (
          statusRef.current ===
          "running"
        ) {
          performStep();
        }
      }, speed);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    status,
    speed,
    performStep,
  ]);

  /*
   * Start Quick Sort.
   */
  const start = useCallback(
    async () => {
      if (
        statusRef.current ===
          "running" ||
        statusRef.current ===
          "completed"
      ) {
        return;
      }

      try {
        /*
         * Get the final answer from
         * FastAPI.
         */
        const result =
          await quickSortAPI(
            array
          );

        backendResultRef.current =
          result.array;

        /*
         * Build the visualization
         * operations from the current array.
         */
        stepsRef.current =
          createSteps(array);

        stepIndexRef.current = 0;

        setComparisons(0);
        setMoves(0);

        setComparing([]);
        setSwapping([]);

        statusRef.current =
          "running";

        setStatus("running");
      } catch (error) {
        console.error(
          "Quick Sort API error:",
          error
        );

        statusRef.current =
          "idle";

        setStatus("idle");
      }
    },
    [array, createSteps]
  );

  /*
   * Pause the animation.
   */
  const pause = useCallback(() => {
    if (
      statusRef.current !==
      "running"
    ) {
      return;
    }

    statusRef.current =
      "paused";

    setStatus("paused");

    setComparing([]);
    setSwapping([]);
  }, []);

  /*
   * Manually perform ONE step.
   */
  const step = useCallback(() => {
    /*
     * Don't allow manual stepping
     * while automatic animation is running.
     */
    if (
      statusRef.current ===
      "running"
    ) {
      return;
    }

    /*
     * If we haven't created the
     * operations yet, create them.
     */
    if (
      stepsRef.current.length === 0
    ) {
      stepsRef.current =
        createSteps(array);

      stepIndexRef.current = 0;

      backendResultRef.current =
        null;

      setComparisons(0);
      setMoves(0);

      setComparing([]);
      setSwapping([]);
    }

    /*
     * Make sure we're in paused/idle
     * state while manually stepping.
     */
    statusRef.current =
      "paused";

    setStatus("paused");

    performStep();
  }, [
    array,
    createSteps,
    performStep,
  ]);

  /*
   * Generate a new random array.
   */
  const randomize = useCallback(() => {
    const newArray =
      Array.from(
        { length: 8 },
        () =>
          Math.floor(
            Math.random() * 90
          ) + 10
      );

    stepsRef.current = [];

    stepIndexRef.current = 0;

    backendResultRef.current =
      null;

    statusRef.current =
      "idle";

    setArray(newArray);

    setStatus("idle");

    setComparing([]);
    setSwapping([]);

    setComparisons(0);
    setMoves(0);
  }, []);

  /*
   * Reset to the original array.
   */
  const reset = useCallback(() => {
    stepsRef.current = [];

    stepIndexRef.current = 0;

    backendResultRef.current =
      null;

    statusRef.current =
      "idle";

    setArray([
      ...initialArray,
    ]);

    setStatus("idle");

    setComparing([]);
    setSwapping([]);

    setComparisons(0);
    setMoves(0);
  }, []);

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
    step,
    randomize,
    reset,
  };
}