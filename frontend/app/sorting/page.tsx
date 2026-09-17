"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Pause,
  Play,
  RefreshCw,
  SkipForward,
  RotateCcw,
} from "lucide-react";

import { useBubbleSort } from "../../hooks/useBubbleSort";

export default function SortingPage() {
  const {
    array,
    status,
    comparing,
    swapping,
    comparisons,
    swaps,
    speed,
    setSpeed,
    start,
    pause,
    reset,
    randomize,
    step,
  } = useBubbleSort();

  const maxValue = Math.max(...array);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-white">
      <div className="mx-auto max-w-6xl">
        {/* Header */}

        <div className="mb-10 flex items-center justify-between">
          <div>
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Link>

            <h1 className="text-4xl font-bold">
              Bubble Sort
            </h1>

            <p className="mt-2 text-slate-400">
              Visualize how Bubble Sort compares and
              swaps neighboring elements.
            </p>
          </div>

          <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
            Sorting Algorithm
          </div>
        </div>

        {/* Main Grid */}

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Visualization Panel */}

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Visualization
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Compare adjacent values and move larger
                  values toward the end.
                </p>
              </div>

              <div
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  status === "running"
                    ? "bg-emerald-400/10 text-emerald-300"
                    : status === "completed"
                    ? "bg-cyan-400/10 text-cyan-300"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {status.toUpperCase()}
              </div>
            </div>

            {/* Bars */}

            <div className="flex h-[360px] items-end justify-center gap-3 rounded-xl border border-slate-800 bg-slate-950/70 px-6 py-6">
              {array.map((value, index) => {
                const isComparing =
                  comparing.includes(index);

                const isSwapping =
                  swapping.includes(index);

                const barHeight =
                  (value / maxValue) * 260;

                return (
                  <div
                    key={index}
                    className="flex h-full flex-1 items-end justify-center"
                  >
                    <motion.div
                      layout
                      animate={{
                        height: `${barHeight}px`,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                      className={`flex w-full max-w-16 items-end justify-center rounded-t-lg pb-3 text-sm font-bold transition-colors duration-200 ${
                        isSwapping
                          ? "bg-rose-500 text-white"
                          : isComparing
                          ? "bg-amber-400 text-slate-950"
                          : "bg-cyan-500 text-slate-950"
                      }`}
                      style={{
                        minHeight: "40px",
                      }}
                    >
                      {value}
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}

            <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-cyan-500" />
                Unselected
              </div>

              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-400" />
                Comparing
              </div>

              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500" />
                Swapping
              </div>
            </div>

            {/* Controls */}

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={randomize}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm transition hover:border-cyan-400 hover:text-cyan-300"
              >
                <RefreshCw size={16} />
                Randomize
              </button>

              <button
                onClick={start}
                disabled={
                  status === "running" ||
                  status === "completed"
                }
                className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Play size={16} />
                Start
              </button>

              <button
                onClick={pause}
                disabled={status !== "running"}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm transition hover:border-amber-400 hover:text-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Pause size={16} />
                Pause
              </button>

              <button
                onClick={step}
                disabled={status === "completed"}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm transition hover:border-violet-400 hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <SkipForward size={16} />
                Step
              </button>

              <button
                onClick={() => reset()}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm transition hover:border-rose-400 hover:text-rose-300"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>

            {/* Speed */}

            <div className="mt-8">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-slate-400">
                  Animation Speed
                </span>

                <span className="text-slate-300">
                  {speed} ms
                </span>
              </div>

              <input
                type="range"
                min="100"
                max="1200"
                step="100"
                value={speed}
                onChange={(event) =>
                  setSpeed(Number(event.target.value))
                }
                className="w-full accent-cyan-400"
              />
            </div>
          </section>

          {/* Statistics Panel */}

          <aside className="space-y-6">
            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="mb-5 text-xl font-semibold">
                Statistics
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">
                    Comparisons
                  </p>

                  <p className="mt-2 text-3xl font-bold text-amber-300">
                    {comparisons}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 p-4">
                  <p className="text-sm text-slate-400">
                    Swaps
                  </p>

                  <p className="mt-2 text-3xl font-bold text-rose-300">
                    {swaps}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="mb-4 text-xl font-semibold">
                How It Works
              </h2>

              <p className="text-sm leading-6 text-slate-400">
                Bubble Sort repeatedly compares neighboring
                elements. If the left element is larger than
                the right element, they are swapped.
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                After each pass, the largest unsorted value
                moves toward the end of the array.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
              <h2 className="mb-4 text-xl font-semibold">
                Complexity
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Best Case
                  </span>

                  <span className="font-mono text-cyan-300">
                    O(n)
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Average Case
                  </span>

                  <span className="font-mono text-amber-300">
                    O(n²)
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Worst Case
                  </span>

                  <span className="font-mono text-rose-300">
                    O(n²)
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">
                    Space
                  </span>

                  <span className="font-mono text-violet-300">
                    O(1)
                  </span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}