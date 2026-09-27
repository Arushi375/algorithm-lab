"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { binarySearchAPI } from "@/lib/api";

import type {
  SearchTraceFrame,
} from "@/components/algorithm/SearchTracePanel";

type SearchStatus =
  | "idle"
  | "running"
  | "paused"
  | "found"
  | "not-found";

const initialArray = [
  8,
  17,
  29,
  34,
  42,
  61,
  72,
  95,
];

export function useBinarySearch() {
  // ==========================================
  // STATE
  // ==========================================

  const [array, setArray] =
    useState(initialArray);

  const [target, setTarget] =
    useState(61);

  const [status, setStatus] =
    useState<SearchStatus>("idle");

  const [currentIndex, setCurrentIndex] =
    useState(-1);

  const [comparisons, setComparisons] =
    useState(0);

  const [speed, setSpeed] =
    useState(500);

  const [traceFrames, setTraceFrames] =
    useState<SearchTraceFrame[]>([]);

  const [currentTraceStep, setCurrentTraceStep] =
    useState(0);

  // ==========================================
  // REFS
  // ==========================================

  const arrayRef =
    useRef(initialArray);

  const targetRef =
    useRef(61);

  const statusRef =
    useRef<SearchStatus>("idle");

  const leftRef =
    useRef(0);

  const rightRef =
    useRef(initialArray.length - 1);

  const currentIndexRef =
    useRef(-1);

  const comparisonsRef =
    useRef(0);

  const backendResultRef =
    useRef<{
      found: boolean;
      index: number;
    } | null>(null);

  // ==========================================
  // KEEP REFS IN SYNC
  // ==========================================

  useEffect(() => {
    arrayRef.current = array;
  }, [array]);

  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // ==========================================
  // TRACE
  // ==========================================

  const addTraceFrame = useCallback(
    (
      line: number,
      label: string,
      detail: string,
      index: number,
      value: number | null
    ) => {
      const nextStep =
        traceFrames.length + 1;

      const frame: SearchTraceFrame = {
        step: nextStep,
        line,
        label,
        detail,

        currentIndex: index,
        target: targetRef.current,
        value,

        comparisons:
          comparisonsRef.current,
      };

      setTraceFrames((prev) => [
        ...prev,
        frame,
      ]);

      setCurrentTraceStep(nextStep);
    },
    [traceFrames.length]
  );

  // ==========================================
  // STEP
  // ==========================================

  const step = useCallback(() => {
    if (
      statusRef.current === "found" ||
      statusRef.current === "not-found"
    ) {
      return;
    }

    const currentArray =
      arrayRef.current;

    const targetValue =
      targetRef.current;

    let left = leftRef.current;
    let right = rightRef.current;

    // ----------------------------------------
    // Search finished
    // ----------------------------------------

    if (left > right) {
      currentIndexRef.current = -1;

      setCurrentIndex(-1);

      statusRef.current = "not-found";
      setStatus("not-found");

      addTraceFrame(
        7,
        "Target not found",
        `The search range is empty, so target ${targetValue} does not exist in the array.`,
        -1,
        null
      );

      return;
    }

    // ----------------------------------------
    // Calculate middle
    // ----------------------------------------

    const middle = Math.floor(
      (left + right) / 2
    );

    const value =
      currentArray[middle];

    currentIndexRef.current = middle;

    setCurrentIndex(middle);

    // ----------------------------------------
    // Comparison
    // ----------------------------------------

    comparisonsRef.current += 1;

    setComparisons(
      comparisonsRef.current
    );

    addTraceFrame(
      4,
      "Checking middle element",
      `Comparing value ${value} at index ${middle} with target ${targetValue}.`,
      middle,
      value
    );

    // ----------------------------------------
    // Target found
    // ----------------------------------------

    if (value === targetValue) {
      statusRef.current = "found";

      setStatus("found");

      addTraceFrame(
        6,
        "Target found",
        `The target ${targetValue} was found at index ${middle}.`,
        middle,
        value
      );

      return;
    }

    // ----------------------------------------
    // Target is greater
    // ----------------------------------------

    if (value < targetValue) {
      left = middle + 1;

      leftRef.current = left;

      addTraceFrame(
        5,
        "Search right half",
        `The middle value ${value} is smaller than ${targetValue}, so the left half can be discarded.`,
        middle,
        value
      );

      return;
    }

    // ----------------------------------------
    // Target is smaller
    // ----------------------------------------

    right = middle - 1;

    rightRef.current = right;

    addTraceFrame(
      5,
      "Search left half",
      `The middle value ${value} is greater than ${targetValue}, so the right half can be discarded.`,
      middle,
      value
    );
  }, [addTraceFrame]);

  // ==========================================
  // START
  // ==========================================

  const start = useCallback(async () => {
    if (
      statusRef.current === "running" ||
      statusRef.current === "found" ||
      statusRef.current === "not-found"
    ) {
      return;
    }

    try {
      // --------------------------------------
      // Call backend
      // --------------------------------------

      const result =
        await binarySearchAPI(
          arrayRef.current,
          targetRef.current
        );

      backendResultRef.current = {
        found: result.found,
        index: result.index,
      };

      // --------------------------------------
      // Start / resume
      // --------------------------------------

      statusRef.current = "running";

      setStatus("running");
    } catch (error) {
      console.error(
        "Binary Search API error:",
        error
      );

      statusRef.current = "not-found";

      setStatus("not-found");
    }
  }, []);

  // ==========================================
  // PAUSE
  // ==========================================

  const pause = useCallback(() => {
    if (statusRef.current !== "running") {
      return;
    }

    statusRef.current = "paused";

    setStatus("paused");
  }, []);

  // ==========================================
  // AUTOMATIC EXECUTION
  // ==========================================

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const timer = window.setTimeout(() => {
      step();
    }, speed);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    status,
    speed,
    currentTraceStep,
    step,
  ]);

  // ==========================================
  // RANDOMIZE
  // ==========================================

  const randomize = useCallback(() => {
    const newArray = Array.from(
      { length: 8 },
      () =>
        Math.floor(
          Math.random() * 90
        ) + 10
    ).sort((a, b) => a - b);

    arrayRef.current =
      newArray;

    targetRef.current = 61;

    leftRef.current = 0;

    rightRef.current =
      newArray.length - 1;

    currentIndexRef.current = -1;

    comparisonsRef.current = 0;

    backendResultRef.current = null;

    statusRef.current = "idle";

    setArray(newArray);

    setTarget(61);

    setStatus("idle");

    setCurrentIndex(-1);

    setComparisons(0);

    setTraceFrames([]);

    setCurrentTraceStep(0);
  }, []);

  // ==========================================
  // RESET
  // ==========================================

  const reset = useCallback(() => {
    arrayRef.current =
      initialArray;

    targetRef.current = 61;

    leftRef.current = 0;

    rightRef.current =
      initialArray.length - 1;

    currentIndexRef.current = -1;

    comparisonsRef.current = 0;

    backendResultRef.current = null;

    statusRef.current = "idle";

    setArray(initialArray);

    setTarget(61);

    setStatus("idle");

    setCurrentIndex(-1);

    setComparisons(0);

    setTraceFrames([]);

    setCurrentTraceStep(0);
  }, []);

  // ==========================================
  // RETURN
  // ==========================================

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

    traceFrames,
    currentTraceStep,
  };
}