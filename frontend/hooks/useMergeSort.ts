"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { mergeSortAPI } from "@/lib/api";

import type { SortingTraceFrame } from "@/types/sortingTrace";

export type SortStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed";

const DEFAULT_ARRAY = [
  72,
  34,
  91,
  18,
  56,
  43,
  27,
  65,
];

export function useMergeSort(
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
  // REFS
  // -----------------------------------------

  const arrayRef = useRef([
    ...initialArray,
  ]);

  const statusRef =
    useRef<SortStatus>("idle");

  const comparisonsRef = useRef(0);

  const movesRef = useRef(0);

  const backendResultRef =
    useRef<number[] | null>(null);

  // -----------------------------------------
  // MERGE SORT STEP STATE
  // -----------------------------------------

  /*
   * Merge Sort is recursive, so instead of
   * i/j indexes like Bubble Sort, we keep
   * track of the current merge operation.
   */

  const mergeSizeRef = useRef(1);

  const mergeLeftRef = useRef(0);

  const mergeIndexRef = useRef(0);

  const mergePhaseRef = useRef<
    "compare" | "left" | "right" | "done"
  >("compare");

  const leftPartRef = useRef<number[]>([]);

  const rightPartRef = useRef<number[]>([]);

  const leftIndexRef = useRef(0);

  const rightIndexRef = useRef(0);

  const writeIndexRef = useRef(0);

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
  // PREPARE NEXT MERGE
  // -----------------------------------------

  const prepareMerge = useCallback(() => {
    const values = [...arrayRef.current];

    const n = values.length;

    const size = mergeSizeRef.current;

    const left = mergeLeftRef.current;

    /*
     * No more merge ranges in this pass.
     */
    if (left >= n) {
      mergeSizeRef.current *= 2;

      mergeLeftRef.current = 0;

      if (mergeSizeRef.current >= n) {
        return false;
      }

      return prepareMerge();
    }

    const middle = Math.min(
      left + size,
      n
    );

    const right = Math.min(
      left + size * 2,
      n
    );

    /*
     * If there is no right half,
     * move to the next merge.
     */
    if (middle >= right) {
      mergeLeftRef.current =
        left + size * 2;

      return prepareMerge();
    }

    leftPartRef.current =
      values.slice(left, middle);

    rightPartRef.current =
      values.slice(middle, right);

    leftIndexRef.current = 0;

    rightIndexRef.current = 0;

    writeIndexRef.current = left;

    mergeIndexRef.current = left;

    mergePhaseRef.current = "compare";

    addTraceFrame({
      line: 4,
      label: "Split array",
      detail: `Preparing to merge two sorted sections starting at position ${left}.`,
    });

    return true;
  }, [addTraceFrame]);

  // -----------------------------------------
  // MERGE SORT STEP
  // -----------------------------------------

  const step = useCallback(() => {
    const values = [
      ...arrayRef.current,
    ];

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

    if (
      mergeSizeRef.current >= n &&
      mergeLeftRef.current === 0 &&
      mergePhaseRef.current === "done"
    ) {
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
        label: "Sorting complete",
        detail:
          "Merge Sort has finished and the array is sorted.",
      });

      return;
    }

    // -----------------------------------------
    // PREPARE A MERGE
    // -----------------------------------------

    if (
      mergePhaseRef.current === "done"
    ) {
      const prepared = prepareMerge();

      if (!prepared) {
        mergePhaseRef.current = "done";

        if (
          mergeSizeRef.current >= n
        ) {
          statusRef.current =
            "completed";

          setStatus("completed");

          if (
            backendResultRef.current
          ) {
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
              "Merge Sort has finished and the array is sorted.",
          });
        }

        return;
      }
    }

    // -----------------------------------------
    // PREPARE FIRST MERGE
    // -----------------------------------------

    if (
      leftPartRef.current.length === 0 &&
      rightPartRef.current.length === 0
    ) {
      const prepared = prepareMerge();

      if (!prepared) {
        mergePhaseRef.current = "done";

        return;
      }
    }

    const left =
      mergeLeftRef.current;

    const leftPart =
      leftPartRef.current;

    const rightPart =
      rightPartRef.current;

    const leftIndex =
      leftIndexRef.current;

    const rightIndex =
      rightIndexRef.current;

    const writeIndex =
      writeIndexRef.current;

    // -----------------------------------------
    // COMPARE
    // -----------------------------------------

    if (
      mergePhaseRef.current ===
      "compare"
    ) {
      if (
        leftIndex <
          leftPart.length &&
        rightIndex <
          rightPart.length
      ) {
        const leftPosition =
          left + leftIndex;

        const rightPosition =
          left +
          mergeSizeRef.current +
          rightIndex;

        comparisonsRef.current += 1;

        setComparisons(
          comparisonsRef.current
        );

        setComparing([
          leftPosition,
          rightPosition,
        ]);

        setSwapping([]);

        addTraceFrame({
          line: 8,
          label: "Compare elements",
          detail: `Compare ${leftPart[leftIndex]} and ${rightPart[rightIndex]}.`,
          comparing: [
            leftPosition,
            rightPosition,
          ],
        });

        /*
         * Decide which side should be
         * written during the NEXT step.
         */

        if (
          leftPart[leftIndex] <=
          rightPart[rightIndex]
        ) {
          mergePhaseRef.current =
            "left";
        } else {
          mergePhaseRef.current =
            "right";
        }

        return;
      }

      /*
       * Left side exhausted.
       */
      if (
        leftIndex >=
        leftPart.length
      ) {
        mergePhaseRef.current =
          "right";

        return step();
      }

      /*
       * Right side exhausted.
       */
      if (
        rightIndex >=
        rightPart.length
      ) {
        mergePhaseRef.current =
          "left";

        return step();
      }
    }

    // -----------------------------------------
    // WRITE LEFT ELEMENT
    // -----------------------------------------

    if (
      mergePhaseRef.current ===
      "left"
    ) {
      if (
        leftIndexRef.current <
        leftPart.length
      ) {
        const value =
          leftPart[
            leftIndexRef.current
          ];

        values[
          writeIndexRef.current
        ] = value;

        arrayRef.current = [
          ...values,
        ];

        setArray([...values]);

        setComparing([]);

        setSwapping([
          writeIndexRef.current,
        ]);

        movesRef.current += 1;

        setMoves(
          movesRef.current
        );

        addTraceFrame({
          line: 10,
          label: "Take left element",
          detail: `${value} is smaller or equal, so it is placed at position ${writeIndexRef.current}.`,
          swapping: [
            writeIndexRef.current,
          ],
        });

        leftIndexRef.current += 1;

        writeIndexRef.current += 1;

        mergePhaseRef.current =
          "compare";

        return;
      }

      mergePhaseRef.current =
        "right";

      return step();
    }

    // -----------------------------------------
    // WRITE RIGHT ELEMENT
    // -----------------------------------------

    if (
      mergePhaseRef.current ===
      "right"
    ) {
      if (
        rightIndexRef.current <
        rightPart.length
      ) {
        const value =
          rightPart[
            rightIndexRef.current
          ];

        values[
          writeIndexRef.current
        ] = value;

        arrayRef.current = [
          ...values,
        ];

        setArray([...values]);

        setComparing([]);

        setSwapping([
          writeIndexRef.current,
        ]);

        movesRef.current += 1;

        setMoves(
          movesRef.current
        );

        addTraceFrame({
          line: 12,
          label: "Take right element",
          detail: `${value} is smaller, so it is placed at position ${writeIndexRef.current}.`,
          swapping: [
            writeIndexRef.current,
          ],
        });

        rightIndexRef.current += 1;

        writeIndexRef.current += 1;

        mergePhaseRef.current =
          "compare";

        return;
      }

      // -----------------------------------------
      // MERGE COMPLETE
      // -----------------------------------------

      mergeLeftRef.current +=
        mergeSizeRef.current * 2;

      leftPartRef.current = [];
      rightPartRef.current = [];

      setComparing([]);
      setSwapping([]);

      mergePhaseRef.current =
        "done";

      return;
    }
  }, [addTraceFrame, prepareMerge]);

  // -----------------------------------------
  // AUTOMATIC EXECUTION
  // -----------------------------------------

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const interval =
      window.setInterval(() => {
        if (
          statusRef.current ===
          "running"
        ) {
          step();
        }
      }, speed);

    return () => {
      window.clearInterval(
        interval
      );
    };
  }, [status, speed, step]);

  // -----------------------------------------
  // START
  // -----------------------------------------

  const start = useCallback(async () => {
    if (
      statusRef.current ===
      "completed"
    ) {
      return;
    }

    try {
      const result =
        await mergeSortAPI(
          arrayRef.current
        );

      backendResultRef.current =
        result.array;

      statusRef.current =
        "running";

      setStatus("running");
    } catch (error) {
      console.error(
        "Merge Sort API error:",
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
      const values =
        Array.isArray(newArray)
          ? newArray
          : initialArray;

      const copiedArray = [
        ...values,
      ];

      arrayRef.current =
        copiedArray;

      statusRef.current =
        "idle";

      backendResultRef.current =
        null;

      mergeSizeRef.current = 1;

      mergeLeftRef.current = 0;

      mergeIndexRef.current = 0;

      mergePhaseRef.current =
        "compare";

      leftPartRef.current = [];
      rightPartRef.current = [];

      leftIndexRef.current = 0;
      rightIndexRef.current = 0;
      writeIndexRef.current = 0;

      comparisonsRef.current = 0;
      movesRef.current = 0;

      setArray(copiedArray);

      setStatus("idle");

      setComparing([]);
      setSwapping([]);

      setComparisons(0);
      setMoves(0);

      setTraceFrames([]);
      setCurrentTraceStep(0);
    },
    [initialArray]
  );

  // -----------------------------------------
  // RANDOMIZE
  // -----------------------------------------

  const randomize = useCallback(() => {
    const randomArray =
      Array.from(
        { length: 8 },
        () =>
          Math.floor(
            Math.random() * 90
          ) + 10
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
    moves,
    speed,
    setSpeed,

    start,
    pause,
    reset,
    randomize,
    step,

    traceFrames,
    currentTraceStep,
  };
}