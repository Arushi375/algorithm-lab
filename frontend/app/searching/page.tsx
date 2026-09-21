
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const algorithms = [
  {
    name: "Linear Search",
    description:
      "Checks each element one by one until the target value is found or the array ends.",
    complexity: "O(n)",
    href: "/searching/linear-search",
  },
  {
    name: "Binary Search",
    description:
      "Repeatedly divides a sorted array in half to efficiently find the target value.",
    complexity: "O(log n)",
    href: "/searching/binary-search",
  },
];

export default function SearchingPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <section className="mb-10">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <p className="text-sm font-medium uppercase tracking-wider text-purple-400">
            Algorithm Lab
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Searching Algorithms
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Explore different searching algorithms through interactive
            visualizations, explanations, complexity analysis, and code
            implementations.
          </p>
        </section>

        {/* Cards */}
        <section className="grid gap-5 sm:grid-cols-2">
          {algorithms.map((algorithm) => (
            <Link
              key={algorithm.name}
              href={algorithm.href}
              className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition duration-200 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {algorithm.name}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {algorithm.description}
                  </p>
                </div>

                <ArrowRight
                  size={20}
                  className="shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-purple-400"
                />
              </div>

              <div className="mt-6 border-t border-slate-800 pt-4">
                <p className="text-xs uppercase tracking-wider text-slate-500">
                  Average Complexity
                </p>

                <p className="mt-1 font-mono text-purple-400">
                  {algorithm.complexity}
                </p>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}

