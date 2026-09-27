"use client";

import { useState } from "react";
import type {
  SortingTrace,
  SortingTraceFrame,
} from "@/types/sortingTrace";

type SortingTracePanelProps = {
  trace: SortingTrace;
  frame: SortingTraceFrame | null;
  isComplete: boolean;
};

export default function SortingTracePanel({
  trace,
  frame,
  isComplete,
}: SortingTracePanelProps) {
  const [activeTab, setActiveTab] = useState<
    "pseudocode" | "telemetry"
  >("pseudocode");

  const activeLine = frame?.line ?? 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-white">
            Trace Analysis
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Live execution trace
          </p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs ${
            isComplete
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
              : "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
          }`}
        >
          {isComplete ? "Complete" : "Sorting"}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          type="button"
          onClick={() =>
            setActiveTab("pseudocode")
          }
          className={`flex-1 px-4 py-3 text-sm transition ${
            activeTab === "pseudocode"
              ? "border-b-2 border-cyan-400 text-cyan-400"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          Pseudocode
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab("telemetry")
          }
          className={`flex-1 px-4 py-3 text-sm transition ${
            activeTab === "telemetry"
              ? "border-b-2 border-cyan-400 text-cyan-400"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          Telemetry
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === "pseudocode" ? (
          <div className="space-y-1">
            {trace.lines.map((item) => {
              const isActive =
                item.line === activeLine;

              return (
                <div
                  key={item.line}
                  className={`flex gap-3 rounded-lg px-3 py-2 font-mono text-xs transition ${
                    isActive
                      ? "border border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                      : "text-slate-500"
                  }`}
                >
                  <span className="w-5 shrink-0 text-right text-slate-600">
                    {item.line}
                  </span>

                  <span>{item.code}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Current operation */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Current Operation
              </p>

              <p className="mt-2 text-sm font-semibold text-white">
                {frame?.label ?? "Waiting for execution"}
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-400">
                {frame?.detail ??
                  "Press Start or Step to begin the algorithm."}
              </p>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <TelemetryCard
                label="Comparisons"
                value={frame?.comparisons ?? 0}
              />

              <TelemetryCard
                label="Swaps"
                value={frame?.moves ?? 0}
              />

              <TelemetryCard
                label="Step"
                value={frame?.step ?? 0}
              />

              <TelemetryCard
                label="Active Line"
                value={frame?.line ?? "-"}
              />
            </div>

            {/* Comparing */}
            <TelemetryList
              label="Comparing"
              values={frame?.comparing ?? []}
            />

            {/* Swapping */}
            <TelemetryList
              label="Swapping"
              values={frame?.swapping ?? []}
            />

            {/* Array state */}
            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-slate-500">
                Array State
              </p>

              <div className="flex flex-wrap gap-2">
                {frame?.array?.map(
                  (value, index) => {
                    const isComparing =
                      frame.comparing.includes(
                        index
                      );

                    const isSwapping =
                      frame.swapping.includes(
                        index
                      );

                    return (
                      <div
                        key={`${index}-${value}`}
                        className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 font-mono text-xs transition ${
                          isSwapping
                            ? "border-orange-400/50 bg-orange-400/10 text-orange-300"
                            : isComparing
                              ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-300"
                              : "border-slate-700 bg-slate-900 text-slate-300"
                        }`}
                      >
                        {value}
                      </div>
                    );
                  }
                )}

                {!frame && (
                  <span className="text-xs text-slate-600">
                    No execution data yet
                  </span>
                )}
              </div>
            </div>

            {/* Trace properties */}
            <div className="border-t border-slate-800 pt-4">
              <p className="mb-3 text-xs uppercase tracking-wider text-slate-500">
                Trace Properties
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <Property
                  label="Frames"
                  value={trace.frames.length}
                />

                <Property
                  label="Current Step"
                  value={frame?.step ?? 0}
                />

                <Property
                  label="Array Size"
                  value={frame?.array.length ?? 0}
                />

                <Property
                  label="Pseudocode Lines"
                  value={trace.lines.length}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TelemetryCard({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3">
      <p className="text-[11px] uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

function TelemetryList({
  label,
  values,
}: {
  label: string;
  values: number[];
}) {
  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-wider text-slate-500">
        {label}
      </p>

      {values.length === 0 ? (
        <p className="text-xs text-slate-600">
          None
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {values.map((value) => (
            <span
              key={value}
              className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 font-mono text-xs text-slate-300"
            >
              index {value}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Property({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-xs text-slate-300">
        {value}
      </p>
    </div>
  );
}