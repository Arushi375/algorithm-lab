"use client";

import { useEffect, useState } from "react";

import type {
  AlgorithmTrace,
  TraceFrame,
} from "@/types/algorithmTrace";

type UseGraphTraceProps = {
  trace: AlgorithmTrace;
  speed?: number;
};

export default function useGraphTrace({
  trace,
  speed = 700,
}: UseGraphTraceProps) {
  const [frameIndex, setFrameIndex] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);

  const frames = trace.frames;

  const currentFrame: TraceFrame | null =
    frameIndex >= 0 && frameIndex < frames.length
      ? frames[frameIndex]
      : null;

  const isComplete =
    frameIndex >= frames.length - 1 && frames.length > 0;

  const start = () => {
    setFrameIndex(0);
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const step = () => {
    setIsRunning(false);

    setFrameIndex((current) => {
      if (current >= frames.length - 1) {
        return current;
      }

      return current + 1;
    });
  };

  const reset = () => {
    setIsRunning(false);
    setFrameIndex(-1);
  };

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    if (frameIndex >= frames.length - 1) {
      setIsRunning(false);
      return;
    }

    const timer = setTimeout(() => {
      setFrameIndex((current) => current + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [frameIndex, frames.length, isRunning, speed]);

  return {
    currentFrame,

    frameIndex,
    totalSteps: frames.length,

    isRunning,
    isComplete,

    start,
    pause,
    step,
    reset,
  };
}