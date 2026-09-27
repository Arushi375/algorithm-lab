"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { bfsAPI } from "@/lib/api";
import type { GraphData } from "@/types/graph";
import type {
  AlgorithmTrace,
  TraceFrame,
} from "@/types/algorithmTrace";

type UseBFSProps = {
  graph: GraphData;
};

const startNode = 1;

const traceLines = [
  { line: 1, code: "BFS(start)" },
  { line: 2, code: "queue ← [start]" },
  { line: 3, code: "while queue is not empty" },
  { line: 4, code: "node ← dequeue(queue)" },
  { line: 5, code: "mark node as visited" },
  { line: 6, code: "enqueue unvisited neighbors" },
  { line: 7, code: "return visited" },
];

type BFSStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed";

export default function useBFS({
  graph,
}: UseBFSProps) {
  const [status, setStatus] =
    useState<BFSStatus>("idle");

  const [speed, setSpeed] = useState(700);

  const [visitedNodes, setVisitedNodes] =
    useState<number[]>([]);

  const [currentNode, setCurrentNode] =
    useState<number | null>(null);

  const [trace, setTrace] =
    useState<AlgorithmTrace>({
      lines: traceLines,
      frames: [],
    });

  const [frameIndex, setFrameIndex] =
    useState(-1);

  /*
   * Stores the current animation position.
   */
  const animationIndexRef =
    useRef(0);

  /*
   * Stores the latest speed.
   *
   * This is important because the animation timer
   * always reads the newest speed value.
   */
  const speedRef =
    useRef(speed);

  /*
   * Stores the latest frames.
   */
  const framesRef =
    useRef<TraceFrame[]>([]);

  /*
   * Stores whether BFS is currently running.
   */
  const runningRef =
    useRef(false);

  /*
   * Stores the active timeout.
   */
  const timerRef =
    useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

  /*
   * Keep speedRef synchronized with the UI slider.
   */
  useEffect(() => {
    speedRef.current = speed;

    /*
     * If the animation is currently running,
     * restart the timer using the new speed.
     *
     * This makes the speed slider work immediately.
     */
    if (runningRef.current) {
      clearTimer();

      scheduleNextFrame();
    }
  }, [speed]);

  /*
   * Clear the current animation timer.
   */
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /*
   * Build trace frames from the backend BFS order.
   */
  const createTraceFrames = useCallback(
    (order: number[]): TraceFrame[] => {
      const frames: TraceFrame[] = [];

      /*
       * Start BFS.
       */
      frames.push({
        step: 0,
        line: 1,
        label: "Start BFS",
        detail: `Starting breadth-first search from node ${startNode}.`,
        activeNode: null,
        visitedNodes: [],
        queue: [startNode],
      });

      let visited: number[] = [];
      let queue: number[] = [startNode];

      let step = 1;

      /*
       * Initialize queue.
       */
      frames.push({
        step,
        line: 2,
        label: "Initialize queue",
        detail: `Node ${startNode} is added to the queue.`,
        activeNode: null,
        visitedNodes: [],
        queue: [...queue],
      });

      step++;

      /*
       * Replay the BFS order returned
       * by the backend.
       */
      for (const node of order) {
        /*
         * Check queue.
         */
        frames.push({
          step,
          line: 3,
          label: "Check queue",
          detail:
            "The queue is not empty, so BFS continues.",
          activeNode: node,
          visitedNodes: [...visited],
          queue: [...queue],
        });

        step++;

        /*
         * Dequeue current node.
         */
        queue = queue.filter(
          (item) => item !== node
        );

        frames.push({
          step,
          line: 4,
          label: `Dequeue node ${node}`,
          detail: `Node ${node} is removed from the front of the queue.`,
          activeNode: node,
          visitedNodes: [...visited],
          queue: [...queue],
        });

        step++;

        /*
         * Visit current node.
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
          queue: [...queue],
        });

        step++;

        /*
         * Find neighbors using the same
         * undirected graph behavior as backend.
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
              !queue.includes(neighbor)
          );

        /*
         * Add neighbors to queue.
         */
        queue = [
          ...queue,
          ...neighbors,
        ];

        frames.push({
          step,
          line: 6,
          label: "Enqueue neighbors",
          detail:
            neighbors.length > 0
              ? `Unvisited neighbors ${neighbors.join(
                  ", "
                )} are added to the queue.`
              : "There are no new unvisited neighbors to enqueue.",
          activeNode: node,
          visitedNodes: [...visited],
          queue: [...queue],
        });

        step++;
      }

      /*
       * Final frame.
       */
      frames.push({
        step,
        line: 7,
        label: "BFS complete",
        detail:
          order.length > 0
            ? `Traversal completed in the order: ${order.join(
                " → "
              )}.`
            : "BFS completed without visiting any nodes.",
        activeNode: null,
        visitedNodes: [...order],
        queue: [],
      });

      return frames;
    },
    [graph]
  );

  /*
   * Load BFS result from FastAPI.
   */
  const loadBackendResult = useCallback(
    async () => {
      const result = await bfsAPI({
        nodes: graph.nodes,
        edges: graph.edges,
        start_node: startNode,
      });

      const frames =
        createTraceFrames(result.order);

      framesRef.current = frames;

      setTrace({
        lines: traceLines,
        frames,
      });

      setFrameIndex(-1);
      setVisitedNodes([]);
      setCurrentNode(null);

      animationIndexRef.current = 0;

      return frames;
    },
    [graph, createTraceFrames]
  );

  /*
   * Apply a single frame.
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

      setCurrentNode(
        frame.activeNode
      );
    },
    []
  );

  /*
   * Schedule the next animation frame.
   *
   * IMPORTANT:
   * The timeout uses speedRef.current,
   * not the speed value captured by an old closure.
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

      if (
        animationIndexRef.current >=
        frames.length
      ) {
        runningRef.current = false;

        setStatus("completed");
        setCurrentNode(null);

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
    },
    [applyFrame]
  );

  /*
   * Start / resume BFS.
   */
  const start = useCallback(async () => {
    clearTimer();

    try {
      let frames =
        framesRef.current;

      /*
       * First execution:
       * ask backend for BFS result.
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
       * If traversal was already complete,
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
        "BFS backend error:",
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
   * Pause BFS.
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
       * Load backend result if this
       * is the first step.
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
       * If no frames remain,
       * traversal is complete.
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
        "BFS backend error:",
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
   * Reset BFS.
   */
  const reset = useCallback(() => {
    clearTimer();

    runningRef.current = false;

    animationIndexRef.current = 0;

    framesRef.current = [];

    setStatus("idle");

    setVisitedNodes([]);

    setCurrentNode(null);

    setFrameIndex(-1);

    setTrace({
      lines: traceLines,
      frames: [],
    });
  }, [clearTimer]);

  /*
   * Cleanup when component unmounts.
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
    currentNode,

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