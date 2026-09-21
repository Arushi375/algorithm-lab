"use client";

import {
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  SkipForward,
} from "lucide-react";
import { motion } from "framer-motion";

import CodeViewer from "@/components/CodeViewer";

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
}: AlgorithmPageProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <section className="mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-blue-400">
            Sorting Algorithm
          </p>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {title}
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            {description}
          </p>
        </section>

        {/* Visualization */}
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-8">

          {/* Visualization header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Visualization
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Watch the algorithm work through the array.
              </p>
            </div>

            <div className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-400">
              {status === "idle" && "Ready"}
              {status === "running" && "Sorting..."}
              {status === "paused" && "Paused"}
              {status === "completed" && "Completed"}
            </div>
          </div>

          {/* Bars */}
          <div className="flex h-80 items-end justify-center gap-2 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-4 sm:gap-3">
            {array.map((value, index) => {
              const isComparing = comparing.includes(index);
              const isSwapping = swapping.includes(index);

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
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-blue-500" />
              Unsorted
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              Comparing
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              Moving
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex flex-wrap gap-3">

            <button
              onClick={start}
              disabled={
                status === "running" ||
                status === "completed"
              }
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Play size={16} />
              Start
            </button>

            <button
              onClick={pause}
              disabled={status !== "running"}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Pause size={16} />
              Pause
            </button>

            <button
              onClick={step}
              disabled={
                status === "running" ||
                status === "completed"
              }
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SkipForward size={16} />
              Step
            </button>

            <button
              onClick={randomize}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium transition hover:bg-slate-700"
            >
              <Shuffle size={16} />
              Randomize
            </button>

            <button
              onClick={reset}
              className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium transition hover:bg-slate-700"
            >
              <RotateCcw size={16} />
              Reset
            </button>

          </div>

          {/* Speed */}
          <div className="mt-7 max-w-md">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-400">
                Speed
              </span>

              <span className="text-slate-500">
                {speed}ms
              </span>
            </div>

            <input
              type="range"
              min="100"
              max="1000"
              step="100"
              value={speed}
              onChange={(event) =>
                setSpeed(Number(event.target.value))
              }
              className="w-full accent-blue-500"
            />
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">

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
            label="Complexity"
            value={complexity.average}
          />

        </section>

        {/* Explanation */}
        <section className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">

          <h2 className="text-2xl font-bold">
            How {title} Works
          </h2>

          <div className="mt-5 leading-7 text-slate-400">
            {explanation}
          </div>

        </section>

        {/* Complexity */}
        <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8">

          <h2 className="text-2xl font-bold">
            Complexity
          </h2>

          <div className="mt-5 grid gap-5 sm:grid-cols-4">

            <ComplexityCard
              label="Best Case"
              value={complexity.best}
            />

            <ComplexityCard
              label="Average Case"
              value={complexity.average}
            />

            <ComplexityCard
              label="Worst Case"
              value={complexity.worst}
            />

            <ComplexityCard
              label="Space"
              value={complexity.space}
            />

          </div>
        </section>

        {/* Code */}
        <CodeViewer languages={languages} />

      </div>
    </main>
  );
}


/* -----------------------------
   Small reusable components
------------------------------ */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <p className="text-sm text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}


function ComplexityCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-xl font-semibold">
        {value}
      </p>
    </div>
  );
}