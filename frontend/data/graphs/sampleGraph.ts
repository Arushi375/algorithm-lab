import type { GraphData } from "@/types/graph";

export const sampleGraph: GraphData = {
  nodes: [
    {
      id: 1,
      label: "1",
      x: 100,
      y: 100,
    },
    {
      id: 2,
      label: "2",
      x: 300,
      y: 80,
    },
    {
      id: 3,
      label: "3",
      x: 500,
      y: 100,
    },
    {
      id: 4,
      label: "4",
      x: 180,
      y: 280,
    },
    {
      id: 5,
      label: "5",
      x: 400,
      y: 280,
    },
    {
      id: 6,
      label: "6",
      x: 620,
      y: 260,
    },
  ],

  edges: [
    {
      from: 1,
      to: 2,
    },
    {
      from: 1,
      to: 4,
    },
    {
      from: 2,
      to: 3,
    },
    {
      from: 2,
      to: 5,
    },
    {
      from: 3,
      to: 6,
    },
    {
      from: 4,
      to: 5,
    },
    {
      from: 5,
      to: 6,
    },
  ],
};