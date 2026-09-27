"use client";

import PathFindingAlgorithmPage from "@/components/PathFindingAlgorithmPage";
import { kruskalsCode } from "@/data/algorithms/pathfindingCode";
import { sharedWeightedGraph } from "@/data/graphs/sharedGraph";
import useKruskals from "@/hooks/useKruskals";

export default function KruskalsPage() {
  const algorithm = useKruskals({
    graph: sharedWeightedGraph,
  });

  const currentFrame =
    algorithm.trace.frames[
      algorithm.currentTraceStep
    ] ?? null;

  return (
    <PathFindingAlgorithmPage
      title="Kruskal's Algorithm"
      description="Builds a minimum spanning tree by repeatedly selecting the lowest-weight edge that does not create a cycle."
      complexity={{
        best: "O(E log E)",
        average: "O(E log E)",
        worst: "O(E log E)",
        space: "O(V + E)",
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
      languages={kruskalsCode}
    />
  );
}