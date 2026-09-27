"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { dfsAPI } from "@/lib/api";

import type { GraphData } from "@/types/graph";

import type {
  AlgorithmTrace,
  TraceFrame,
} from "@/types/algorithmTrace";

type UseDFSProps = {
  graph: GraphData;
};

const startNode = 1;

const traceLines = [
  {
    line: 1,
    code: "DFS(start)",
  },
  {
    line: 2,
    code: "stack ← [start]",
  },
  {
    line: 3,
    code: "while stack is not empty",
  },
  {
    line: 4,
    code: "node ← pop(stack)",
  },
  {
    line: 5,
    code: "mark node as visited",
  },
  {
    line: 6,
    code: "push unvisited neighbors",
  },
  {
    line: 7,
    code: "return visited",
  },
];

type DFSStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed";

export default function useDFS({ graph }: UseDFSProps) {
  const [status, setStatus] =
    useState<DFSStatus>("idle");

  const [speed, setSpeed] = useState(700);

  const [visitedNodes, setVisitedNodes] =
    useState<number[]>([]);

  const [activeNode, setActiveNode] =
    useState<number | null>(null);

  const [stack, setStack] =
    useState<number[]>([]);

  const [trace, setTrace] =
    useState<AlgorithmTrace>({
      lines: traceLines,
      frames: [],
    });

  const [frameIndex, setFrameIndex] =
    useState(-1);

  /*
   * Current animation position.
   */
  const animationIndexRef =
    useRef(0);

  /*
   * Latest speed value.
   */
  const speedRef =
    useRef(speed);

  /*
   * Current trace frames.
   */
  const framesRef =
    useRef<TraceFrame[]>([]);

  /*
   * Whether DFS is currently running.
   */
  const runningRef =
    useRef(false);

  /*
   * Current animation timer.
   */
  const timerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  /*
   * Keep speedRef synchronized
   * with the speed slider.
   */
  useEffect(() => {
    speedRef.current = speed;

    if (runningRef.current) {
      clearTimer();
      scheduleNextFrame();
    }
  }, [speed]);

  /*
   * Clear the current timer.
   */
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /*
   * Create frontend trace frames
   * from the DFS order returned
   * by FastAPI.
   */
  const createTraceFrames = useCallback(
    (order: number[]): TraceFrame[] => {
      const frames: TraceFrame[] = [];

      /*
       * Start DFS.
       */
      frames.push({
        step: 0,
        line: 1,
        label: "Start DFS",
        detail: `Starting depth-first search from node ${startNode}.`,
        activeNode: null,
        visitedNodes: [],
        stack: [startNode],
      });

      let visited: number[] = [];
      let currentStack: number[] = [startNode];

      let step = 1;

      /*
       * Initialize stack.
       */
      frames.push({
        step,
        line: 2,
        label: "Initialize stack",
        detail: `Node ${startNode} is pushed onto the stack.`,
        activeNode: null,
        visitedNodes: [],
        stack: [...currentStack],
      });

      step++;

      /*
       * Replay the DFS order returned
       * by the backend.
       */
      for (const node of order) {
        /*
         * Check stack.
         */
        frames.push({
          step,
          line: 3,
          label: "Check stack",
          detail:
            "The stack is not empty, so DFS continues.",
          activeNode: node,
          visitedNodes: [...visited],
          stack: [...currentStack],
        });

        step++;

        /*
         * Pop current node.
         */
        currentStack = currentStack.filter(
          (item) => item !== node
        );

        frames.push({
          step,
          line: 4,
          label: `Pop node ${node}`,
          detail: `Node ${node} is removed from the top of the stack.`,
          activeNode: node,
          visitedNodes: [...visited],
          stack: [...currentStack],
        });

        step++;

        /*
         * Mark node as visited.
         */
        if (!visited.includes(node)) {
          visited = [...visited, node];
        }

        frames.push({
          step,
          line: 5,
          label: `Visit node ${node}`,
          detail: `Node ${node} is marked as visited.`,
          activeNode: node,
          visitedNodes: [...visited],
          stack: [...currentStack],
        });

        step++;

        /*
         * Find neighbors using the same
         * undirected graph behavior as
         * the backend.
         */
        const neighbors = graph.edges
          .filter(
            (edge) =>
              edge.from === node ||
              edge.to === node
          )
          .map((edge) =>
            edge.from === node
              ? edge.to
              : edge.from
          )
          .filter(
            (neighbor) =>
              !visited.includes(neighbor)
          )
          .filter(
            (neighbor) =>
              !currentStack.includes(neighbor)
          );

        /*
         * DFS uses a stack.
         *
         * Reverse the neighbors so that
         * the visual stack ordering stays
         * consistent with the backend DFS.
         */
        const nextNeighbors = [...neighbors].reverse();

        currentStack = [
          ...currentStack,
          ...nextNeighbors,
        ];

        frames.push({
          step,
          line: 6,
          label: "Push neighbors",
          detail:
            nextNeighbors.length > 0
              ? `Unvisited neighbors ${nextNeighbors.join(
                  ", "
                )} are pushed onto the stack.`
              : "There are no new unvisited neighbors to push.",
          activeNode: node,
          visitedNodes: [...visited],
          stack: [...currentStack],
        });

        step++;
      }

      /*
       * Final frame.
       */
      frames.push({
        step,
        line: 7,
        label: "DFS complete",
        detail:
          order.length > 0
            ? `Traversal completed in the order: ${order.join(
                " → "
              )}.`
            : "DFS completed without visiting any nodes.",
        activeNode: null,
        visitedNodes: [...order],
        stack: [],
      });

      return frames;
    },
    [graph]
  );

  /*
   * Load DFS result from FastAPI.
   */
  const loadBackendResult = useCallback(
    async () => {
      const result = await dfsAPI({
        nodes: graph.nodes,
        edges: graph.edges,
        start_node: startNode,
      });

      /*
       * Backend gives us the actual
       * DFS traversal order.
       */
      const frames =
        createTraceFrames(result.order);

      framesRef.current = frames;

      setTrace({
        lines: traceLines,
        frames,
      });

      setFrameIndex(-1);

      setVisitedNodes([]);

      setActiveNode(null);

      setStack([]);

      animationIndexRef.current = 0;

      return frames;
    },
    [graph, createTraceFrames]
  );

  /*
   * Apply one trace frame to the UI.
   */
  const applyFrame = useCallback(
    (
      index: number,
      frames: TraceFrame[]
    ) => {
      const frame = frames[index];

      if (!frame) {
        return;
      }

      setFrameIndex(index);

      setVisitedNodes(
        frame.visitedNodes
      );

      setActiveNode(
        frame.activeNode
      );

      setStack(
        frame.stack ?? []
      );
    },
    []
  );

  /*
   * Schedule the next animation frame.
   */
  const scheduleNextFrame =
    useCallback(() => {
      const frames =
        framesRef.current;

      if (
        !runningRef.current ||
        frames.length === 0
      ) {
        return;
      }

      /*
       * Animation finished.
       */
      if (
        animationIndexRef.current >=
        frames.length
      ) {
        runningRef.current = false;

        setStatus("completed");

        setActiveNode(null);

        setStack([]);

        timerRef.current = null;

        return;
      }

      const index =
        animationIndexRef.current;

      applyFrame(index, frames);

      animationIndexRef.current += 1;

      timerRef.current = setTimeout(
        () => {
          scheduleNextFrame();
        },
        speedRef.current
      );
    }, [applyFrame]);

  /*
   * Start / resume DFS.
   */
  const start = useCallback(async () => {
    clearTimer();

    try {
      let frames =
        framesRef.current;

      /*
       * First execution:
       * ask FastAPI for the DFS result.
       */
      if (frames.length === 0) {
        frames =
          await loadBackendResult();
      }

      if (frames.length === 0) {
        setStatus("completed");
        return;
      }

      /*
       * If DFS was already completed,
       * start again from frame zero.
       */
      if (
        animationIndexRef.current >=
        frames.length
      ) {
        animationIndexRef.current = 0;
      }

      framesRef.current = frames;

      runningRef.current = true;

      setStatus("running");

      scheduleNextFrame();
    } catch (error) {
      console.error(
        "DFS backend error:",
        error
      );

      runningRef.current = false;

      setStatus("paused");
    }
  }, [
    clearTimer,
    loadBackendResult,
    scheduleNextFrame,
  ]);

  /*
   * Pause DFS.
   */
  const pause = useCallback(() => {
    clearTimer();

    runningRef.current = false;

    setStatus("paused");
  }, [clearTimer]);

  /*
   * Execute exactly one frame.
   */
  const step = useCallback(async () => {
    clearTimer();

    runningRef.current = false;

    try {
      let frames =
        framesRef.current;

      /*
       * First step:
       * request DFS result from FastAPI.
       */
      if (frames.length === 0) {
        frames =
          await loadBackendResult();
      }

      if (frames.length === 0) {
        setStatus("completed");
        return;
      }

      framesRef.current = frames;

      /*
       * No frames remaining.
       */
      if (
        animationIndexRef.current >=
        frames.length
      ) {
        setStatus("completed");
        return;
      }

      const index =
        animationIndexRef.current;

      applyFrame(index, frames);

      animationIndexRef.current += 1;

      /*
       * Check whether this was
       * the final frame.
       */
      if (
        animationIndexRef.current >=
        frames.length
      ) {
        setStatus("completed");
      } else {
        setStatus("paused");
      }
    } catch (error) {
      console.error(
        "DFS backend error:",
        error
      );

      setStatus("paused");
    }
  }, [
    applyFrame,
    clearTimer,
    loadBackendResult,
  ]);

  /*
   * Reset DFS.
   */
  const reset = useCallback(() => {
    clearTimer();

    runningRef.current = false;

    animationIndexRef.current = 0;

    framesRef.current = [];

    setStatus("idle");

    setVisitedNodes([]);

    setActiveNode(null);

    setStack([]);

    setFrameIndex(-1);

    setTrace({
      lines: traceLines,
      frames: [],
    });
  }, [clearTimer]);

  /*
   * Cleanup.
   */
  useEffect(() => {
    return () => {
      clearTimer();
      runningRef.current = false;
    };
  }, [clearTimer]);

  /*
   * Current frame.
   */
  const frame: TraceFrame | null =
    frameIndex >= 0
      ? trace.frames[frameIndex] ?? null
      : null;

  const isRunning =
    status === "running";

  const isComplete =
    status === "completed";

  return {
    graph,

    status,

    visitedNodes,

    activeNode,

    stack,

    trace,

    frame,

    currentTraceStep: frameIndex,

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