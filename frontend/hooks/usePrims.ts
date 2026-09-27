"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { primsAPI } from "@/lib/api";

import type { GraphData } from "@/types/graph";

import type {
  AlgorithmTrace,
  TraceFrame,
} from "@/types/algorithmTrace";

type UsePrimsProps = {
  graph: GraphData;
  startNode?: number;
};

const TRACE_LINES = [
  {
    line: 1,
    code: "Prim(start)",
  },
  {
    line: 2,
    code: "selected ← {start}",
  },
  {
    line: 3,
    code: "while edges remain",
  },
  {
    line: 4,
    code: "edge ← minimum crossing edge",
  },
  {
    line: 5,
    code: "add edge to MST",
  },
  {
    line: 6,
    code: "add new node to selected",
  },
  {
    line: 7,
    code: "return MST",
  },
];

export default function usePrims({
  graph,
  startNode = 1,
}: UsePrimsProps) {
  const [isRunning, setIsRunning] =
    useState(false);

  const [isComplete, setIsComplete] =
    useState(false);

  const [speed, setSpeed] =
    useState(700);

  const [trace, setTrace] =
    useState<AlgorithmTrace>({
      lines: TRACE_LINES,
      frames: [],
    });

  const [currentTraceStep, setCurrentTraceStep] =
    useState(0);

  const framesRef =
    useRef<TraceFrame[]>([]);

  const currentStepRef =
    useRef(0);

  const runningRef =
    useRef(false);

  const timerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  const speedRef =
    useRef(speed);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const applyFrame = useCallback(
    (frame: TraceFrame) => {
      // Frame state is consumed directly by
      // PathFindingAlgorithmPage.
      return frame;
    },
    []
  );

  const convertBackendSteps = useCallback(
    (
      steps: {
        line: number;
        label: string;
        detail: string;
        active_node: number | null;
        visited_nodes: number[];
        active_edge: {
          from: number;
          to: number;
        } | null;
        selected_edges: {
          from: number;
          to: number;
          weight: number;
        }[];
      }[]
    ): TraceFrame[] => {
      return steps.map(
        (step, index) => ({
          step: index,
          line: step.line,
          label: step.label,
          detail: step.detail,
          activeNode: step.active_node,
          visitedNodes:
            step.visited_nodes,
          activeEdge:
            step.active_edge,
          selectedEdges:
            step.selected_edges,
        })
      );
    },
    []
  );

  const loadBackendResult =
    useCallback(async () => {
      try {
        const result =
          await primsAPI({
            nodes: graph.nodes,
            edges: graph.edges,
            start_node: startNode,
          });

        const frames =
          convertBackendSteps(
            result.steps
          );

        framesRef.current = frames;
        currentStepRef.current = 0;

        setTrace({
          lines: TRACE_LINES,
          frames,
        });

        setCurrentTraceStep(0);
        setIsComplete(false);
        setIsRunning(false);

        if (frames.length > 0) {
          applyFrame(frames[0]);
        }
      } catch (error) {
        console.error(
          "Failed to load Prim's trace:",
          error
        );

        framesRef.current = [];

        setTrace({
          lines: TRACE_LINES,
          frames: [],
        });

        setCurrentTraceStep(0);
      }
    }, [
      graph,
      startNode,
      convertBackendSteps,
      applyFrame,
    ]);

  useEffect(() => {
    loadBackendResult();

    return () => {
      runningRef.current = false;
      clearTimer();
    };
  }, [
    loadBackendResult,
    clearTimer,
  ]);

  const scheduleNextFrame =
    useCallback(() => {
      clearTimer();

      if (!runningRef.current) {
        return;
      }

      timerRef.current = setTimeout(
        () => {
          if (!runningRef.current) {
            return;
          }

          const nextIndex =
            currentStepRef.current + 1;

          if (
            nextIndex >=
            framesRef.current.length
          ) {
            runningRef.current = false;
            setIsRunning(false);
            setIsComplete(true);
            return;
          }

          currentStepRef.current =
            nextIndex;

          setCurrentTraceStep(
            nextIndex
          );

          scheduleNextFrame();
        },
        speedRef.current
      );
    }, [
      clearTimer,
    ]);

  const start = useCallback(() => {
    if (
      runningRef.current ||
      framesRef.current.length === 0
    ) {
      return;
    }

    if (
      currentStepRef.current >=
      framesRef.current.length - 1
    ) {
      currentStepRef.current = 0;
      setCurrentTraceStep(0);
    }

    runningRef.current = true;

    setIsRunning(true);
    setIsComplete(false);

    scheduleNextFrame();
  }, [scheduleNextFrame]);

  const pause = useCallback(() => {
    runningRef.current = false;

    clearTimer();

    setIsRunning(false);
  }, [clearTimer]);

  const step = useCallback(() => {
    if (
      runningRef.current ||
      framesRef.current.length === 0
    ) {
      return;
    }

    const nextIndex =
      currentStepRef.current + 1;

    if (
      nextIndex >=
      framesRef.current.length
    ) {
      setIsComplete(true);
      return;
    }

    currentStepRef.current =
      nextIndex;

    setCurrentTraceStep(
      nextIndex
    );

    if (
      nextIndex ===
      framesRef.current.length - 1
    ) {
      setIsComplete(true);
    }
  }, []);

  const reset = useCallback(() => {
    runningRef.current = false;

    clearTimer();

    currentStepRef.current = 0;

    setCurrentTraceStep(0);

    setIsRunning(false);
    setIsComplete(false);

    if (framesRef.current.length > 0) {
      applyFrame(
        framesRef.current[0]
      );
    }
  }, [
    applyFrame,
    clearTimer,
  ]);

  const frame =
    trace.frames[
      currentTraceStep
    ] ?? null;

  return {
    graph,

    trace,

    frame,

    currentTraceStep,

    totalSteps:
      trace.frames.length,

    isRunning,
    isComplete,

    speed,
    setSpeed,

    start,
    pause,
    step,
    reset,
  };
}