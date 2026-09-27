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
import SearchTracePanel from "@/components/algorithm/SearchTracePanel";

import type {
  SearchTrace,
  SearchTraceFrame,
} from "@/components/algorithm/SearchTracePanel";

type SearchStatus =
  | "idle"
  | "running"
  | "paused"
  | "found"
  | "not-found";

type SearchAlgorithmPageProps = {
  title: string;
  description: string;

  array: number[];
  target: number;

  status: SearchStatus;
  currentIndex: number;
  comparisons: number;

  speed: number;
  setSpeed: (speed: number) => void;

  setTarget: (target: number) => void;

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

  traceFrames?: SearchTraceFrame[];
  currentTraceStep?: number;
};

export default function SearchAlgorithmPage({
  title,
  description,
  array,
  target,
  status,
  currentIndex,
  comparisons,
  speed,
  setSpeed,
  setTarget,
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
}: SearchAlgorithmPageProps) {
  const isRunning = status === "running";

  const isComplete =
    status === "found" ||
    status === "not-found";

  const [stepClicked, setStepClicked] =
    useState(false);

  // -----------------------------------------
  // SPEED
  // -----------------------------------------

  const speedLabel =
    speed <= 300
      ? "Fast"
      : speed <= 600
        ? "Medium"
        : "Slow";

  // -----------------------------------------
  // TRACE LINE
  // -----------------------------------------

  let activeTraceLine = 2;

  if (isComplete) {
    activeTraceLine =
      status === "found" ? 6 : 7;
  } else if (currentIndex >= 0) {
    activeTraceLine = 4;
  } else if (isRunning) {
    activeTraceLine = 3;
  }

  const traceLines = [
    {
      line: 1,
      code: "initialize search",
    },
    {
      line: 2,
      code: "while search is not complete",
    },
    {
      line: 3,
      code: "select the next position",
    },
    {
      line: 4,
      code: "compare current value with target",
    },
    {
      line: 5,
      code: "if current value equals target",
    },
    {
      line: 6,
      code: "return target position",
    },
    {
      line: 7,
      code: "continue until target is found or search ends",
    },
  ];

  // -----------------------------------------
  // CURRENT TRACE FRAME
  // -----------------------------------------

  const fallbackFrame: SearchTraceFrame = {
    step: 0,

    line: activeTraceLine,

    label: isComplete
      ? status === "found"
        ? "Target found"
        : "Search complete"
      : currentIndex >= 0
        ? "Comparing elements"
        : isRunning
          ? "Processing array"
          : "Waiting to start",

    detail: isComplete
      ? status === "found"
        ? `The target ${target} was found at index ${currentIndex}.`
        : `The target ${target} was not found in the array.`
      : currentIndex >= 0
        ? `Comparing array value ${array[currentIndex]} with target ${target}.`
        : isRunning
          ? "The algorithm is processing the current array."
          : "Press Start or Step to begin execution.",

    currentIndex,
    target,

    value:
      currentIndex >= 0
        ? array[currentIndex]
        : null,

    comparisons,
  };

  const currentFrame =
    traceFrames.length > 0
      ? traceFrames[
          Math.min(
            Math.max(
              currentTraceStep - 1,
              0
            ),
            traceFrames.length - 1
          )
        ]
      : fallbackFrame;

  const trace: SearchTrace = {
    lines: traceLines,
    frames:
      traceFrames.length > 0
        ? traceFrames
        : [currentFrame],
  };

  // -----------------------------------------
  // PAGE
  // -----------------------------------------

  return (
    <AlgorithmLayout
      category="Searching Algorithm"
      title={title}
      description={description}

      // =======================================
      // VISUALIZATION
      // =======================================

      visualization={
        <section className="h-full border border-slate-800 bg-[#090e18]">
          {/* Header */}

          <div className="border-b border-slate-800 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-500">
              Live Visualizer
            </p>

            <h2 className="mt-2 text-xl font-semibold text-white">
              Array Visualization
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Watch the algorithm search through
              the array step by step.
            </p>
          </div>

          {/* Array */}

          <div className="p-4 sm:p-6">
            {/* Target */}

            <div className="mb-8 flex items-center gap-4">
              <label className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                Search For
              </label>

              <input
                type="number"
                value={target}
                onChange={(event) =>
                  setTarget(
                    Number(
                      event.target.value
                    )
                  )
                }
                disabled={isRunning}
                className="w-28 border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm text-white outline-none transition focus:border-cyan-500 disabled:opacity-50"
              />
            </div>

            {/* Array */}

            <div className="flex h-[430px] items-end justify-center gap-2 overflow-hidden border border-slate-800 bg-[#070b14] p-5 sm:gap-3">
              {array.map(
                (value, index) => {
                  const isCurrent =
                    index ===
                    currentIndex;

                  const isFound =
                    status === "found" &&
                    index ===
                      currentIndex;

                  return (
                    <motion.div
                      key={index}
                      layout
                      initial={{
                        height: 0,
                      }}
                      animate={{
                        height: `${value * 2.5}px`,
                      }}
                      transition={{
                        duration: 0.25,
                      }}
                      className={`relative flex w-7 items-end justify-center rounded-t-md sm:w-10 ${
                        isFound
                          ? "bg-emerald-400"
                          : isCurrent
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
                }
              )}
            </div>

            {/* Legend */}

            <div className="mt-5 flex flex-wrap gap-5 text-xs text-slate-400">
              <Legend
                className="bg-blue-500"
                label="Unchecked"
              />

              <Legend
                className="bg-yellow-400"
                label="Checking"
              />

              <Legend
                className="bg-emerald-400"
                label="Found"
              />
            </div>
          </div>
        </section>
      }

      // =======================================
      // TRACE
      // =======================================

      trace={
        <SearchTracePanel
          trace={trace}
          frame={currentFrame}
          isComplete={isComplete}
        />
      }

      // =======================================
      // CONTROLS
      // =======================================

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
                disabled={
                  isRunning ||
                  isComplete
                }
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

                  window.setTimeout(
                    () => {
                      setStepClicked(
                        false
                      );
                    },
                    180
                  );
                }}
                disabled={
                  isRunning ||
                  isComplete
                }
                highlighted={
                  stepClicked
                }
              >
                <SkipForward
                  size={14}
                />
                Step
              </ControlButton>

              <ControlButton
                onClick={randomize}
              >
                <Shuffle
                  size={14}
                />
                Randomize
              </ControlButton>

              <ControlButton
                onClick={reset}
              >
                <RotateCcw
                  size={14}
                />
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
                  setSpeed(
                    1100 -
                      Number(
                        event.target.value
                      )
                  )
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

      // =======================================
      // STATISTICS
      // =======================================

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
              label="Target"
              value={target}
            />

            <StatCard
              label="Status"
              value={
                status === "found"
                  ? "Found"
                  : status ===
                      "not-found"
                    ? "Not Found"
                    : isRunning
                      ? "Running"
                      : status ===
                          "paused"
                        ? "Paused"
                        : "Ready"
              }
            />
          </div>
        </section>
      }

      // =======================================
      // SUMMARY
      // =======================================

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

      // =======================================
      // CURRENT EXECUTION
      // =======================================

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

      // =======================================
      // COMPLEXITY
      // =======================================

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
              value={
                complexity.average
              }
            />

            <ComplexityCard
              title="Worst"
              value={
                complexity.worst
              }
            />

            <ComplexityCard
              title="Space"
              value={
                complexity.space
              }
            />
          </div>
        </section>
      }

      // =======================================
      // IMPLEMENTATION
      // =======================================

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
              View and copy the algorithm in
              your preferred language.
            </p>
          </div>

          <div className="mt-5">
            <CodeViewer
              languages={languages}
            />
          </div>
        </section>
      }
    />
  );
}

/* ==========================================================================
   SMALL COMPONENTS
   ========================================================================== */

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