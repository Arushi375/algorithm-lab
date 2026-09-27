"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { quickSortAPI } from "@/lib/api";

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

export function useQuickSort(
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
  // QUICK SORT STATE
  // -----------------------------------------

  const lowRef = useRef(0);

  const highRef = useRef(
    initialArray.length - 1
  );

  const iRef = useRef(-1);

  const jRef = useRef(0);

  const pivotIndexRef = useRef(
    initialArray.length - 1
  );

  const phaseRef = useRef<
    "partition" | "pivot" | "done"
  >("partition");

  const stackRef = useRef<
    { low: number; high: number }[]
  >([]);

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
  // PREPARE PARTITION
  // -----------------------------------------

  const preparePartition = useCallback(() => {
    const stack = stackRef.current;

    while (stack.length > 0) {
      const range = stack.pop();

      if (!range) {
        continue;
      }

      const { low, high } = range;

      if (low >= high) {
        continue;
      }

      lowRef.current = low;

      highRef.current = high;

      pivotIndexRef.current = high;

      iRef.current = low - 1;

      jRef.current = low;

      phaseRef.current = "partition";

      addTraceFrame({
        line: 2,
        label: "Choose pivot",
        detail: `Choose ${arrayRef.current[high]} as the pivot for positions ${low} through ${high}.`,
      });

      return true;
    }

    return false;
  }, [addTraceFrame]);

  // -----------------------------------------
  // QUICK SORT STEP
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
    // COMPLETE
    // -----------------------------------------

    if (
      phaseRef.current === "done"
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
          "Quick Sort has finished and the array is sorted.",
      });

      return;
    }

    // -----------------------------------------
    // PREPARE FIRST PARTITION
    // -----------------------------------------

    if (
      stackRef.current.length === 0 &&
      phaseRef.current === "partition" &&
      jRef.current === 0
    ) {
      if (
        lowRef.current === 0 &&
        highRef.current ===
          n - 1
      ) {
        stackRef.current = [
          {
            low: 0,
            high: n - 1,
          },
        ];

        if (!preparePartition()) {
          phaseRef.current = "done";
          return;
        }
      }
    }

    // -----------------------------------------
    // PARTITION
    // -----------------------------------------

    if (
      phaseRef.current ===
      "partition"
    ) {
      const low = lowRef.current;

      const high = highRef.current;

      const pivot =
        values[pivotIndexRef.current];

      const j = jRef.current;

      // ---------------------------------------
      // COMPARE CURRENT ELEMENT WITH PIVOT
      // ---------------------------------------

      if (j < high) {
        comparisonsRef.current += 1;

        setComparisons(
          comparisonsRef.current
        );

        setComparing([
          j,
          pivotIndexRef.current,
        ]);

        setSwapping([]);

        addTraceFrame({
          line: 3,
          label: "Compare with pivot",
          detail: `Compare ${values[j]} with pivot ${pivot}.`,
          comparing: [
            j,
            pivotIndexRef.current,
          ],
        });

        if (values[j] < pivot) {
          iRef.current += 1;

          const i = iRef.current;

          if (i !== j) {
            const temp = values[i];

            values[i] = values[j];

            values[j] = temp;

            arrayRef.current = [
              ...values,
            ];

            setArray([...values]);

            setComparing([]);

            setSwapping([i, j]);

            movesRef.current += 1;

            setMoves(
              movesRef.current
            );

            addTraceFrame({
              line: 5,
              label: "Swap elements",
              detail: `Move ${values[i]} into the lower partition.`,
              swapping: [i, j],
            });
          } else {
            addTraceFrame({
              line: 4,
              label: "Element already positioned",
              detail: `${values[j]} is smaller than the pivot and is already in the correct partition.`,
              comparing: [j],
            });
          }
        } else {
          addTraceFrame({
            line: 4,
            label: "Keep element on right",
            detail: `${values[j]} is greater than or equal to the pivot, so it remains in the right partition.`,
            comparing: [j],
          });
        }

        jRef.current += 1;

        return;
      }

      // ---------------------------------------
      // PLACE PIVOT
      // ---------------------------------------

      const pivotPosition =
        iRef.current + 1;

      if (
        pivotPosition !== high
      ) {
        const temp =
          values[pivotPosition];

        values[pivotPosition] =
          values[high];

        values[high] = temp;

        arrayRef.current = [
          ...values,
        ];

        setArray([...values]);

        setComparing([]);

        setSwapping([
          pivotPosition,
          high,
        ]);

        movesRef.current += 1;

        setMoves(
          movesRef.current
        );

        addTraceFrame({
          line: 6,
          label: "Place pivot",
          detail: `Move pivot ${values[pivotPosition]} into its final position at index ${pivotPosition}.`,
          swapping: [
            pivotPosition,
            high,
          ],
        });
      } else {
        setComparing([]);
        setSwapping([]);

        addTraceFrame({
          line: 6,
          label: "Pivot already positioned",
          detail: `Pivot ${pivot} is already in its final position.`,
        });
      }

      // ---------------------------------------
      // CREATE LEFT / RIGHT RANGES
      // ---------------------------------------

      const leftLow = low;

      const leftHigh =
        pivotPosition - 1;

      const rightLow =
        pivotPosition + 1;

      const rightHigh = high;

      stackRef.current = [];

      /*
       * Push right first so that the
       * left partition is processed first.
       */

      if (
        rightLow < rightHigh
      ) {
        stackRef.current.push({
          low: rightLow,
          high: rightHigh,
        });
      }

      if (
        leftLow < leftHigh
      ) {
        stackRef.current.push({
          low: leftLow,
          high: leftHigh,
        });
      }

      phaseRef.current =
        "partition";

      /*
       * Prepare the next partition.
       */
      if (
        preparePartition()
      ) {
        return;
      }

      // ---------------------------------------
      // EVERYTHING FINISHED
      // ---------------------------------------

      phaseRef.current = "done";

      statusRef.current =
        "completed";

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
          "Quick Sort has finished and the array is sorted.",
      });
    }
  }, [addTraceFrame, preparePartition]);

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
        await quickSortAPI(
          arrayRef.current
        );

      backendResultRef.current =
        result.array;

      /*
       * Initialize Quick Sort stack.
       */
      stackRef.current = [
        {
          low: 0,
          high:
            arrayRef.current.length -
            1,
        },
      ];

      lowRef.current = 0;

      highRef.current =
        arrayRef.current.length - 1;

      iRef.current = -1;

      jRef.current = 0;

      phaseRef.current =
        "partition";

      setComparisons(0);
      setMoves(0);

      comparisonsRef.current = 0;
      movesRef.current = 0;

      setComparing([]);
      setSwapping([]);

      statusRef.current = "running";

      setStatus("running");
    } catch (error) {
      console.error(
        "Quick Sort API error:",
        error
      );

      statusRef.current = "idle";

      setStatus("idle");
    }
  }, []);

  // -----------------------------------------
  // PAUSE
  // -----------------------------------------

  const pause = useCallback(() => {
    if (
      statusRef.current !==
      "running"
    ) {
      return;
    }

    statusRef.current = "paused";

    setStatus("paused");

    setComparing([]);
    setSwapping([]);
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

      statusRef.current = "idle";

      backendResultRef.current =
        null;

      stackRef.current = [];

      lowRef.current = 0;

      highRef.current =
        copiedArray.length - 1;

      iRef.current = -1;

      jRef.current = 0;

      pivotIndexRef.current =
        copiedArray.length - 1;

      phaseRef.current =
        "partition";

      comparisonsRef.current = 0;

      movesRef.current = 0;

      setArray(copiedArray);

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
    step,
    randomize,
    reset,

    traceFrames,
    currentTraceStep,
  };
}