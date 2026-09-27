export type AlgorithmCategory = {
    title: string;
    description: string;
    count: number;
    href: string;
  };
  
  export const algorithmCategories: AlgorithmCategory[] = [
    {
      title: "Searching",
      description:
        "Find elements efficiently using different search strategies.",
      count: 2,
      href: "/searching",
    },
  
    {
      title: "Sorting",
      description:
        "Understand how algorithms organize data step by step.",
      count: 5,
      href: "/sorting",
    },
  
    {
      title: "Graph Algorithms",
      description:
        "Explore graphs using traversal and connectivity algorithms.",
      count: 2,
      href: "/graphs",
    },
  
    {
      title: "Path Finding Algorithms",
      description:
        "Visualize shortest paths and minimum spanning trees on a grid.",
      count: 3,
      href: "/pathfinding",
    },
  ];