"use client";

import { useState } from "react";

const initialArray = [45, 23, 78, 12, 67, 34, 89, 10];

export default function SortingPage() {
  const [array, setArray] = useState(initialArray);

  function randomizeArray() {
    const newArray = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 90) + 10
    );

    setArray(newArray);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Sorting Visualizer
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Bubble Sort
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Watch Bubble Sort repeatedly compare neighboring elements and
            exchange them when they are in the wrong order.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="mb-8 flex min-h-[320px] items-end justify-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-6">
            {array.map((value, index) => (
              <div
                key={`${index}-${value}`}
                className="flex flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-xs text-slate-400">{value}</span>

                <div
                  className="w-full rounded-t-lg bg-cyan-400 transition-all duration-300"
                  style={{
                    height: `${value * 2.5}px`,
                  }}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={randomizeArray}
              className="rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Randomize
            </button>

            <button
              disabled
              className="cursor-not-allowed rounded-lg bg-slate-800 px-4 py-2 font-semibold text-slate-500"
            >
              Start
            </button>

            <button
              disabled
              className="cursor-not-allowed rounded-lg bg-slate-800 px-4 py-2 font-semibold text-slate-500"
            >
              Pause
            </button>

            <button
              disabled
              className="cursor-not-allowed rounded-lg bg-slate-800 px-4 py-2 font-semibold text-slate-500"
            >
              Step
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-xl font-semibold">How it works</h2>

            <p className="mt-4 leading-7 text-slate-400">
              Bubble Sort compares adjacent values. If the left value is
              greater than the right value, the two values are swapped. After
              each pass, the largest unsorted value moves toward the end of
              the array.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-xl font-semibold">Complexity</h2>

            <div className="mt-4 space-y-3 text-slate-400">
              <p>
                <span className="font-semibold text-white">Best case:</span>{" "}
                O(n)
              </p>

              <p>
                <span className="font-semibold text-white">Average case:</span>{" "}
                O(n²)
              </p>

              <p>
                <span className="font-semibold text-white">Worst case:</span>{" "}
                O(n²)
              </p>

              <p>
                <span className="font-semibold text-white">Space:</span> O(1)
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}