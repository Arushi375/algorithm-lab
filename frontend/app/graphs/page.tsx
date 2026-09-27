import Link from "next/link";
import { ArrowRight, Network } from "lucide-react";

import { graphAlgorithms } from "@/data/algorithms/graphAlgorithms";

export default function GraphsPage() {
  return (
    <main className="min-h-screen bg-slate-900 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div>
          <p className="text-sm font-medium text-purple-400">
            Algorithm Lab
          </p>

          <h1 className="mt-2 text-4xl font-bold text-white">
            Graph Algorithms
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Explore graph traversal and shortest-path algorithms through
            interactive visualizations.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {graphAlgorithms.map((algorithm) => (
            <Link
              key={algorithm.slug}
              href={`/graphs/${algorithm.slug}`}
              className="group"
            >
              <article className="h-full rounded-2xl border border-slate-800 bg-slate-950 p-6 transition duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:bg-slate-900">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <Network size={24} />
                </div>

                <div className="mt-6">
                  <p className="text-sm font-medium text-purple-400">
                    {algorithm.category}
                  </p>

                  <h2 className="mt-2 text-xl font-semibold text-white">
                    {algorithm.title}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {algorithm.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-5">
                  <span className="text-sm text-slate-500">
                    Time: {algorithm.complexity}
                  </span>

                  <span className="flex items-center gap-1 text-sm font-medium text-purple-400 transition group-hover:gap-2">
                    Explore
                    <ArrowRight size={16} />
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}