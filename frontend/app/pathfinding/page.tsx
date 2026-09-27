import Link from "next/link";

const algorithms = [
  {
    title: "Dijkstra's Algorithm",
    description:
      "Find the shortest path from a starting node to other nodes in a weighted graph.",
    category: "Shortest Path",
    complexity: "O(V²)",
    href: "/pathfinding/dijkstra",
  },
  {
    title: "Prim's Algorithm",
    description:
      "Build a minimum spanning tree by repeatedly selecting the minimum-weight connecting edge.",
    category: "Minimum Spanning Tree",
    complexity: "O(E log V)",
    href: "/pathfinding/prims",
  },
  {
    title: "Kruskal's Algorithm",
    description:
      "Build a minimum spanning tree by selecting edges in increasing order of weight while avoiding cycles.",
    category: "Minimum Spanning Tree",
    complexity: "O(E log E)",
    href: "/pathfinding/kruskals",
  },
];

export default function PathfindingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-medium text-blue-400">
            Algorithm Lab
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight">
            Path Finding Algorithms
          </h1>

          <p className="mt-3 max-w-3xl text-slate-400">
            Explore shortest-path and minimum-spanning-tree
            algorithms through interactive visualizations and
            step-by-step code tracing.
          </p>
        </div>

        {/* Algorithm cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {algorithms.map((algorithm) => (
            <div
              key={algorithm.href}
              className="group flex flex-col rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-800"
            >
              <div className="flex-1">
                <span className="inline-flex rounded-full bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
                  {algorithm.category}
                </span>

                <h2 className="mt-4 text-2xl font-semibold">
                  {algorithm.title}
                </h2>

                <p className="mt-3 leading-6 text-slate-400">
                  {algorithm.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-5">
                <div>
                  <p className="text-xs text-slate-500">
                    Complexity
                  </p>

                  <p className="mt-1 font-mono text-sm text-slate-300">
                    {algorithm.complexity}
                  </p>
                </div>

                <Link
                  href={algorithm.href}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-500"
                >
                  Explore
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <section className="mt-12 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold">
            Interactive Learning
          </h2>

          <p className="mt-3 max-w-3xl text-slate-400">
            Each algorithm includes a visual representation of
            the graph, step-by-step execution controls, and a
            code-tracing panel that highlights the part of the
            algorithm currently being executed.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Feature
              number="01"
              title="Visualize"
              description="See nodes, edges, paths, and selected edges change as the algorithm runs."
            />

            <Feature
              number="02"
              title="Trace"
              description="Follow the algorithm one step at a time and see the current code line."
            />

            <Feature
              number="03"
              title="Understand"
              description="Read an explanation of what the algorithm is doing at every step."
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function Feature({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <span className="font-mono text-sm text-blue-400">
        {number}
      </span>

      <h3 className="mt-3 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}