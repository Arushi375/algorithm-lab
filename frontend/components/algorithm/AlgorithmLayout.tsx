import type { ReactNode } from "react";

import AlgorithmHeader from "./AlgorithmHeader";

type AlgorithmLayoutProps = {
  category: string;
  title: string;
  description: string;

  visualization: ReactNode;
  trace?: ReactNode;

  controls?: ReactNode;
  stats?: ReactNode;
  summary?: ReactNode;
  explanation?: ReactNode;
  complexity?: ReactNode;
  implementation?: ReactNode;
};

export default function AlgorithmLayout({
  category,
  title,
  description,
  visualization,
  trace,
  controls,
  stats,
  summary,
  explanation,
  complexity,
  implementation,
}: AlgorithmLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        {/* Header */}
        <AlgorithmHeader
          category={category}
          title={title}
          description={description}
        />

        {/* Visualization + Trace */}
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.9fr)]">
          <div className="min-w-0">
            {visualization}
          </div>

          {trace && (
            <div className="min-w-0">
              {trace}
            </div>
          )}
        </section>

        {/* Controls */}
        {controls && (
          <section className="mt-6">
            {controls}
          </section>
        )}

        {/* Statistics */}
        {stats && (
          <section className="mt-6">
            {stats}
          </section>
        )}

        {/* Algorithm Summary */}
        {summary && (
          <section className="mt-6">
            {summary}
          </section>
        )}

        {/* Current Execution Explanation */}
        {explanation && (
          <section className="mt-6">
            {explanation}
          </section>
        )}

        {/* Complexity */}
        {complexity && (
          <section className="mt-6">
            {complexity}
          </section>
        )}

        {/* Implementation */}
        {implementation && (
          <section className="mt-6">
            {implementation}
          </section>
        )}
      </div>
    </main>
  );
}