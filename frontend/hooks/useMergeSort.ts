"use client";

import { useRef, useState } from "react";
import { mergeSortAPI } from "@/lib/api";

type SortStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed";

const initialArray = [72, 34, 91, 18, 56, 43, 27, 65];

export function useMergeSort() {
  const [array, setArray] = useState(initialArray);

  const [status, setStatus] =
    useState<SortStatus>("idle");

  const [comparing, setComparing] =
    useState<number[]>([]);

  const [swapping, setSwapping] =
    useState<number[]>([]);

  const [comparisons, setComparisons] = useState(0);

  const [moves, setMoves] = useState(0);

  const [speed, setSpeed] = useState(500);

  const pausedRef = useRef(false);
  const stopRef = useRef(false);

  // Stores the sorted result returned by FastAPI.
  const backendResultRef = useRef<number[] | null>(null);

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });

  const waitIfPaused = async () => {
    while (
      pausedRef.current &&
      !stopRef.current
    ) {
      await sleep(100);
    }
  };

  const merge = async (
    arr: number[],
    left: number,
    middle: number,
    right: number
  ) => {
    const leftPart = arr.slice(
      left,
      middle + 1
    );

    const rightPart = arr.slice(
      middle + 1,
      right + 1
    );

    let i = 0;
    let j = 0;
    let k = left;

    while (
      i < leftPart.length &&
      j < rightPart.length
    ) {
      if (stopRef.current) {
        return;
      }

      await waitIfPaused();

      if (stopRef.current) {
        return;
      }

      const leftIndex = left + i;
      const rightIndex = middle + 1 + j;

      setComparing([
        leftIndex,
        rightIndex,
      ]);

      setComparisons(
        (value) => value + 1
      );

      await sleep(speed);

      if (leftPart[i] <= rightPart[j]) {
        arr[k] = leftPart[i];
        i++;
      } else {
        arr[k] = rightPart[j];
        j++;
      }

      setArray([...arr]);

      setSwapping([k]);

      setMoves(
        (value) => value + 1
      );

      await sleep(speed);

      setSwapping([]);

      k++;
    }

    while (i < leftPart.length) {
      if (stopRef.current) {
        return;
      }

      await waitIfPaused();

      if (stopRef.current) {
        return;
      }

      arr[k] = leftPart[i];

      setArray([...arr]);

      setSwapping([k]);

      setMoves(
        (value) => value + 1
      );

      await sleep(speed);

      setSwapping([]);

      i++;
      k++;
    }

    while (j < rightPart.length) {
      if (stopRef.current) {
        return;
      }

      await waitIfPaused();

      if (stopRef.current) {
        return;
      }

      arr[k] = rightPart[j];

      setArray([...arr]);

      setSwapping([k]);

      setMoves(
        (value) => value + 1
      );

      await sleep(speed);

      setSwapping([]);

      j++;
      k++;
    }
  };

  const mergeSort = async (
    arr: number[],
    left: number,
    right: number
  ): Promise<void> => {
    if (
      left >= right ||
      stopRef.current
    ) {
      return;
    }

    await waitIfPaused();

    if (stopRef.current) {
      return;
    }

    const middle = Math.floor(
      (left + right) / 2
    );

    await mergeSort(
      arr,
      left,
      middle
    );

    await mergeSort(
      arr,
      middle + 1,
      right
    );

    await merge(
      arr,
      left,
      middle,
      right
    );
  };

  const start = async () => {
    if (
      status === "running" ||
      status === "completed"
    ) {
      return;
    }

    pausedRef.current = false;
    stopRef.current = false;

    setStatus("running");

    setComparisons(0);
    setMoves(0);

    setComparing([]);
    setSwapping([]);

    try {
      /*
       * Ask FastAPI to calculate the final
       * Merge Sort result.
       */
      const result = await mergeSortAPI(
        array
      );

      backendResultRef.current =
        result.array;

      /*
       * Run the existing frontend animation.
       */
      const arr = [...array];

      await mergeSort(
        arr,
        0,
        arr.length - 1
      );

      if (!stopRef.current) {
        /*
         * Use the backend result as the
         * final source of truth.
         */
        if (backendResultRef.current) {
          setArray([
            ...backendResultRef.current,
          ]);
        } else {
          setArray(arr);
        }

        setComparing([]);
        setSwapping([]);

        setStatus("completed");
      }
    } catch (error) {
      console.error(
        "Merge Sort API error:",
        error
      );

      /*
       * Don't leave the UI stuck in
       * the running state if the API fails.
       */
      setStatus("idle");
    }
  };

  const pause = () => {
    if (status === "running") {
      pausedRef.current = true;

      setStatus("paused");
    }
  };

  const step = () => {
    // Step functionality can be added later.
  };

  const randomize = () => {
    stopRef.current = true;
    pausedRef.current = false;

    backendResultRef.current = null;

    const newArray = Array.from(
      { length: 8 },
      () =>
        Math.floor(
          Math.random() * 90
        ) + 10
    );

    setArray(newArray);

    setStatus("idle");

    setComparing([]);
    setSwapping([]);

    setComparisons(0);
    setMoves(0);
  };

  const reset = () => {
    stopRef.current = true;
    pausedRef.current = false;

    backendResultRef.current = null;

    setArray([
      ...initialArray,
    ]);

    setStatus("idle");

    setComparing([]);
    setSwapping([]);

    setComparisons(0);
    setMoves(0);
  };

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