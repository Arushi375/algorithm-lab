
"use client";

import { useRef, useState } from "react";

type SearchStatus =
  | "idle"
  | "running"
  | "paused"
  | "found"
  | "not-found";

const initialArray = [8, 17, 29, 34, 42, 61, 72, 95];

export function useBinarySearch() {
  const [array, setArray] = useState(initialArray);
  const [target, setTarget] = useState(61);

  const [status, setStatus] =
    useState<SearchStatus>("idle");

  const [currentIndex, setCurrentIndex] =
    useState(-1);

  const [comparisons, setComparisons] = useState(0);

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

  const start = async () => {
    if (
      status === "running" ||
      status === "found" ||
      status === "not-found"
    ) {
      return;
    }

    pausedRef.current = false;
    stopRef.current = false;

    setStatus("running");
    setCurrentIndex(-1);
    setComparisons(0);

    let left = 0;
    let right = array.length - 1;

    while (left <= right) {
      if (stopRef.current) {
        return;
      }

      await waitIfPaused();

      if (stopRef.current) {
        return;
      }

      const middle = Math.floor((left + right) / 2);

      setCurrentIndex(middle);

      setComparisons((value) => value + 1);

      await sleep(speed);

      if (array[middle] === target) {
        setStatus("found");
        return;
      }

      if (array[middle] < target) {
        left = middle + 1;
      } else {
        right = middle - 1;
      }
    }

    setCurrentIndex(-1);
    setStatus("not-found");
  };

  const pause = () => {
    if (status === "running") {
      pausedRef.current = true;
      setStatus("paused");
    }
  };

  const step = () => {
    // Step functionality can be improved
    // after the basic Binary Search visualization works.
  };

  const randomize = () => {
    stopRef.current = true;
    pausedRef.current = false;

    const newArray = Array.from(
      { length: 8 },
      () => Math.floor(Math.random() * 90) + 10
    ).sort((a, b) => a - b);

    setArray(newArray);
    setStatus("idle");
    setCurrentIndex(-1);
    setComparisons(0);
  };

  const reset = () => {
    stopRef.current = true;
    pausedRef.current = false;

    setArray(initialArray);
    setTarget(61);
    setStatus("idle");
    setCurrentIndex(-1);
    setComparisons(0);
  };

  return {
    array,
    target,
    status,
    currentIndex,
    comparisons,
    speed,
    setSpeed,
    setTarget,
    start,
    pause,
    step,
    randomize,
    reset,
  };
}

