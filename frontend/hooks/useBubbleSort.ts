"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

  const arrayRef = useRef([...initialArray]);
  const iRef = useRef(0);
  const jRef = useRef(0);
  const statusRef = useRef<SortStatus>("idle");

  const step = useCallback(() => {
    const values = [...arrayRef.current];
    const n = values.length;

    if (n < 2) {
      statusRef.current = "completed";
      setStatus("completed");
      return;
    }

    if (iRef.current >= n - 1) {
      statusRef.current = "completed";
      setStatus("completed");
      setComparing([]);
      setSwapping([]);
      return;
    }

    const left = jRef.current;
    const right = jRef.current + 1;

    setComparing([left, right]);
    setSwapping([]);

    setComparisons((count) => count + 1);

    if (values[left] > values[right]) {
      const temporary = values[left];
      values[left] = values[right];
      values[right] = temporary;

      arrayRef.current = values;
      setArray([...values]);

      setSwapping([left, right]);
      setSwaps((count) => count + 1);
    }

    jRef.current++;

    if (jRef.current >= n - iRef.current - 1) {
      jRef.current = 0;
      iRef.current++;
    }

    if (iRef.current >= n - 1) {
      statusRef.current = "completed";
      setStatus("completed");
    }
  }, []);

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

  const start = useCallback(() => {
    if (statusRef.current === "completed") {
      return;
    }

    statusRef.current = "running";
    setStatus("running");
  }, []);

  const pause = useCallback(() => {
    statusRef.current = "paused";
    setStatus("paused");
  }, []);

  const reset = useCallback(
    (newArray: number[] = initialArray) => {
      const copiedArray = [...newArray];

      arrayRef.current = copiedArray;
      iRef.current = 0;
      jRef.current = 0;
      statusRef.current = "idle";

      setArray(copiedArray);
      setStatus("idle");
      setComparing([]);
      setSwapping([]);
      setComparisons(0);
      setSwaps(0);
    },
    [initialArray]
  );

  const randomize = useCallback(() => {
    console.log("randomize function called");
  
    const randomArray = Array.from(
      { length: 8 },
      () => Math.floor(Math.random() * 90) + 10
    );
  
    console.log("new array:", randomArray);
  
    reset(randomArray);
  }, [reset]);

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
  };
}