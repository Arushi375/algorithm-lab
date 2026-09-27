"use client";

import { useState } from "react";
import AlgorithmBackButton from "@/components/algorithm/AlgorithmBackButton";
import CodeViewer from "@/components/CodeViewer";
import GraphVisualizer from "@/components/GraphVisualizer";
import AlgorithmTracePanel from "@/components/AlgorithmTracePanel";

import type { GraphData } from "@/types/graph";
import type {
  AlgorithmTrace,
  TraceFrame,
} from "@/types/algorithmTrace";

type Language = {
  name: string;
  code: string;
};

type GraphAlgorithmPageProps = {
  title: string;
  description: string;
  graph: GraphData;
  trace: AlgorithmTrace;
  frame: TraceFrame | null;
  frameIndex: number;
  totalSteps: number;
  isRunning: boolean;
  isComplete: boolean;
  start: () => void;
  pause: () => void;
  step: () => void;
  reset: () => void;
  speed: number;
setSpeed: (speed: number) => void;
  languages: Record<string, Language>;
};

export default function GraphAlgorithmPage({
  title,
  description,
  graph,
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
}: GraphAlgorithmPageProps) {
  const currentFrame = frame;

  const [stepClicked, setStepClicked] = useState(false);

  const stepButton = () => {
    setStepClicked(true);

    step();

    window.setTimeout(() => {
      setStepClicked(false);
    }, 180);
  };

  return (
    <main className="min-h-screen bg-[#070b14] text-white">
      <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-6 lg:px-8">

        {/* ============================================================
            HEADER
        ============================================================ */}

<section className="mb-8">
  <div className="mb-5">
    <AlgorithmBackButton />
  </div>

  <p className="text-xs font-medium uppercase tracking-[0.25em] text-cyan-400">
    Graph Algorithm
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

        {/* ============================================================
            VISUALIZER + TRACE
        ============================================================ */}

        <section className="grid items-stretch border border-slate-800 bg-[#090e18] lg:grid-cols-[1.65fr_1fr]">

          {/* ==========================================================
              LEFT — GRAPH VISUALIZATION
          ========================================================== */}

          <div className="min-w-0 border-b border-slate-800 lg:border-b-0 lg:border-r">

            {/* Visualizer Header */}

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

            {/* Graph */}

            <div className="p-4 sm:p-6">
              <GraphVisualizer
                graph={graph}
                activeNode={currentFrame?.activeNode ?? null}
                visitedNodes={currentFrame?.visitedNodes ?? []}
              />
            </div>

            {/* ========================================================
                CONTROLS
            ======================================================== */}

            <div className="flex flex-col gap-5 border-t border-slate-800 px-6 py-5 xl:flex-row xl:items-center xl:justify-between">

              {/* Status */}

              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${
                    isRunning
                      ? "animate-pulse bg-emerald-400"
                      : "bg-cyan-400"
                  }`}
                />

                <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                  {isComplete
                    ? "Execution complete"
                    : isRunning
                      ? "Algorithm running"
                      : "Start node armed"}
                </span>
              </div>

              {/* Buttons */}

              <div className="flex flex-wrap items-center gap-2">
                <ControlButton
                  onClick={start}
                  disabled={isRunning}
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
                                  {/* Speed */}
                                  <div className="flex items-center gap-3">
  <span className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">
    Speed
  </span>

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

  <span className="text-xs text-slate-500">
    {speed >= 1200
      ? "Slow"
      : speed >= 700
        ? "Medium"
        : "Fast"}
  </span>
</div>
              {/* Step Counter */}

              <span className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">
                STEP{" "}
                {String(
                  Math.max(frameIndex + 1, 1)
                ).padStart(2, "0")}{" "}
                /{" "}
                {String(
                  Math.max(totalSteps, 1)
                ).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* ==========================================================
              RIGHT — TRACE ANALYSIS

              AlgorithmTracePanel already owns the Trace Analysis
              header, pseudocode, telemetry, current operation,
              and trace properties.

              Do NOT add another Trace Analysis wrapper here.
          ========================================================== */}

          <div className="min-w-0 bg-[#080d16]">
            <AlgorithmTracePanel
              trace={trace}
              frame={currentFrame}
              isComplete={isComplete}
            />
          </div>
        </section>

        {/* ============================================================
            COMPLEXITY
        ============================================================ */}

        <section className="mt-10">
          <SectionHeading
            eyebrow="Analysis"
            title="Complexity"
          />

          <div className="mt-5 grid gap-px overflow-hidden border border-slate-800 bg-slate-800 sm:grid-cols-2 lg:grid-cols-4">
            <ComplexityCard
              title="Best"
              value={getComplexity(title, "best")}
            />

            <ComplexityCard
              title="Average"
              value={getComplexity(title, "average")}
            />

            <ComplexityCard
              title="Worst"
              value={getComplexity(title, "worst")}
            />

            <ComplexityCard
              title="Space"
              value={getComplexity(title, "space")}
            />
          </div>
        </section>

        {/* ============================================================
            SUMMARY
        ============================================================ */}

        <section className="mt-10">
          <SectionHeading
            eyebrow="Learn"
            title="Summary"
          />

          <div className="mt-5 border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
            <p className="max-w-4xl text-base leading-8 text-slate-400">
              {getSummary(title)}
            </p>
          </div>
        </section>

        {/* ============================================================
            IMPLEMENTATION
        ============================================================ */}

        <section className="mt-10">
          <SectionHeading
            eyebrow="Implementation"
            title="Implementation"
            description="View and copy the algorithm in your preferred language."
          />

          <div className="mt-5">
            <CodeViewer languages={languages} />
          </div>
        </section>
      </div>
    </main>
  );
}

/* ==========================================================================
   CONTROL BUTTON
========================================================================== */

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
      }`}
    >
      {children}
    </button>
  );
}

/* ==========================================================================
   SECTION HEADING
========================================================================== */

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cyan-500">
        {eyebrow}
      </p>

      <h2 className="mt-2 text-2xl font-semibold">
        {title}
      </h2>

      {description && (
        <p className="mt-2 text-sm text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}

/* ==========================================================================
   COMPLEXITY CARD
========================================================================== */

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

/* ==========================================================================
   COMPLEXITY
========================================================================== */

function getComplexity(
  title: string,
  type:
    | "best"
    | "average"
    | "worst"
    | "space"
) {
  const name = title.toLowerCase();

  const values: Record<
    string,
    Record<
      "best" | "average" | "worst" | "space",
      string
    >
  > = {
    "breadth-first search": {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
      space: "O(V)",
    },

    "depth-first search": {
      best: "O(V + E)",
      average: "O(V + E)",
      worst: "O(V + E)",
      space: "O(V)",
    },
  };

  return values[name]?.[type] ?? "—";
}

/* ==========================================================================
   SUMMARY
========================================================================== */

function getSummary(title: string) {
  const name = title.toLowerCase();

  if (name.includes("breadth")) {
    return "Breadth-First Search explores a graph level by level. It uses a queue to visit the current node and then process its neighboring nodes before moving deeper into the graph.";
  }

  if (name.includes("depth")) {
    return "Depth-First Search explores a graph by going as deep as possible along one branch before backtracking. It can be implemented using recursion or a stack.";
  }

  return "This graph algorithm processes nodes and edges according to its traversal rules. Follow the execution trace to understand how the graph state changes at every step.";
}