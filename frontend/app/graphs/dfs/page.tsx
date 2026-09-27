"use client";

import GraphAlgorithmPage from "@/components/GraphAlgorithmPage";
import { dfsCode } from "@/data/algorithms/graphAlgorithmsCode";
import useDFS from "@/hooks/useDFS";
import { sampleGraph } from "@/data/graphs/sampleGraph";

export default function DFSPage() {
  const algorithm = useDFS({
    graph: sampleGraph,
  });

  const currentFrame =
    algorithm.trace.frames[
      algorithm.currentTraceStep
    ] ?? null;

  return (
    <GraphAlgorithmPage
      title="Depth-First Search"
      description="Explores a graph by going as deep as possible before backtracking."
      graph={sampleGraph}
      trace={algorithm.trace}
      frame={currentFrame}
      frameIndex={algorithm.currentTraceStep}
      totalSteps={algorithm.trace.frames.length}
      isRunning={algorithm.isRunning}
      isComplete={algorithm.isComplete}
      start={algorithm.start}
      pause={algorithm.pause}
      step={algorithm.step}
      reset={algorithm.reset}
      speed={algorithm.speed}
      setSpeed={algorithm.setSpeed}
      languages={dfsCode}
    />
  );
}