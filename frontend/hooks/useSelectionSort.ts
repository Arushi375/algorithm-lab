"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { selectionSortAPI } from "@/lib/api";
import type { SortingTraceFrame } from "@/types/sortingTrace";

export type SortStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed";

const DEFAULT_ARRAY = [
  64,
  25,
  12,
  22,
  11,
  90,
  34,
];

export function useSelectionSort(
  initialArray: number[] = DEFAULT_ARRAY
) {
  const [array, setArray] = useState<number[]>([
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

  const [swaps, setSwaps] =
    useState(0);

  const [speed, setSpeed] =
    useState(500);

  // -----------------------------------------
  // TRACE STATE
  // -----------------------------------------

  const [traceFrames, setTraceFrames] =
    useState<SortingTraceFrame[]>([]);

  const [currentTraceStep, setCurrentTraceStep] =
    useState(0);

  // -----------------------------------------
  // ALGORITHM STATE
  // -----------------------------------------

  const arrayRef =
    useRef([...initialArray]);

  // Current position where minimum
  // needs to be placed.
  const iRef = useRef(0);

  // Current element being searched.
  const jRef = useRef(1);

  // Smallest element found so far.
  const minIndexRef = useRef(0);

  const statusRef =
    useRef<SortStatus>("idle");

  const backendResultRef =
    useRef<number[] | null>(null);

  const comparisonsRef = useRef(0);
  const swapsRef = useRef(0);

  // -----------------------------------------
  // ADD TRACE FRAME
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

        comparisons:
          comparisonsRef.current,

        moves: swapsRef.current,
      };

      setTraceFrames((frames) => [
        ...frames,
        frame,
      ]);

      setCurrentTraceStep(
        (step) => step + 1
      );
    },
    [currentTraceStep]
  );

  // -----------------------------------------
  // ONE SELECTION SORT STEP
  // -----------------------------------------

  const step = useCallback(() => {
    if (
      statusRef.current ===
      "completed"
    ) {
      return;
    }

    const values = [
      ...arrayRef.current,
    ];

    const n = values.length;

    // ---------------------------------------
    // SORTING COMPLETE
    // ---------------------------------------

    if (iRef.current >= n - 1) {
      setComparing([]);
      setSwapping([]);

      statusRef.current =
        "completed";

      setStatus("completed");

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
        label: "Sorting complete",
        detail:
          "All positions have been processed and the array is sorted.",
      });

      return;
    }

    const i = iRef.current;
    const j = jRef.current;
    const minIndex =
      minIndexRef.current;

    // ---------------------------------------
    // COMPARE
    // ---------------------------------------

    setComparing([
      j,
      minIndex,
    ]);

    setSwapping([]);

    comparisonsRef.current += 1;

    setComparisons(
      comparisonsRef.current
    );

    addTraceFrame({
      line: 3,
      label: "Compare elements",
      detail: `Compare ${values[j]} with the current minimum ${values[minIndex]}.`,
      comparing: [
        j,
        minIndex,
      ],
    });

    // ---------------------------------------
    // NEW MINIMUM FOUND
    // ---------------------------------------

    if (
      values[j] <
      values[minIndex]
    ) {
      minIndexRef.current = j;

      addTraceFrame({
        line: 4,
        label: "New minimum found",
        detail: `${values[j]} is smaller than the current minimum, so index ${j} becomes the new minimum.`,
        comparing: [j],
      });
    }

    // ---------------------------------------
    // MOVE TO NEXT ELEMENT
    // ---------------------------------------

    jRef.current++;

    // ---------------------------------------
    // END OF CURRENT SEARCH
    // ---------------------------------------

    if (jRef.current >= n) {
      const newMinIndex =
        minIndexRef.current;

      // -------------------------------------
      // SWAP MINIMUM INTO POSITION
      // -------------------------------------

      if (newMinIndex !== i) {
        const temp =
          values[i];

        values[i] =
          values[newMinIndex];

        values[newMinIndex] =
          temp;

        arrayRef.current =
          values;

        setArray([...values]);

        setSwapping([
          i,
          newMinIndex,
        ]);

        swapsRef.current += 1;

        setSwaps(
          swapsRef.current
        );

        addTraceFrame({
          line: 5,
          label: "Swap elements",
          detail: `Move the minimum value ${values[i]} into position ${i}.`,
          swapping: [
            i,
            newMinIndex,
          ],
        });
      } else {
        addTraceFrame({
          line: 6,
          label: "Minimum already in position",
          detail: `The minimum value is already at index ${i}, so no swap is needed.`,
          comparing: [i],
        });
      }

      // -------------------------------------
      // START NEXT POSITION
      // -------------------------------------

      iRef.current++;

      jRef.current =
        iRef.current + 1;

      minIndexRef.current =
        iRef.current;
    }
  }, [addTraceFrame]);

  // -----------------------------------------
  // AUTOMATIC EXECUTION
  // -----------------------------------------

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
          step();
        }
      }, speed);

    return () => {
      window.clearInterval(timer);
    };
  }, [status, speed, step]);

  // -----------------------------------------
  // START
  // -----------------------------------------

  const start = useCallback(
    async () => {
      if (
        statusRef.current ===
        "completed"
      ) {
        return;
      }

      try {
        const result =
          await selectionSortAPI(
            arrayRef.current
          );

        backendResultRef.current =
          result.array;

        statusRef.current =
          "running";

        setStatus("running");
      } catch (error) {
        console.error(
          "Selection Sort API error:",
          error
        );
      }
    },
    []
  );

  // -----------------------------------------
  // PAUSE
  // -----------------------------------------

  const pause = useCallback(() => {
    statusRef.current =
      "paused";

    setStatus("paused");

    setComparing([]);
    setSwapping([]);
  }, []);

  // -----------------------------------------
  // MANUAL STEP
  // -----------------------------------------

  const stepSort = useCallback(() => {
    if (
      statusRef.current ===
      "running"
    ) {
      return;
    }

    step();
  }, [step]);

  // -----------------------------------------
  // RESET
  // -----------------------------------------

  const reset = useCallback(
    (newArray?: number[]) => {
      const valuesToUse =
        Array.isArray(newArray)
          ? newArray
          : initialArray;

      const values = [
        ...valuesToUse,
      ];

      arrayRef.current = values;

      iRef.current = 0;

      jRef.current = 1;

      minIndexRef.current = 0;

      comparisonsRef.current = 0;

      swapsRef.current = 0;

      statusRef.current = "idle";

      backendResultRef.current =
        null;

      setArray(values);

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
    const newArray =
      Array.from(
        { length: 7 },
        () =>
          Math.floor(
            Math.random() * 90
          ) + 10
      );

    reset(newArray);
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

    step: stepSort,

    reset,

    randomize,

    // Trace
    traceFrames,

    currentTraceStep,
  };
}