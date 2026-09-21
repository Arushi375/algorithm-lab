
"use client";

import { useRef, useState } from "react";

type SortStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed";

const initialArray = [72, 34, 91, 18, 56, 43, 27, 65];

export function useMergeSort() {
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

  const merge = async (
    arr: number[],
    left: number,
    middle: number,
    right: number
  ) => {
    const leftPart = arr.slice(left, middle + 1);
    const rightPart = arr.slice(middle + 1, right + 1);

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftPart.length && j < rightPart.length) {
      if (stopRef.current) return;

      await waitIfPaused();

      const leftIndex = left + i;
      const rightIndex = middle + 1 + j;

      setComparing([leftIndex, rightIndex]);

      setComparisons((value) => value + 1);

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
      setMoves((value) => value + 1);

      await sleep(speed);

      setSwapping([]);

      k++;
    }

    while (i < leftPart.length) {
      if (stopRef.current) return;

      await waitIfPaused();

      arr[k] = leftPart[i];

      setArray([...arr]);
      setSwapping([k]);

      setMoves((value) => value + 1);

      await sleep(speed);

      setSwapping([]);

      i++;
      k++;
    }

    while (j < rightPart.length) {
      if (stopRef.current) return;

      await waitIfPaused();

      arr[k] = rightPart[j];

      setArray([...arr]);
      setSwapping([k]);

      setMoves((value) => value + 1);

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
    if (left >= right || stopRef.current) {
      return;
    }

    await waitIfPaused();

    const middle = Math.floor((left + right) / 2);

    await mergeSort(arr, left, middle);
    await mergeSort(arr, middle + 1, right);

    await merge(arr, left, middle, right);
  };

  const start = async () => {
    if (status === "running" || status === "completed") {
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

    await mergeSort(arr, 0, arr.length - 1);

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
    // Step functionality can be added after
    // the basic Merge Sort visualization works.
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

