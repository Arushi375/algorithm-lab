import Link from "next/link";
import { ArrowRight, BarChart3, GitBranch, Network } from "lucide-react";

const algorithms = [
  {
    title: "Sorting Algorithms",
    description:
      "Visualize how algorithms arrange data through comparisons and swaps.",
    icon: BarChart3,
    href: "/sorting",
    examples: "Bubble Sort · Merge Sort · Quick Sort",
  },
  {
    title: "Searching Algorithms",
    description:
      "Understand how algorithms locate elements in a collection of data.",
    icon: GitBranch,
    href: "/searching",
    examples: "Linear Search · Binary Search",
  },
  {
    title: "Graph Algorithms",
    description:
      "Explore traversal and pathfinding through interactive graph structures.",
    icon: Network,
    href: "/graphs",
    examples: "BFS · DFS · Dijkstra",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
            Algorithm Lab
          </p>

          <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
            Learn algorithms
            <span className="block text-cyan-400">visually.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Explore algorithm behavior through interactive visualizations,
            step-by-step execution, and clear explanations.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/sorting"
              className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Start exploring
              <ArrowRight size={18} />
            </Link>

            <a
              href="#algorithms"
              className="rounded-full border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
            >
              View algorithms
            </a>
          </div>
        </div>
      </section>

      <section
        id="algorithms"
        className="border-t border-slate-800 bg-slate-900/60"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Explore
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Choose an algorithm category
            </h2>

            <p className="mt-3 text-slate-400">
              Start with a category and interact with the algorithm in real
              time.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {algorithms.map((algorithm) => {
              const Icon = algorithm.icon;

              return (
                <Link
                  key={algorithm.title}
                  href={algorithm.href}
                  className="group rounded-2xl border border-slate-800 bg-slate-950 p-6 transition hover:-translate-y-1 hover:border-cyan-400/60"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-xl font-semibold">
                    {algorithm.title}
                  </h3>

                  <p className="mt-3 min-h-20 text-sm leading-6 text-slate-400">
                    {algorithm.description}
                  </p>

                  <p className="mt-5 text-xs text-slate-500">
                    {algorithm.examples}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-cyan-400">
                    Explore category
                    <ArrowRight
                      size={16}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}