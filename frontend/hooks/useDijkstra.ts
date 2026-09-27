"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { dijkstraAPI } from "@/lib/api";
import type { GraphData } from "@/types/graph";
import type {
  AlgorithmTrace,
  TraceFrame,
} from "@/types/algorithmTrace";

type UseDijkstraProps = {
  graph: GraphData;
  startNode?: number;
};

type DijkstraStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed";

const TRACE_LINES = [
  {
    line: 1,
    code: "distances[start] = 0",
  },
  {
    line: 2,
    code: "initialize all other distances as infinity",
  },
  {
    line: 3,
    code: "while there are unvisited nodes:",
  },
  {
    line: 4,
    code: "current = node with smallest distance",
  },
  {
    line: 5,
    code: "mark current as visited",
  },
  {
    line: 6,
    code: "relax each edge connected to current",
  },
  {
    line: 7,
    code: "return shortest distances",
  },
];

export default function useDijkstra({
  graph,
  startNode = 1,
}: UseDijkstraProps) {
  const [status, setStatus] =
    useState<DijkstraStatus>("idle");

  const [speed, setSpeed] = useState(700);

  const [distances, setDistances] = useState<
    Record<number, number>
  >({});

  const [visitedNodes, setVisitedNodes] = useState<
    number[]
  >([]);

  const [activeNode, setActiveNode] = useState<
    number | null
  >(null);

  const [activeEdge, setActiveEdge] = useState<{
    from: number;
    to: number;
  } | null>(null);

  const [trace, setTrace] = useState<AlgorithmTrace>({
    lines: TRACE_LINES,
    frames: [],
  });

  const [currentTraceStep, setCurrentTraceStep] =
    useState(0);

  const framesRef = useRef<TraceFrame[]>([]);
  const currentStepRef = useRef(0);

  const runningRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const speedRef = useRef(speed);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const convertBackendSteps = useCallback(
    (
      steps: {
        line: number;
        label: string;
        detail: string;
        active_node: number | null;
        visited_nodes: number[];
        distances: Record<string, number | null>;
        active_edge: {
          from: number;
          to: number;
        } | null;
      }[]
    ): TraceFrame[] => {
      return steps.map((step, index) => {
        const convertedDistances: Record<
          number,
          number
        > = {};

        Object.entries(step.distances).forEach(
          ([node, distance]) => {
            convertedDistances[Number(node)] =
              distance === null
                ? Infinity
                : distance;
          }
        );

        return {
          step: index,
          line: step.line,
          label: step.label,
          detail: step.detail,
          activeNode: step.active_node,
          visitedNodes: step.visited_nodes,
          distances: convertedDistances,
          activeEdge: step.active_edge,
        };
      });
    },
    []
  );

  const applyFrame = useCallback(
    (frame: TraceFrame) => {
      setActiveNode(frame.activeNode);
      setVisitedNodes(frame.visitedNodes);
      setActiveEdge(frame.activeEdge ?? null);

      if (frame.distances) {
        setDistances(frame.distances);
      }
    },
    []
  );

  const loadBackendResult = useCallback(async () => {
    try {
      const result = await dijkstraAPI({
        nodes: graph.nodes,
        edges: graph.edges,
        start_node: startNode,
      });

      const frames = convertBackendSteps(result.steps);

      framesRef.current = frames;
      currentStepRef.current = 0;

      setTrace({
        lines: TRACE_LINES,
        frames,
      });

      setCurrentTraceStep(0);

      if (frames.length > 0) {
        applyFrame(frames[0]);
      }

      setStatus("idle");
    } catch (error) {
      console.error(
        "Failed to load Dijkstra trace:",
        error
      );

      framesRef.current = [];

      setTrace({
        lines: TRACE_LINES,
        frames: [],
      });

      setCurrentTraceStep(0);
      setStatus("idle");
    }
  }, [
    graph,
    startNode,
    convertBackendSteps,
    applyFrame,
  ]);

  /*
   * Load the backend trace when the page opens.
   *
   * This is the important fix:
   * the visualizer now has a frame before
   * the user presses Start.
   */
  useEffect(() => {
    loadBackendResult();

    return () => {
      runningRef.current = false;
      clearTimer();
    };
  }, [loadBackendResult, clearTimer]);

  const scheduleNextFrame = useCallback(() => {
    clearTimer();

    if (!runningRef.current) {
      return;
    }

    timerRef.current = setTimeout(() => {
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
        setStatus("completed");
        setActiveEdge(null);
        setActiveNode(null);
        return;
      }

      currentStepRef.current = nextIndex;

      const nextFrame =
        framesRef.current[nextIndex];

      setCurrentTraceStep(nextIndex);
      applyFrame(nextFrame);

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

      const firstFrame =
        framesRef.current[0];

      applyFrame(firstFrame);
    }

    runningRef.current = true;
    setStatus("running");

    scheduleNextFrame();
  }, [applyFrame, scheduleNextFrame]);

  const pause = useCallback(() => {
    runningRef.current = false;

    clearTimer();

    setStatus("paused");
  }, [clearTimer]);

  const step = useCallback(() => {
    if (runningRef.current) {
      return;
    }

    const nextIndex =
      currentStepRef.current + 1;

    if (
      nextIndex >=
      framesRef.current.length
    ) {
      setStatus("completed");
      return;
    }

    currentStepRef.current = nextIndex;

    const nextFrame =
      framesRef.current[nextIndex];

    setCurrentTraceStep(nextIndex);
    applyFrame(nextFrame);

    if (
      nextIndex ===
      framesRef.current.length - 1
    ) {
      setStatus("completed");
    } else {
      setStatus("paused");
    }
  }, [applyFrame]);

  const reset = useCallback(() => {
    runningRef.current = false;

    clearTimer();

    currentStepRef.current = 0;

    setCurrentTraceStep(0);
    setStatus("idle");

    setActiveNode(null);
    setActiveEdge(null);
    setVisitedNodes([]);

    const initialDistances: Record<
      number,
      number
    > = {};

    graph.nodes.forEach((node) => {
      initialDistances[node.id] =
        node.id === startNode
          ? 0
          : Infinity;
    });

    setDistances(initialDistances);

    /*
     * Keep the loaded trace after reset.
     * The first frame is displayed again.
     */
    const firstFrame =
      framesRef.current[0];

    if (firstFrame) {
      applyFrame(firstFrame);
    }
  }, [
    graph.nodes,
    startNode,
    applyFrame,
    clearTimer,
  ]);

  const isRunning = status === "running";
  const isComplete = status === "completed";

  const frame =
    trace.frames[currentTraceStep] ?? null;

  return {
    graph,

    distances,
    visitedNodes,
    activeNode,
    activeEdge,

    trace,
    frame,

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