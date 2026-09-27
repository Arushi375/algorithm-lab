"use client";

import { useState } from "react";

import CodeViewer from "@/components/CodeViewer";
import PathfindingGrid from "@/components/PathFindingGrid";
import AlgorithmTracePanel from "@/components/AlgorithmTracePanel";
import AlgorithmBackButton from "@/components/algorithm/AlgorithmBackButton";

import type {
  AlgorithmTrace,
  TraceFrame,
} from "@/types/algorithmTrace";

type Complexity = {
  best: string;
  average: string;
  worst: string;
  space: string;
};

type Language = {
  name: string;
  code: string;
};

type PathFindingAlgorithmPageProps = {
  title: string;
  description: string;
  complexity: Complexity;

  trace: AlgorithmTrace;
  frame: TraceFrame | null;
  frameIndex: number;
  totalSteps: number;

  isRunning: boolean;
  isComplete: boolean;

  speed: number;
  setSpeed: (speed: number) => void;

  start: () => void;
  pause: () => void;
  step: () => void;
  reset: () => void;

  languages: Record<string, Language>;
};

export default function PathFindingAlgorithmPage({
  title,
  description,
  complexity,

  trace,
  frame,
  frameIndex,
  totalSteps,

  isRunning,
  isComplete,

  speed,
  setSpeed,

  start,
  pause,
  step,
  reset,

  languages,
}: PathFindingAlgorithmPageProps) {
  const [stepClicked, setStepClicked] = useState(false);

  const currentFrame = frame ?? trace.frames[0] ?? null;

  const stepButton = () => {
    setStepClicked(true);

    step();

    window.setTimeout(() => {
      setStepClicked(false);
    }, 180);
  };

  const visitedCount = currentFrame?.visitedNodes.length ?? 0;

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <section className="mb-8">
          <div className="mb-5">
            <AlgorithmBackButton />
          </div>

          <p className="text-xs font-medium uppercase tracking-[0.25em] text-cyan-400">
            Path Finding Algorithm
          </p>

          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                {title}
              </h1>

              <p className="mt-4 max-w-4xl text-base leading-7 text-slate-400 sm:text-lg">
                {description}
              </p>
            </div>

            <div className="hidden shrink-0 border border-slate-700 bg-slate-900/60 px-5 py-3 lg:block">
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                {title}
              </span>
            </div>
          </div>
        </section>

        {/* Visualization + Trace */}
        <section className="grid items-stretch border border-slate-800 bg-[#090e18] lg:grid-cols-[1.65fr_1fr]">
          {/* Visualization */}
          <div className="min-w-0 border-b border-slate-800 lg:border-b-0 lg:border-r">
            <div className="border-b border-slate-800 px-6 py-5">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
                Live Visualizer
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                Graph Visualization
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Watch the algorithm explore the graph step by step.
              </p>
            </div>

            <div className="p-4 sm:p-6">
              {currentFrame ? (
                <PathfindingGrid frame={currentFrame} />
              ) : (
                <div className="flex h-[400px] items-center justify-center border border-slate-800 bg-[#070b14]">
                  <p className="text-sm text-slate-500">
                    No trace data available.
                  </p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="border-t border-slate-800 px-6 py-5">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isRunning
                        ? "animate-pulse bg-emerald-400"
                        : isComplete
                          ? "bg-cyan-400"
                          : "bg-slate-600"
                    }`}
                  />

                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    {isComplete
                      ? "Execution complete"
                      : isRunning
                        ? "Algorithm running"
                        : "Ready"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <ControlButton
                    onClick={start}
                    disabled={isRunning || isComplete}
                    primary
                  >
                    Start
                  </ControlButton>

                  <ControlButton
                    onClick={pause}
                    disabled={!isRunning}
                  >
                    Pause
                  </ControlButton>

                  <ControlButton
                    onClick={stepButton}
                    disabled={isRunning || isComplete}
                    highlighted={stepClicked}
                  >
                    Step
                  </ControlButton>

                  <ControlButton onClick={reset}>
                    Reset
                  </ControlButton>
                </div>

                <span className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">
                  STEP{" "}
                  {String(Math.max(frameIndex + 1, 1)).padStart(2, "0")}{" "}
                  /{" "}
                  {String(Math.max(totalSteps, 1)).padStart(2, "0")}
                </span>
              </div>

              {/* Speed */}
              <div className="mt-5 flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600">
                    Execution Speed
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Control the delay between algorithm steps.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                <input
    type="range"
    min="200"
    max="1500"
    step="100"
    value={1700 - speed}
    onChange={(event) =>
      setSpeed(1700 - Number(event.target.value))
    }
    className="w-32 cursor-pointer accent-cyan-400"
  />

                  <span className="w-20 text-right font-mono text-xs text-slate-400">
                    {speed} ms
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Trace */}
          <div className="min-w-0 bg-[#080d16]">
            {currentFrame ? (
              <AlgorithmTracePanel
                trace={trace}
                frame={currentFrame}
                isComplete={isComplete}
              />
            ) : (
              <div className="flex h-full items-center justify-center p-6">
                <p className="text-sm text-slate-500">
                  No trace available.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-10 border border-slate-800 bg-[#090e18]">
          <div className="border-b border-slate-800 px-6 py-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cyan-500">
              Runtime
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Statistics
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-px bg-slate-800 lg:grid-cols-4">
            <StatCard
              label="Step"
              value={`${Math.min(
                frameIndex + 1,
                Math.max(totalSteps, 1),
              )} / ${Math.max(totalSteps, 1)}`}
            />

            <StatCard
              label="Visited"
              value={String(visitedCount)}
            />

            <StatCard
              label="Current Node"
              value={
                currentFrame?.activeNode !== null &&
                currentFrame?.activeNode !== undefined
                  ? String(currentFrame.activeNode)
                  : "—"
              }
            />

            <StatCard
              label="Status"
              value={
                isComplete
                  ? "Complete"
                  : isRunning
                    ? "Running"
                    : "Ready"
              }
            />
          </div>
        </section>

        {/* Summary */}
        <section className="mt-10 border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cyan-500">
            Learn
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            How {title} Works
          </h2>

          <p className="mt-4 max-w-4xl text-base leading-8 text-slate-400">
            {getAlgorithmSummary(title)}
          </p>
        </section>

        {/* Current Execution */}
        <section className="mt-10 border border-slate-800 bg-[#090e18] p-6 sm:p-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cyan-500">
            Execution
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            Current Execution
          </h2>

          {currentFrame ? (
            <>
              <p className="mt-5 text-lg font-semibold text-white">
                {currentFrame.label}
              </p>

              <p className="mt-2 max-w-4xl text-sm leading-7 text-slate-400">
                {currentFrame.detail}
              </p>
            </>
          ) : (
            <p className="mt-5 text-sm text-slate-500">
              Waiting for execution.
            </p>
          )}
        </section>

        {/* Complexity */}
        <section className="mt-10">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cyan-500">
              Analysis
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Complexity
            </h2>
          </div>

          <div className="mt-5 grid gap-px overflow-hidden border border-slate-800 bg-slate-800 sm:grid-cols-2 lg:grid-cols-4">
            <ComplexityCard
              title="Best"
              value={complexity.best}
            />

            <ComplexityCard
              title="Average"
              value={complexity.average}
            />

            <ComplexityCard
              title="Worst"
              value={complexity.worst}
            />

            <ComplexityCard
              title="Space"
              value={complexity.space}
            />
          </div>
        </section>

        {/* Implementation */}
        <section className="mt-10">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cyan-500">
              Implementation
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              Implementation
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              View and copy the algorithm in your preferred language.
            </p>
          </div>

          <div className="mt-5">
            <CodeViewer languages={languages} />
          </div>
        </section>
      </div>
    </main>
  );
}

function ControlButton({
  children,
  onClick,
  disabled = false,
  primary = false,
  highlighted = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
  highlighted?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 border px-4 py-2.5 text-xs font-medium transition ${
        highlighted
          ? "border-cyan-400 bg-cyan-400/20 text-cyan-300"
          : primary
            ? "border-cyan-700 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
            : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-slate-200"
      } ${
        disabled
          ? "cursor-not-allowed opacity-50"
          : ""
      }`}
    >
      {children}
    </button>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-slate-950 p-5">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600">
        {label}
      </p>

      <p className="mt-3 font-mono text-lg text-slate-300">
        {value}
      </p>
    </div>
  );
}

function ComplexityCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-slate-950 p-5">
      <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600">
        {title}
      </p>

      <p className="mt-3 font-mono text-lg text-slate-300">
        {value}
      </p>
    </div>
  );
}

function getAlgorithmSummary(title: string) {
  const name = title.toLowerCase();

  if (name.includes("dijkstra")) {
    return "Dijkstra's Algorithm finds shortest paths from a starting node in a weighted graph. It repeatedly selects the unvisited node with the smallest known distance and relaxes the edges connected to that node.";
  }

  if (name.includes("prim")) {
    return "Prim's Algorithm builds a Minimum Spanning Tree by starting from a node and repeatedly selecting the minimum-weight edge that connects a visited node to an unvisited node.";
  }

  if (name.includes("kruskal")) {
    return "Kruskal's Algorithm builds a Minimum Spanning Tree by considering graph edges in increasing order of weight. An edge is selected when adding it does not create a cycle.";
  }

  return "This path-finding algorithm processes the graph step by step according to its defined strategy.";
}