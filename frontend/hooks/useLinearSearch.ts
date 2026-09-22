
"use client";
import { linearSearchAPI } from "@/lib/api";
import { useRef, useState } from "react";

type SearchStatus =
  | "idle"
  | "running"
  | "paused"
  | "found"
  | "not-found";

const initialArray = [42, 17, 83, 29, 61, 8, 95, 34];

export function useLinearSearch() {
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

  try {
    const result = await linearSearchAPI(
      array,
      target
    );

    for (let i = 0; i < array.length; i++) {
      if (stopRef.current) {
        return;
      }

      await waitIfPaused();

      if (stopRef.current) {
        return;
      }

      setCurrentIndex(i);

      setComparisons(i + 1);

      await sleep(speed);

      if (i === result.index) {
        if (result.found) {
          setStatus("found");
        }

        return;
      }
    }

    setCurrentIndex(-1);
    setStatus("not-found");
  } catch (error) {
    console.error("Linear Search API error:", error);

    setStatus("not-found");
  }
};



  const pause = () => {
    if (status === "running") {
      pausedRef.current = true;
      setStatus("paused");
    }
  };

  const step = () => {
    if (
      status === "running" ||
      status === "found" ||
      status === "not-found"
    ) {
      return;
    }

    setStatus("running");

    setCurrentIndex((previousIndex) => {
      const nextIndex = previousIndex + 1;

      if (nextIndex >= array.length) {
        setStatus("not-found");
        return -1;
      }

      setComparisons((value) => value + 1);

      if (array[nextIndex] === target) {
        setStatus("found");
      }

      return nextIndex;
    });
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
