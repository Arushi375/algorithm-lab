
"use client";

import {
  ArrowLeft,
  Pause,
  Play,
  RotateCcw,
  Shuffle,
  SkipForward,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import CodeViewer from "@/components/CodeViewer";

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
}: SearchAlgorithmPageProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">

        {/* Back */}
        <Link
          href="/searching"
          className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Searching Algorithms
        </Link>

        {/* Header */}
        <section className="mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-purple-400">
            Searching Algorithm
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
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                Visualization
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Watch the algorithm search through the array.
              </p>
            </div>

            <div className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-400">
              {status === "idle" && "Ready"}
              {status === "running" && "Searching..."}
              {status === "paused" && "Paused"}
              {status === "found" && "Found"}
              {status === "not-found" && "Not Found"}
            </div>
          </div>

          {/* Target */}
          <div className="mb-7 flex flex-col gap-2 sm:max-w-xs">
            <label className="text-sm text-slate-400">
              Search for
            </label>

            <input
              type="number"
              value={target}
              onChange={(event) =>
                setTarget(Number(event.target.value))
              }
              disabled={status === "running"}
              className="rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-white outline-none transition focus:border-purple-500 disabled:opacity-50"
            />
          </div>

          {/* Array */}
          <div className="flex min-h-72 items-end justify-center gap-2 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-4 sm:gap-4">
            {array.map((value, index) => {
              const isCurrent = index === currentIndex;

              const isFound =
                status === "found" &&
                index === currentIndex;

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
                  className={`relative flex w-8 items-end justify-center rounded-t-md sm:w-12 ${
                    isFound
                      ? "bg-emerald-400"
                      : isCurrent
                        ? "bg-yellow-400"
                        : "bg-purple-500"
                  }`}
                >
                  <span className="absolute -top-6 text-xs text-slate-300">
                    {value}
                  </span>

                  <span className="absolute -bottom-6 text-xs text-slate-600">
                    {index}
                  </span>
                </motion.div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-purple-500" />
              Unchecked
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              Checking
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              Found
            </div>
          </div>

          {/* Controls */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={start}
              disabled={
                status === "running" ||
                status === "found" ||
                status === "not-found"
              }
              className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-40"
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
                status === "found" ||
                status === "not-found"
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
              className="w-full accent-purple-500"
            />
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <StatCard
            label="Array Size"
            value={array.length}
          />

          <StatCard
            label="Target"
            value={target}
          />

          <StatCard
            label="Comparisons"
            value={comparisons}
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

