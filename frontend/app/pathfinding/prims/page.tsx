"use client";

import PathFindingAlgorithmPage from "@/components/PathFindingAlgorithmPage";

import { primsCode } from "@/data/algorithms/pathfindingCode";

import { sharedWeightedGraph } from "@/data/graphs/sharedGraph";

import usePrims from "@/hooks/usePrims";

export default function PrimsPage() {
  const algorithm = usePrims({
    graph: sharedWeightedGraph,
  });

  const currentFrame =
    algorithm.trace.frames[
      algorithm.currentTraceStep
    ] ?? null;

  return (
    <PathFindingAlgorithmPage
      title="Prim's Algorithm"
      description="Builds a minimum spanning tree by repeatedly selecting the minimum-weight edge that connects the growing tree to an unvisited node."
      complexity={{
        best: "O(E log V)",
        average: "O(E log V)",
        worst: "O(E log V)",
        space: "O(V + E)",
      }}
      trace={algorithm.trace}
      frame={currentFrame}
      frameIndex={
        algorithm.currentTraceStep
      }
      totalSteps={
        algorithm.trace.frames.length
      }
      isRunning={
        algorithm.isRunning
      }
      isComplete={
        algorithm.isComplete
      }
      speed={algorithm.speed}
      setSpeed={algorithm.setSpeed}
      start={algorithm.start}
      pause={algorithm.pause}
      step={algorithm.step}
      reset={algorithm.reset}
      languages={primsCode}
    />
  );
}