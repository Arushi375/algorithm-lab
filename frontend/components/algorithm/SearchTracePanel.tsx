"use client";

import { useState } from "react";

export type SearchTraceLine = {
  line: number;
  code: string;
};

export type SearchTraceFrame = {
  step: number;
  line: number;
  label: string;
  detail: string;

  currentIndex: number;
  target: number;
  value: number | null;

  comparisons: number;
};

export type SearchTrace = {
  lines: SearchTraceLine[];
  frames: SearchTraceFrame[];
};

type SearchTracePanelProps = {
  trace: SearchTrace;
  frame: SearchTraceFrame;
  isComplete: boolean;
};

export default function SearchTracePanel({
  trace,
  frame,
  isComplete,
}: SearchTracePanelProps) {
  const [activeTab, setActiveTab] =
    useState<"pseudocode" | "telemetry">(
      "pseudocode"
    );

  return (
    <div className="h-full overflow-hidden border border-slate-800 bg-[#080d16]">
      {/* Header */}

      <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="text-sm text-cyan-400">
            {"</>"}
          </span>

          <span className="text-xs font-medium uppercase tracking-[0.22em] text-slate-400">
            Trace Analysis
          </span>
        </div>

        <span className="border border-cyan-900 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-cyan-400">
          Searching
        </span>
      </div>

      {/* Tabs */}

      <div className="grid grid-cols-2 border-b border-slate-800">
        <button
          type="button"
          onClick={() =>
            setActiveTab("pseudocode")
          }
          className={`px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.18em] transition ${
            activeTab === "pseudocode"
              ? "bg-emerald-500/10 text-emerald-400"
              : "text-slate-600 hover:text-slate-400"
          }`}
        >
          Pseudocode
        </button>

        <button
          type="button"
          onClick={() =>
            setActiveTab("telemetry")
          }
          className={`border-l border-slate-800 px-5 py-4 text-left text-xs font-medium uppercase tracking-[0.18em] transition ${
            activeTab === "telemetry"
              ? "bg-cyan-500/10 text-cyan-400"
              : "text-slate-600 hover:text-slate-400"
          }`}
        >
          Telemetry
        </button>
      </div>

      {/* Pseudocode */}

      {activeTab === "pseudocode" && (
        <div className="min-h-[430px] p-5">
          <div className="mb-5 flex items-center gap-2">
            <span className="h-2 w-2 bg-emerald-400" />

            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-600">
              Executing Trace
            </span>
          </div>

          <div className="space-y-1">
            {trace.lines.map((line) => {
              const active =
                line.line === frame.line;

              return (
                <div
                  key={line.line}
                  className={`grid grid-cols-[28px_1fr] gap-3 px-2 py-2 ${
                    active
                      ? "bg-cyan-400/10"
                      : ""
                  }`}
                >
                  <span
                    className={`text-right font-mono text-xs ${
                      active
                        ? "text-cyan-400"
                        : "text-slate-700"
                    }`}
                  >
                    {line.line}
                  </span>

                  <code
                    className={`font-mono text-xs leading-5 ${
                      active
                        ? "font-medium text-cyan-300"
                        : "text-slate-600"
                    }`}
                  >
                    {line.code}
                  </code>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Telemetry */}

      {activeTab === "telemetry" && (
        <div className="min-h-[430px] p-5">
          <div className="mb-5 flex items-center gap-2">
            <span className="h-2 w-2 bg-cyan-400" />

            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-600">
              Live Telemetry
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Telemetry
              label="Step"
              value={frame.step}
            />

            <Telemetry
              label="Active Line"
              value={frame.line}
            />

            <Telemetry
              label="Target"
              value={frame.target}
            />

            <Telemetry
              label="Current Index"
              value={
                frame.currentIndex >= 0
                  ? frame.currentIndex
                  : "—"
              }
            />

            <Telemetry
              label="Current Value"
              value={
                frame.value !== null
                  ? frame.value
                  : "—"
              }
            />

            <Telemetry
              label="Comparisons"
              value={frame.comparisons}
            />
          </div>
        </div>
      )}

      {/* Current Operation */}

      <div className="border-t border-slate-800 px-5 py-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-600">
          Current Operation
        </p>

        <h3 className="mt-3 text-sm font-medium text-slate-200">
          {frame.label}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {frame.detail}
        </p>
      </div>

      {/* Trace Properties */}

      <div className="border-t border-slate-800 px-5 py-5">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-slate-600">
          Trace Properties
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <PropertyBadge>
            Interactive
          </PropertyBadge>

          <PropertyBadge>
            Step Trace
          </PropertyBadge>

          <PropertyBadge>
            {isComplete
              ? "Complete"
              : "Searching"}
          </PropertyBadge>
        </div>
      </div>
    </div>
  );
}

function Telemetry({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="border border-slate-800 bg-slate-950 px-3 py-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 font-mono text-sm text-slate-300">
        {value}
      </p>
    </div>
  );
}

function PropertyBadge({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="border border-slate-700 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.16em] text-slate-500">
      {children}
    </span>
  );
}