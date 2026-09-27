"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { kruskalsAPI } from "@/lib/api";
import type {
  AlgorithmTrace,
  TraceFrame,
} from "@/types/algorithmTrace";
import type { GraphData } from "@/types/graph";

type UseKruskalsProps = {
  graph: GraphData;
  startNode?: number;
};

type BackendStep = {
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
};

const DEFAULT_SPEED = 700;

export default function useKruskals({
  graph,
  startNode = 1,
}: UseKruskalsProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);

  const [trace, setTrace] = useState<AlgorithmTrace>({
    lines: [
      {
        line: 2,
        code: "sort edges by weight",
      },
      {
        line: 4,
        code: "consider the next smallest edge",
      },
      {
        line: 5,
        code: "add edge if it does not create a cycle",
      },
      {
        line: 6,
        code: "reject edge if it creates a cycle",
      },
      {
        line: 7,
        code: "return minimum spanning tree",
      },
    ],
    frames: [],
  });

  const [currentTraceStep, setCurrentTraceStep] = useState(0);

  const framesRef = useRef<TraceFrame[]>([]);
  const currentStepRef = useRef(0);
  const runningRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speedRef = useRef(DEFAULT_SPEED);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const convertBackendSteps = useCallback(
    (steps: BackendStep[]): TraceFrame[] => {
      return steps.map((step, index) => ({
        step: index,
        line: step.line,
        label: step.label,
        detail: step.detail,
        activeNode: step.active_node,
        visitedNodes: step.visited_nodes,
        activeEdge: step.active_edge,
        selectedEdges: step.selected_edges,
      }));
    },
    [],
  );

  const applyFrame = useCallback((frame: TraceFrame) => {
    setCurrentTraceStep(frame.step);
  }, []);

  const loadBackendResult = useCallback(async () => {
    try {
      const result = await kruskalsAPI({
        nodes: graph.nodes,
        edges: graph.edges,
        start_node: startNode,
      });

      const frames = convertBackendSteps(result.steps);

      framesRef.current = frames;

      setTrace({
        lines: [
          {
            line: 2,
            code: "sort edges by weight",
          },
          {
            line: 4,
            code: "consider the next smallest edge",
          },
          {
            line: 5,
            code: "add edge if it does not create a cycle",
          },
          {
            line: 6,
            code: "reject edge if it creates a cycle",
          },
          {
            line: 7,
            code: "return minimum spanning tree",
          },
        ],
        frames,
      });

      currentStepRef.current = 0;
      setCurrentTraceStep(0);

      if (frames.length > 0) {
        applyFrame(frames[0]);
      }

      setIsComplete(false);
    } catch (error) {
      console.error("Failed to load Kruskal trace:", error);

      framesRef.current = [];

      setTrace({
        lines: [],
        frames: [],
      });

      setCurrentTraceStep(0);
      setIsComplete(false);
    }
  }, [
    graph,
    startNode,
    convertBackendSteps,
    applyFrame,
  ]);

  useEffect(() => {
    loadBackendResult();
  }, [loadBackendResult]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleNextFrame = useCallback(() => {
    clearTimer();

    if (!runningRef.current) {
      return;
    }

    timerRef.current = setTimeout(() => {
      if (!runningRef.current) {
        return;
      }

      const nextStep = currentStepRef.current + 1;

      if (nextStep >= framesRef.current.length) {
        runningRef.current = false;
        setIsRunning(false);
        setIsComplete(true);
        return;
      }

      currentStepRef.current = nextStep;
      setCurrentTraceStep(nextStep);

      const frame = framesRef.current[nextStep];

      if (frame) {
        applyFrame(frame);
      }

      scheduleNextFrame();
    }, speedRef.current);
  }, [applyFrame, clearTimer]);

  const start = useCallback(() => {
    if (framesRef.current.length === 0) {
      return;
    }

    if (
      currentStepRef.current >=
      framesRef.current.length - 1
    ) {
      currentStepRef.current = 0;
      setCurrentTraceStep(0);

      if (framesRef.current[0]) {
        applyFrame(framesRef.current[0]);
      }

      setIsComplete(false);
    }

    runningRef.current = true;
    setIsRunning(true);
    setIsComplete(false);

    scheduleNextFrame();
  }, [applyFrame, scheduleNextFrame]);

  const pause = useCallback(() => {
    runningRef.current = false;
    setIsRunning(false);
    clearTimer();
  }, [clearTimer]);

  const step = useCallback(() => {
    clearTimer();

    runningRef.current = false;
    setIsRunning(false);

    const nextStep = currentStepRef.current + 1;

    if (
      nextStep >=
      framesRef.current.length
    ) {
      setIsComplete(true);
      return;
    }

    currentStepRef.current = nextStep;
    setCurrentTraceStep(nextStep);

    const frame = framesRef.current[nextStep];

    if (frame) {
      applyFrame(frame);
    }

    if (
      nextStep ===
      framesRef.current.length - 1
    ) {
      setIsComplete(true);
    }
  }, [applyFrame, clearTimer]);

  const reset = useCallback(() => {
    clearTimer();

    runningRef.current = false;

    setIsRunning(false);
    setIsComplete(false);

    currentStepRef.current = 0;
    setCurrentTraceStep(0);

    const firstFrame = framesRef.current[0];

    if (firstFrame) {
      applyFrame(firstFrame);
    }
  }, [applyFrame, clearTimer]);

  useEffect(() => {
    return () => {
      clearTimer();
      runningRef.current = false;
    };
  }, [clearTimer]);

  return {
    graph,
    trace,
    frame:
      trace.frames[currentTraceStep] ??
      null,
    currentTraceStep,
    totalSteps: trace.frames.length,
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