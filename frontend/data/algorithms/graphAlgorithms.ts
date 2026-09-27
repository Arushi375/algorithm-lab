export type GraphAlgorithm = {
    slug: string;
    title: string;
    description: string;
    category: string;
    complexity: string;
  };
  
  export const graphAlgorithms: GraphAlgorithm[] = [
    {
      slug: "bfs",
      title: "Breadth-First Search",
      description:
        "Explore a graph level by level using a queue. BFS is useful for finding the shortest path in an unweighted graph.",
      category: "Graph Traversal",
      complexity: "O(V + E)",
    },
    {
      slug: "dfs",
      title: "Depth-First Search",
      description:
        "Explore as far as possible along each branch before backtracking using a stack or recursion.",
      category: "Graph Traversal",
      complexity: "O(V + E)",
    },
    
  ];