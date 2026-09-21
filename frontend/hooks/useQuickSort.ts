
"use client";

import { useRef, useState } from "react";

type SortStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed";

const initialArray = [72, 34, 91, 18, 56, 43, 27, 65];

export function useQuickSort() {
  const [array, setArray] = useState(initialArray);
  const [status, setStatus] = useState<SortStatus>("idle");

  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);

  const [comparisons, setComparisons] = useState(0);
  const [moves, setMoves] = useState(0);

  const [speed, setSpeed] = useState(500);

  const pausedRef = useRef(false);
  const stopRef = useRef(false);

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });

  const waitIfPaused = async () => {
    while (pausedRef.current && !stopRef.current) {
      await sleep(100);
    }
  };

  const swap = (
    arr: number[],
    first: number,
    second: number
  ) => {
    const temp = arr[first];
    arr[first] = arr[second];
    arr[second] = temp;
  };

  const partition = async (
    arr: number[],
    low: number,
    high: number
  ): Promise<number> => {
    const pivot = arr[high];

    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (stopRef.current) {
        return high;
      }

      await waitIfPaused();

      setComparing([j, high]);
      setComparisons((value) => value + 1);

      await sleep(speed);

      if (arr[j] < pivot) {
        i++;

        if (i !== j) {
          setSwapping([i, j]);

          swap(arr, i, j);

          setArray([...arr]);

          setMoves((value) => value + 1);

          await sleep(speed);

          setSwapping([]);
        }
      }

      setComparing([]);
    }

    if (stopRef.current) {
      return high;
    }

    await waitIfPaused();

    if (i + 1 !== high) {
      setSwapping([i + 1, high]);

      swap(arr, i + 1, high);

      setArray([...arr]);

      setMoves((value) => value + 1);

      await sleep(speed);

      setSwapping([]);
    }

    return i + 1;
  };

  const quickSort = async (
    arr: number[],
    low: number,
    high: number
  ): Promise<void> => {
    if (low >= high || stopRef.current) {
      return;
    }

    await waitIfPaused();

    const pivotIndex = await partition(
      arr,
      low,
      high
    );

    if (stopRef.current) {
      return;
    }

    await quickSort(
      arr,
      low,
      pivotIndex - 1
    );

    await quickSort(
      arr,
      pivotIndex + 1,
      high
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

    const arr = [...array];

    await quickSort(
      arr,
      0,
      arr.length - 1
    );

    if (!stopRef.current) {
      setArray(arr);
      setComparing([]);
      setSwapping([]);
      setStatus("completed");
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

    const newArray = Array.from(
      { length: 8 },
      () => Math.floor(Math.random() * 90) + 10
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

    setArray(initialArray);
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
