"use client";

import {
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  SkipForward,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

import CodeViewer from "@/components/CodeViewer";
import AlgorithmLayout from "@/components/algorithm/AlgorithmLayout";
import SortingTracePanel from "@/components/algorithm/SortingTracePanel";

import type {
  SortingTrace,
  SortingTraceFrame,
} from "@/types/sortingTrace";

type SortStatus =
  | "idle"
  | "running"
  | "paused"
  | "completed";

type AlgorithmPageProps = {
  title: string;
  description: string;

  array: number[];

  status: SortStatus;

  comparing: number[];
  swapping: number[];

  comparisons: number;
  moves: number;

  speed: number;
  setSpeed: (speed: number) => void;

  start: () => void;
  pause: () => void;
  step: () => void;
  randomize: () => void;
  reset: () => void;

  explanation: React.ReactNode;

  complexity: {
    best: string;
    average: string;
    worst: string;
    space: string;
  };

  languages: Record<
  string,
  {
    name: string;
    code: string;
  }
>;

traceFrames?: SortingTraceFrame[];
currentTraceStep?: number;
};

export default function AlgorithmPage({
  title,
  description,
  array,
  status,
  comparing,
  swapping,
  comparisons,
  moves,
  speed,
  setSpeed,
  start,
  pause,
  step,
  randomize,
  reset,
  explanation,
  complexity,
  languages,
traceFrames = [],
currentTraceStep = 0,
}: AlgorithmPageProps) {
  const isRunning = status === "running";
  const isComplete = status === "completed";
  const [stepClicked, setStepClicked] =
    useState(false);
  /*
   * Smaller milliseconds = faster animation.
   */
  const speedLabel =
    speed <= 300
      ? "Fast"
      : speed <= 600
        ? "Medium"
        : "Slow";

  /*
   * Determine the currently executing pseudo-code line.
   */
  let activeTraceLine = 2;

  if (isComplete) {
    activeTraceLine = 7;
  } else if (swapping.length > 0) {
    activeTraceLine = 5;
  } else if (comparing.length > 0) {
    activeTraceLine = 4;
  } else if (isRunning) {
    activeTraceLine = 3;
  }

  /*
   * Shared sorting pseudocode.
   *
   * The actual algorithm differs between Bubble, Insertion,
   * Selection, Merge and Quick Sort, but this gives the
   * common execution structure used by the visualizer.
   */
  const traceLines = [
    {
      line: 1,
      code: "for each pass through the array",
    },
    {
      line: 2,
      code: "check the current elements",
    },
    {
      line: 3,
      code: "compare adjacent / selected elements",
    },
    {
      line: 4,
      code: "if elements are out of order",
    },
    {
      line: 5,
      code: "swap or move elements",
    },
    {
      line: 6,
      code: "continue until the array is sorted",
    },
    {
      line: 7,
      code: "return the sorted array",
    },
  ];

  /*
   * Build the current trace frame from the existing
   * sorting state.
   *
   * This means we do NOT need to modify the existing
   * sorting hooks yet.
   */
  const currentFrame: SortingTraceFrame =
  traceFrames.length > 0
    ? traceFrames[
        Math.min(
          currentTraceStep - 1,
          traceFrames.length - 1
        )
      ]
    : {
        step: 0,
        line: activeTraceLine,
        label: isComplete
          ? "Sorting complete"
          : swapping.length > 0
            ? "Moving elements"
            : comparing.length > 0
              ? "Comparing elements"
              : isRunning
                ? "Processing array"
                : "Waiting to start",

        detail: isComplete
          ? "The array has been completely sorted."
          : swapping.length > 0
            ? `Moving elements at positions ${swapping.join(
                " and "
              )}.`
            : comparing.length > 0
              ? `Comparing elements at positions ${comparing.join(
                  " and "
                )}.`
              : isRunning
                ? "The algorithm is processing the current array."
                : "Press Start or Step to begin execution.",

        comparing,
        swapping,
        array: [...array],
        comparisons,
        moves,
      };

const trace: SortingTrace = {
  lines: traceLines,
  frames:
    traceFrames.length > 0
      ? traceFrames
      : [currentFrame],
};

  return (
    <AlgorithmLayout
      category="Sorting Algorithm"
      title={title}
      description={description}

      /*
       * ============================================================
       * VISUALIZATION
       * ============================================================
       */
      visualization={
        <section className="h-full border border-slate-800 bg-[#090e18]">
          {/* Visualization Header */}
          <div className="border-b border-slate-800 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
              Live Visualizer
            </p>

            <h2 className="mt-2 text-xl font-semibold text-white">
              Array Visualization
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Watch the algorithm compare and move elements step by step.
            </p>
          </div>

          {/* Array */}
          <div className="p-4 sm:p-6">
            <div className="flex h-[430px] items-end justify-center gap-2 overflow-hidden border border-slate-800 bg-[#070b14] p-5 sm:gap-3">
              {array.map((value, index) => {
                const isComparing =
                  comparing.includes(index);

                const isSwapping =
                  swapping.includes(index);

                return (
                  <motion.div
                    key={index}
                    layout
                    initial={{ height: 0 }}
                    animate={{
                      height: `${value * 2.5}px`,
                    }}
                    transition={{
                      duration: 0.25,
                    }}
                    className={`relative flex w-7 items-end justify-center rounded-t-md sm:w-10 ${
                      isSwapping
                        ? "bg-emerald-400"
                        : isComparing
                          ? "bg-yellow-400"
                          : "bg-blue-500"
                    }`}
                  >
                    <span className="absolute -top-6 text-xs text-slate-300">
                      {value}
                    </span>

                    <span className="absolute -bottom-6 text-[10px] text-slate-600">
                      {index}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-5 flex flex-wrap gap-5 text-xs text-slate-400">
              <Legend
                className="bg-blue-500"
                label="Unsorted"
              />

              <Legend
                className="bg-yellow-400"
                label="Comparing"
              />

              <Legend
                className="bg-emerald-400"
                label="Moving"
              />
            </div>
          </div>
        </section>
      }

      /*
       * ============================================================
       * TRACE
       * ============================================================
       */
      trace={
        <SortingTracePanel
          trace={trace}
          frame={currentFrame}
          isComplete={isComplete}
        />
      }

      /*
       * ============================================================
       * CONTROLS
       * ============================================================
       */
      controls={
        <section className="border border-slate-800 bg-[#090e18]">
          {/* Execution Controls */}
          <div className="flex flex-col gap-5 px-6 py-5 xl:flex-row xl:items-center xl:justify-between">
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
                    : status === "paused"
                      ? "Execution paused"
                      : "Ready"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ControlButton
                onClick={start}
                disabled={isRunning || isComplete}
                primary
              >
                <Play size={14} />
                Start
              </ControlButton>

              <ControlButton
                onClick={pause}
                disabled={!isRunning}
              >
                <Pause size={14} />
                Pause
              </ControlButton>

              <ControlButton
  onClick={() => {
    setStepClicked(true);
    step();

    window.setTimeout(() => {
      setStepClicked(false);
    }, 180);
  }}
  disabled={isRunning || isComplete}
  highlighted={stepClicked}
>
  <SkipForward size={14} />
  Step
</ControlButton>

              <ControlButton
                onClick={randomize}
              >
                <Shuffle size={14} />
                Randomize
              </ControlButton>

              <ControlButton
                onClick={reset}
              >
                <RotateCcw size={14} />
                Reset
              </ControlButton>
            </div>

            <span className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">
              {isComplete
                ? "Complete"
                : isRunning
                  ? "Running"
                  : "Ready"}
            </span>
          </div>

          {/* Speed */}
          <div className="flex flex-col gap-3 border-t border-slate-800 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Animation Speed
              </p>

              <p className="mt-1 text-sm text-slate-400">
                {speedLabel}
              </p>
            </div>

            <div className="w-full sm:max-w-md">
            <input
  type="range"
  min="100"
  max="1000"
  step="100"
  value={1100 - speed}
  onChange={(event) =>
    setSpeed(1100 - Number(event.target.value))
  }
  className="w-full cursor-pointer accent-cyan-400"
/>

<div className="mt-1 flex justify-between text-[10px] uppercase tracking-wider text-slate-600">
  <span>Slow</span>
  <span>Fast</span>
</div>
            </div>
          </div>
        </section>
      }

      /*
       * ============================================================
       * STATISTICS
       * ============================================================
       */
      stats={
        <section className="border border-slate-800 bg-[#090e18]">
          <div className="border-b border-slate-800 px-6 py-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cyan-500">
              Runtime
            </p>

            <h2 className="mt-2 text-xl font-semibold text-white">
              Statistics
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-px bg-slate-800 lg:grid-cols-4">
            <StatCard
              label="Array Size"
              value={array.length}
            />

            <StatCard
              label="Comparisons"
              value={comparisons}
            />

            <StatCard
              label="Moves"
              value={moves}
            />

            <StatCard
              label="Status"
              value={
                isComplete
                  ? "Complete"
                  : isRunning
                    ? "Running"
                    : status === "paused"
                      ? "Paused"
                      : "Ready"
              }
            />
          </div>
        </section>
      }

      /*
       * ============================================================
       * SUMMARY
       * ============================================================
       */
      summary={
        <section className="border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cyan-500">
            Learn
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            How {title} Works
          </h2>

          <div className="mt-5 max-w-4xl leading-8 text-slate-400">
            {explanation}
          </div>
        </section>
      }

      /*
       * ============================================================
       * CURRENT EXECUTION EXPLANATION
       * ============================================================
       */
      explanation={
        <section className="border border-slate-800 bg-[#090e18] p-6 sm:p-8">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cyan-500">
            Execution
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Current Execution
          </h2>

          <div className="mt-5">
            <p className="text-sm font-medium text-slate-200">
              {currentFrame.label}
            </p>

            <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">
              {currentFrame.detail}
            </p>
          </div>
        </section>
      }

      /*
       * ============================================================
       * COMPLEXITY
       * ============================================================
       */
      complexity={
        <section className="border border-slate-800 bg-[#090e18]">
          <div className="border-b border-slate-800 px-6 py-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cyan-500">
              Analysis
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
              Complexity
            </h2>
          </div>

          <div className="grid gap-px bg-slate-800 sm:grid-cols-2 lg:grid-cols-4">
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
      }

      /*
       * ============================================================
       * IMPLEMENTATION
       * ============================================================
       */
      implementation={
        <section className="border border-slate-800 bg-[#090e18]">
          <div className="px-6 pt-6 sm:px-8 sm:pt-8">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-cyan-500">
              Implementation
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-white">
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
      }
    />
  );
}

/* ========================================================================= */
/* Small Components                                                         */
/* ========================================================================= */

function Legend({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-3 w-3 rounded-full ${className}`}
      />

      <span>{label}</span>
    </div>
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
      className={`flex items-center gap-2 border px-3 py-2 text-xs font-medium uppercase tracking-[0.1em] transition ${
        highlighted
          ? "border-cyan-400 bg-cyan-400/20 text-cyan-300"
          : primary
            ? "border-cyan-700 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
            : "border-slate-700 bg-slate-900 text-slate-400 hover:border-slate-600 hover:text-slate-200"
      } disabled:cursor-not-allowed disabled:opacity-30`}
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
  value: string | number;
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