"use client";

import PathFindingAlgorithmPage from "@/components/PathFindingAlgorithmPage";

import { dijkstraCode } from "@/data/algorithms/pathfindingCode";
import { sharedWeightedGraph } from "@/data/graphs/sharedGraph";

import useDijkstra from "@/hooks/useDijkstra";

export default function DijkstraPage() {
  const algorithm = useDijkstra({
    graph: sharedWeightedGraph,
  });

  const currentFrame =
    algorithm.trace.frames[
      algorithm.currentTraceStep
    ] ?? null;

  return (
    <PathFindingAlgorithmPage
  title="Dijkstra's Algorithm"
  description="Find the shortest path from a starting node to other nodes in a weighted graph."
  complexity={{
    best: "O(V²)",
    average: "O(V²)",
    worst: "O(V²)",
    space: "O(V)",
  }}
  trace={algorithm.trace}
  frame={currentFrame}
  frameIndex={algorithm.currentTraceStep}
  totalSteps={algorithm.trace.frames.length}
  isRunning={algorithm.isRunning}
  isComplete={algorithm.isComplete}
  speed={algorithm.speed}
  setSpeed={algorithm.setSpeed}
  start={algorithm.start}
  pause={algorithm.pause}
  step={algorithm.step}
  reset={algorithm.reset}
  languages={dijkstraCode}
/>
  );
}