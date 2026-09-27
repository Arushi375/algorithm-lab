import Link from "next/link";

const categories = [
  {
    title: "Searching Algorithms",
    description:
      "Learn how algorithms efficiently find elements in arrays and other data structures.",
    href: "/searching",
    algorithms: "Linear Search • Binary Search",
  },
  {
    title: "Sorting Algorithms",
    description:
      "Explore different techniques for arranging data efficiently.",
    href: "/sorting",
    algorithms:
      "Bubble • Insertion • Selection • Merge • Quick",
  },
  {
    title: "Graph Algorithms",
    description:
      "Explore graph traversal techniques and understand how algorithms navigate connected data.",
    href: "/graphs",
    algorithms: "BFS • DFS",
  },
  {
    title: "Path Finding Algorithms",
    description:
      "Visualize shortest-path and minimum-spanning-tree algorithms step by step.",
    href: "/pathfinding",
    algorithms: "Dijkstra • Prim's • Kruskal's",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* Hero */}
        <section className="text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-blue-400">
            Algorithm Lab
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-6xl">
            Learn Algorithms
            <span className="block text-blue-500">
              Visually
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
            Explore algorithms through interactive visualizations,
            step-by-step execution, and code tracing.
          </p>
        </section>

        {/* Categories */}
        <section className="mt-16">
          <div className="grid gap-6 md:grid-cols-2">
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="group rounded-2xl border border-slate-800 bg-slate-900 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:bg-slate-800"
              >
                <div className="flex h-full flex-col">
                  <div className="flex-1">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl text-blue-400">
                      →
                    </div>

                    <h2 className="text-2xl font-semibold transition-colors group-hover:text-blue-400">
                      {category.title}
                    </h2>

                    <p className="mt-3 leading-7 text-slate-400">
                      {category.description}
                    </p>
                  </div>

                  <div className="mt-7 border-t border-slate-800 pt-5">
                    <p className="text-sm text-slate-500">
                      Algorithms
                    </p>

                    <p className="mt-2 text-sm font-medium text-slate-300">
                      {category.algorithms}
                    </p>

                    <div className="mt-5 flex items-center text-sm font-medium text-blue-400">
                      Explore algorithms
                      <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Learning section */}
        <section className="mt-16 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <div className="grid gap-8 md:grid-cols-3">
            <Feature
              number="01"
              title="Visualize"
              description="Watch algorithms operate on data through interactive visualizations."
            />

            <Feature
              number="02"
              title="Trace"
              description="Step through execution and see which part of the code is running."
            />

            <Feature
              number="03"
              title="Understand"
              description="Learn the logic, complexity, and behavior behind each algorithm."
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
    <div>
      <span className="font-mono text-sm text-blue-400">
        {number}
      </span>

      <h3 className="mt-3 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-2 leading-6 text-slate-400">
        {description}
      </p>
    </div>
  );
}