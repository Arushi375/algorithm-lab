"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { insertionSortAPI } from "@/lib/api";
import type { SortingTraceFrame } from "@/types/sortingTrace";

export type SortStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed";

const DEFAULT_ARRAY = [
  64,
  34,
  25,
  12,
  22,
  11,
  90,
];

export function useInsertionSort(
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

  const [moves, setMoves] = useState(0);

  const [speed, setSpeed] = useState(500);

  // -----------------------------------------
  // TRACE STATE
  // -----------------------------------------

  const [traceFrames, setTraceFrames] =
    useState<SortingTraceFrame[]>([]);

  const [currentTraceStep, setCurrentTraceStep] =
    useState(0);

  // -----------------------------------------
  // ALGORITHM REFS
  // -----------------------------------------

  const arrayRef = useRef([...initialArray]);

  // Current element being inserted
  const iRef = useRef(1);

  // Element currently being compared
  const jRef = useRef(0);

  // Value being inserted
  const keyRef = useRef<number | null>(null);

  const statusRef =
    useRef<SortStatus>("idle");

  const comparisonsRef = useRef(0);
  const movesRef = useRef(0);

  const backendResultRef =
    useRef<number[] | null>(null);

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

        moves: movesRef.current,
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
  // INSERTION SORT STEP
  // -----------------------------------------

  const step = useCallback(() => {
    if (
      statusRef.current === "completed"
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

    if (iRef.current >= n) {
      setComparing([]);
      setSwapping([]);

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

      addTraceFrame({
        line: 7,
        label: "Sorting complete",
        detail:
          "All elements have been inserted into their correct positions. The array is sorted.",
      });

      return;
    }

    // ---------------------------------------
    // START A NEW INSERTION
    // ---------------------------------------

    if (keyRef.current === null) {
      keyRef.current =
        values[iRef.current];

      jRef.current =
        iRef.current - 1;

      addTraceFrame({
        line: 1,
        label: "Select next element",
        detail: `Select ${keyRef.current} as the element to insert into the sorted portion of the array.`,
      });
    }

    const j = jRef.current;
    const i = iRef.current;
    const key = keyRef.current;

    // ---------------------------------------
    // COMPARE
    // ---------------------------------------

    if (j >= 0 && key !== null) {
      setComparing([j, i]);
      setSwapping([]);

      comparisonsRef.current += 1;

      setComparisons(
        comparisonsRef.current
      );

      addTraceFrame({
        line: 3,
        label: "Compare elements",
        detail: `Compare ${values[j]} with ${key}.`,
        comparing: [j, i],
      });

      // -------------------------------------
      // SHIFT ELEMENT
      // -------------------------------------

      if (values[j] > key) {
        addTraceFrame({
          line: 4,
          label: "Element is larger",
          detail: `${values[j]} is greater than ${key}, so it must be shifted one position to the right.`,
          comparing: [j, i],
        });

        values[j + 1] = values[j];

        arrayRef.current = values;

        setArray([...values]);

        setSwapping([
          j,
          j + 1,
        ]);

        movesRef.current += 1;

        setMoves(movesRef.current);

        addTraceFrame({
          line: 5,
          label: "Shift element",
          detail: `Move ${values[j + 1]} from index ${j} to index ${j + 1}.`,
          swapping: [
            j,
            j + 1,
          ],
        });

        jRef.current--;

        return;
      }

      // -------------------------------------
      // ELEMENT ALREADY IN CORRECT ORDER
      // -------------------------------------

      addTraceFrame({
        line: 6,
        label: "Correct position found",
        detail: `${key} is greater than or equal to ${values[j]}, so no more shifting is required.`,
        comparing: [j, i],
      });
    }

    // ---------------------------------------
    // INSERT KEY
    // ---------------------------------------

    const insertIndex =
      jRef.current + 1;

    if (keyRef.current !== null) {
      values[insertIndex] =
        keyRef.current;
    }

    arrayRef.current = values;

    setArray([...values]);

    setSwapping([insertIndex]);

    movesRef.current += 1;

    setMoves(movesRef.current);

    addTraceFrame({
      line: 6,
      label: "Insert element",
      detail: `Insert ${keyRef.current} at index ${insertIndex}.`,
      swapping: [insertIndex],
    });

    // ---------------------------------------
    // NEXT ELEMENT
    // ---------------------------------------

    iRef.current++;

    keyRef.current = null;
    jRef.current = 0;

    setComparing([]);
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
          await insertionSortAPI(
            arrayRef.current
          );

        backendResultRef.current =
          result.array;

        statusRef.current =
          "running";

        setStatus("running");
      } catch (error) {
        console.error(
          "Insertion Sort API error:",
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
    statusRef.current = "paused";

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

      iRef.current = 1;
      jRef.current = 0;

      keyRef.current = null;

      comparisonsRef.current = 0;
      movesRef.current = 0;

      statusRef.current = "idle";

      backendResultRef.current =
        null;

      setArray(values);

      setStatus("idle");

      setComparing([]);
      setSwapping([]);

      setComparisons(0);
      setMoves(0);

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
    const newArray = Array.from(
      { length: 8 },
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
    moves,

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