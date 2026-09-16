"use client";

import { useEffect, useRef, useState } from "react";

const DEFAULT_ARRAY = [45, 23, 78, 12, 67, 34, 89, 10];

type SortStatus = "idle" | "running" | "paused" | "completed";

export default function SortingPage() {
  const [array, setArray] = useState<number[]>(DEFAULT_ARRAY);
  const [status, setStatus] = useState<SortStatus>("idle");
  const [comparing, setComparing] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);
  const [speed, setSpeed] = useState(500);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);

  const arrayRef = useRef<number[]>(DEFAULT_ARRAY);
  const iRef = useRef(0);
  const jRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    arrayRef.current = array;
  }, [array]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  function randomizeArray() {
    stopTimer();

    const newArray = Array.from({ length: 8 }, () =>
      Math.floor(Math.random() * 90) + 10
    );

    arrayRef.current = newArray;
    setArray(newArray);
    setStatus("idle");
    setComparing([]);
    setSwapping([]);
    setComparisons(0);
    setSwaps(0);
    iRef.current = 0;
    jRef.current = 0;
  }

  function resetArray() {
    stopTimer();

    arrayRef.current = DEFAULT_ARRAY;
    setArray(DEFAULT_ARRAY);
    setStatus("idle");
    setComparing([]);
    setSwapping([]);
    setComparisons(0);
    setSwaps(0);
    iRef.current = 0;
    jRef.current = 0;
  }

  function stopTimer() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }

  function executeStep() {
    const currentArray = [...arrayRef.current];
    const n = currentArray.length;

    if (iRef.current >= n - 1) {
      setStatus("completed");
      setComparing([]);
      setSwapping([]);
      stopTimer();
      return;
    }

    if (jRef.current >= n - iRef.current - 1) {
      iRef.current += 1;
      jRef.current = 0;
      executeStep();
      return;
    }

    const leftIndex = jRef.current;
    const rightIndex = jRef.current + 1;

    setComparing([leftIndex, rightIndex]);
    setComparisons((previous) => previous + 1);

    if (currentArray[leftIndex] > currentArray[rightIndex]) {
      setSwapping([leftIndex, rightIndex]);

      [currentArray[leftIndex], currentArray[rightIndex]] = [
        currentArray[rightIndex],
        currentArray[leftIndex],
      ];

      arrayRef.current = currentArray;
      setArray(currentArray);
      setSwaps((previous) => previous + 1);
    } else {
      setSwapping([]);
    }

    jRef.current += 1;

    if (jRef.current >= n - iRef.current - 1) {
      iRef.current += 1;
      jRef.current = 0;
    }

    if (iRef.current >= n - 1) {
      setStatus("completed");
      setComparing([]);
      setSwapping([]);
      stopTimer();
    }
  }

  function startSorting() {
    if (status === "completed") {
      return;
    }

    setStatus("running");
    runNextStep();
  }

  function runNextStep() {
    executeStep();

    timerRef.current = setTimeout(() => {
      if (status !== "paused") {
        runNextStep();
      }
    }, speed);
  }

  function pauseSorting() {
    stopTimer();
    setStatus("paused");
  }

  function stepSorting() {
    if (status === "running" || status === "completed") {
      return;
    }

    executeStep();
  }

  const isComparing = (index: number) => comparing.includes(index);
  const isSwapping = (index: number) => swapping.includes(index);

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
            Watch Bubble Sort compare neighboring values and exchange them
            when they are in the wrong order.
          </p>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Current status</p>
              <p className="mt-1 font-semibold capitalize text-cyan-400">
                {status}
              </p>
            </div>

            <div className="flex gap-6 text-sm">
              <div>
                <p className="text-slate-500">Comparisons</p>
                <p className="mt-1 font-semibold">{comparisons}</p>
              </div>

              <div>
                <p className="text-slate-500">Swaps</p>
                <p className="mt-1 font-semibold">{swaps}</p>
              </div>
            </div>
          </div>

          <div className="mb-8 flex min-h-[360px] items-end justify-center gap-3 rounded-xl border border-slate-800 bg-slate-950 p-6">
            {array.map((value, index) => {
              const comparingBar = isComparing(index);
              const swappingBar = isSwapping(index);

              return (
                <div
                  key={`${index}-${value}`}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                >
                  <span
                    className={`text-xs ${
                      comparingBar
                        ? "font-bold text-yellow-300"
                        : "text-slate-400"
                    }`}
                  >
                    {value}
                  </span>

                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      swappingBar
                        ? "bg-rose-400"
                        : comparingBar
                          ? "bg-yellow-300"
                          : "bg-cyan-400"
                    }`}
                    style={{
                      height: `${value * 2.8}px`,
                    }}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={randomizeArray}
              className="rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Randomize
            </button>

            <button
              onClick={startSorting}
              disabled={status === "running" || status === "completed"}
              className="rounded-lg bg-emerald-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Start
            </button>

            <button
              onClick={pauseSorting}
              disabled={status !== "running"}
              className="rounded-lg bg-amber-300 px-4 py-2 font-semibold text-slate-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Pause
            </button>

            <button
              onClick={stepSorting}
              disabled={status === "running" || status === "completed"}
              className="rounded-lg bg-violet-400 px-4 py-2 font-semibold text-slate-950 transition hover:bg-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Step
            </button>

            <button
              onClick={resetArray}
              className="rounded-lg border border-slate-700 px-4 py-2 font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              Reset
            </button>
          </div>

          <div className="mt-6 max-w-md">
            <div className="flex items-center justify-between text-sm">
              <label htmlFor="speed" className="text-slate-400">
                Animation speed
              </label>

              <span className="text-slate-300">{speed} ms</span>
            </div>

            <input
              id="speed"
              type="range"
              min="100"
              max="1000"
              step="100"
              value={speed}
              onChange={(event) => setSpeed(Number(event.target.value))}
              className="mt-3 w-full accent-cyan-400"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-cyan-400" />
              Unselected
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-yellow-300" />
              Comparing
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-rose-400" />
              Swapping
            </div>
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