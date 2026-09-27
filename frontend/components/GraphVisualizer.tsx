"use client";

import type { GraphData } from "@/types/graph";

type GraphVisualizerProps = {
  graph: GraphData;
  activeNode?: number | null;
  visitedNodes?: number[];
};

export default function GraphVisualizer({
  graph,
  activeNode = null,
  visitedNodes = [],
}: GraphVisualizerProps) {
  const isVisited = (nodeId: number) => {
    return visitedNodes.includes(nodeId);
  };

  const getNode = (nodeId: number) => {
    return graph.nodes.find((node) => node.id === nodeId);
  };

  return (
    <div className="overflow-hidden bg-[#0b0f17]">
      {/* ============================================================
          GRAPH
      ============================================================ */}

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
          viewBox="0 0 800 420"
          className="h-[420px] min-w-[800px] w-full"
        >
          {/* ========================================================
              EDGES
          ======================================================== */}

          {graph.edges.map((edge, index) => {
            const fromNode = getNode(edge.from);
            const toNode = getNode(edge.to);

            if (!fromNode || !toNode) {
              return null;
            }

            return (
              <line
                key={`${edge.from}-${edge.to}-${index}`}
                x1={fromNode.x}
                y1={fromNode.y}
                x2={toNode.x}
                y2={toNode.y}
                stroke="currentColor"
                className="text-slate-700"
                strokeWidth="3"
              />
            );
          })}

          {/* ========================================================
              NODES
          ======================================================== */}

          {graph.nodes.map((node) => {
            const active = node.id === activeNode;
            const visited = isVisited(node.id);

            return (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="32"
                  className={
                    active
                      ? "fill-yellow-500"
                      : visited
                        ? "fill-green-500"
                        : "fill-slate-800"
                  }
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeOpacity="0.8"
                  style={{
                    color: active
                      ? "#eab308"
                      : visited
                        ? "#22c55e"
                        : "#475569",
                  }}
                />

                <text
                  x={node.x}
                  y={node.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-white text-lg font-semibold"
                >
                  {node.id}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ============================================================
          LEGEND
      ============================================================ */}

      <div className="flex flex-wrap gap-5 border-t border-slate-800 p-5 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-slate-800 ring-1 ring-slate-600" />
          <span className="text-slate-400">
            Unvisited
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-yellow-500" />
          <span className="text-slate-400">
            Current
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-green-500" />
          <span className="text-slate-400">
            Visited
          </span>
        </div>
      </div>
    </div>
  );
}