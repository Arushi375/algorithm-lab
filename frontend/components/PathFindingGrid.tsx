"use client";

import type { TraceFrame } from "@/types/algorithmTrace";

type PathfindingGridProps = {
  frame: TraceFrame;
};

export default function PathfindingGrid({
  frame,
}: PathfindingGridProps) {
  const nodes = [
    { id: 1, x: 100, y: 90 },
    { id: 2, x: 300, y: 70 },
    { id: 3, x: 500, y: 90 },
    { id: 4, x: 180, y: 280 },
    { id: 5, x: 400, y: 280 },
    { id: 6, x: 620, y: 250 },
  ];

  const edges = [
    { from: 1, to: 2, weight: 4 },
    { from: 1, to: 4, weight: 2 },
    { from: 2, to: 3, weight: 3 },
    { from: 2, to: 5, weight: 5 },
    { from: 3, to: 6, weight: 2 },
    { from: 4, to: 5, weight: 1 },
    { from: 5, to: 6, weight: 3 },
  ];

  const getNode = (id: number) =>
    nodes.find((node) => node.id === id);

  const isVisited = (id: number) =>
    frame.visitedNodes.includes(id);

  const isActiveNode = (id: number) =>
    frame.activeNode === id;

  const isSelectedEdge = (
    from: number,
    to: number,
  ) => {
    return (
      frame.selectedEdges?.some(
        (edge) =>
          (edge.from === from && edge.to === to) ||
          (edge.from === to && edge.to === from),
      ) ?? false
    );
  };

  const isActiveEdge = (
    from: number,
    to: number,
  ) => {
    if (!frame.activeEdge) return false;

    return (
      (frame.activeEdge.from === from &&
        frame.activeEdge.to === to) ||
      (frame.activeEdge.from === to &&
        frame.activeEdge.to === from)
    );
  };

  const getDistance = (id: number) => {
    const distance = frame.distances?.[id];

    if (distance === undefined) {
      return "∞";
    }

    if (!Number.isFinite(distance)) {
      return "∞";
    }

    return String(distance);
  };

  return (
    <div className="overflow-hidden border border-slate-800 bg-[#070b14]">
      <div
        className="overflow-x-auto"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(71,85,105,0.08) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(71,85,105,0.08) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "40px 40px",
        }}
      >
        <svg
          viewBox="0 0 720 380"
          className="h-[400px] min-w-[720px] w-full"
        >
          {/* Edges */}
          {edges.map((edge, index) => {
            const fromNode = getNode(edge.from);
            const toNode = getNode(edge.to);

            if (!fromNode || !toNode) {
              return null;
            }

            const selected = isSelectedEdge(
              edge.from,
              edge.to,
            );

            const active = isActiveEdge(
              edge.from,
              edge.to,
            );

            return (
              <g key={`${edge.from}-${edge.to}-${index}`}>
                <line
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={
                    active
                      ? "#22d3ee"
                      : selected
                        ? "#22c55e"
                        : "#334155"
                  }
                  strokeWidth={
                    active
                      ? 5
                      : selected
                        ? 5
                        : 3
                  }
                  strokeLinecap="round"
                />

                <rect
                  x={(fromNode.x + toNode.x) / 2 - 15}
                  y={(fromNode.y + toNode.y) / 2 - 12}
                  width="30"
                  height="24"
                  rx="4"
                  fill="#070b14"
                  stroke="#1e293b"
                />

                <text
                  x={(fromNode.x + toNode.x) / 2}
                  y={(fromNode.y + toNode.y) / 2 + 5}
                  textAnchor="middle"
                  className="fill-slate-300 text-xs font-medium"
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const active = isActiveNode(node.id);
            const visited = isVisited(node.id);

            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="32"
                  fill={
                    active
                      ? "#eab308"
                      : visited
                        ? "#22c55e"
                        : "#1e293b"
                  }
                  stroke={
                    active
                      ? "#fde047"
                      : visited
                        ? "#4ade80"
                        : "#475569"
                  }
                  strokeWidth="3"
                />

                <text
                  x={node.x}
                  y={node.y - 2}
                  textAnchor="middle"
                  className="fill-white text-lg font-semibold"
                >
                  {node.id}
                </text>

                {frame.distances && (
                  <text
                    x={node.x}
                    y={node.y + 50}
                    textAnchor="middle"
                    className="fill-slate-400 text-xs"
                  >
                    {getDistance(node.id)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-5 border-t border-slate-800 p-5 text-xs">
        <Legend
          className="bg-slate-800 ring-1 ring-slate-600"
          label="Unvisited"
        />

        <Legend
          className="bg-yellow-500"
          label="Current"
        />

        <Legend
          className="bg-green-500"
          label="Visited"
        />

        <Legend
          className="bg-cyan-400"
          label="Active edge"
        />

        <Legend
          className="bg-green-400"
          label="Selected edge"
        />
      </div>
    </div>
  );
}

function Legend({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-3 w-3 rounded-full ${className}`}
      />

      <span className="text-slate-400">
        {label}
      </span>
    </div>
  );
}