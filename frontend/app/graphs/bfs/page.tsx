"use client";

import GraphAlgorithmPage from "@/components/GraphAlgorithmPage";
import { bfsCode } from "@/data/algorithms/graphAlgorithmsCode";
import useBFS from "@/hooks/useBFS";
import { sampleGraph } from "@/data/graphs/sampleGraph";

export default function BFSPage() {
  const algorithm = useBFS({
    graph: sampleGraph,
  });

  const currentFrame =
    algorithm.trace.frames[
      algorithm.currentTraceStep
    ] ?? null;

  return (
    <GraphAlgorithmPage
      title="Breadth-First Search"
      description="Explores the graph level by level using a queue."
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
      languages={bfsCode}
    />
  );
}