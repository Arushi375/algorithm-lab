"use client";

import { useState } from "react";

import type {
  AlgorithmTrace,
  TraceFrame,
} from "@/types/algorithmTrace";

type AlgorithmTracePanelProps = {
  trace: AlgorithmTrace;
  frame: TraceFrame | null;
  isComplete: boolean;
};

export default function AlgorithmTracePanel({
  trace,
  frame,
  isComplete,
}: AlgorithmTracePanelProps) {
  const [tab, setTab] = useState<"pseudocode" | "telemetry">(
    "pseudocode"
  );

  return (
    <aside className="flex h-full min-h-[720px] flex-col border-l border-slate-800 bg-[#0b0f17]">
      {/* Header */}
      <div className="border-b border-slate-800 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-cyan-400">{"</>"}</span>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-500">
                Trace Analysis
              </p>
            </div>
          </div>

          <span className="border border-cyan-500/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-400">
            {isComplete ? "Complete" : "Pathfinding"}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 border-b border-slate-800">
        <button
          type="button"
          onClick={() => setTab("pseudocode")}
          className={`border-r border-slate-800 px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.2em] transition ${
            tab === "pseudocode"
              ? "bg-emerald-500/10 text-emerald-400"
              : "text-slate-600 hover:text-slate-400"
          }`}
        >
          Pseudocode
        </button>

        <button
          type="button"
          onClick={() => setTab("telemetry")}
          className={`px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.2em] transition ${
            tab === "telemetry"
              ? "bg-emerald-500/10 text-emerald-400"
              : "text-slate-600 hover:text-slate-400"
          }`}
        >
          Telemetry
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {tab === "pseudocode" ? (
          <div className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-2 w-2 bg-emerald-400" />

              <p className="text-xs uppercase tracking-[0.2em] text-slate-600">
                Executing Trace
              </p>
            </div>

            <div className="space-y-1">
              {trace.lines.map((line) => {
                const active = frame?.line === line.line;

                return (
                  <div
                    key={line.line}
                    className={`flex min-h-10 items-center border-l-2 transition-all duration-300 ${
                      active
                        ? "border-emerald-400 bg-emerald-400/10"
                        : "border-transparent"
                    }`}
                  >
                    <span
                      className={`w-10 shrink-0 text-right font-mono text-xs ${
                        active
                          ? "text-emerald-400"
                          : "text-slate-700"
                      }`}
                    >
                      {line.line}
                    </span>

                    <code
                      className={`ml-4 text-sm transition-colors ${
                        active
                          ? "font-semibold text-emerald-300"
                          : "text-slate-500"
                      }`}
                    >
                      {line.code}
                    </code>
                  </div>
                );
              })}
            </div>

            {/* Current operation */}
            <div className="mt-8 border-t border-slate-800 pt-6">
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
                Current Operation
              </p>

              <p className="mt-3 text-sm font-medium text-slate-200">
                {frame?.label ?? "Waiting to start"}
              </p>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                {frame?.detail ??
                  "Press Start or Step to begin execution."}
              </p>
            </div>
          </div>
        ) : (
          <Telemetry frame={frame} />
        )}
      </div>

      {/* Properties */}
      <div className="border-t border-slate-800 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-600">
          Trace Properties
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="border border-slate-700 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-slate-500">
            Interactive
          </span>

          <span className="border border-slate-700 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-slate-500">
            Step Trace
          </span>

          <span className="border border-slate-700 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-slate-500">
            {frame ? `STEP ${frame.step}` : "READY"}
          </span>
        </div>
      </div>
    </aside>
  );
}

function Telemetry({
  frame,
}: {
  frame: TraceFrame | null;
}) {
  return (
    <div className="p-6">
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
        Runtime State
      </p>

      <div className="mt-5 space-y-3">
        <TelemetryItem
          label="Active Node"
          value={
            frame?.activeNode !== null &&
            frame?.activeNode !== undefined
              ? String(frame.activeNode)
              : "—"
          }
        />

        <TelemetryItem
          label="Visited"
          value={String(frame?.visitedNodes.length ?? 0)}
        />

        <TelemetryItem
          label="Queue"
          value={
            frame?.queue
              ? frame.queue.join(" → ") || "Empty"
              : "—"
          }
        />

        <TelemetryItem
          label="Stack"
          value={
            frame?.stack
              ? frame.stack.join(" → ") || "Empty"
              : "—"
          }
        />
      </div>

      {frame?.distances && (
        <div className="mt-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600">
            Distances
          </p>

          <div className="mt-3 space-y-2">
            {Object.entries(frame.distances).map(
              ([node, distance]) => (
                <div
                  key={node}
                  className="flex justify-between border border-slate-800 bg-slate-900/50 px-3 py-2"
                >
                  <span className="text-xs text-slate-500">
                    Node {node}
                  </span>

                  <span className="font-mono text-xs text-slate-200">
                    {distance === Infinity ? "∞" : distance}
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TelemetryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border border-slate-800 bg-slate-900/40 p-4">
      <p className="text-[10px] uppercase tracking-[0.15em] text-slate-600">
        {label}
      </p>

      <p className="mt-2 break-words font-mono text-sm text-slate-300">
        {value}
      </p>
    </div>
  );
}