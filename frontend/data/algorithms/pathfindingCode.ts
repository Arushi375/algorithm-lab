export const dijkstraCode = {
    java: {
      name: "Java",
      code: `import java.util.*;
  
  public class Dijkstra {
  
      public static int[] dijkstra(
          List<List<int[]>> graph,
          int start
      ) {
          int n = graph.size();
  
          int[] distance = new int[n];
  
          Arrays.fill(
              distance,
              Integer.MAX_VALUE
          );
  
          distance[start] = 0;
  
          PriorityQueue<int[]> pq =
              new PriorityQueue<>(
                  Comparator.comparingInt(a -> a[1])
              );
  
          pq.offer(
              new int[]{start, 0}
          );
  
          while (!pq.isEmpty()) {
  
              int[] current = pq.poll();
  
              int node = current[0];
              int dist = current[1];
  
              if (dist > distance[node]) {
                  continue;
              }
  
              for (int[] edge : graph.get(node)) {
  
                  int neighbor = edge[0];
                  int weight = edge[1];
  
                  int newDistance =
                      dist + weight;
  
                  if (
                      newDistance <
                      distance[neighbor]
                  ) {
                      distance[neighbor] =
                          newDistance;
  
                      pq.offer(
                          new int[]{
                              neighbor,
                              newDistance
                          }
                      );
                  }
              }
          }
  
          return distance;
      }
  }`,
    },
  
    python: {
      name: "Python",
      code: `import heapq
  
  def dijkstra(graph, start):
  
      distances = {
          node: float("inf")
          for node in graph
      }
  
      distances[start] = 0
  
      priority_queue = [
          (0, start)
      ]
  
      while priority_queue:
  
          distance, current = heapq.heappop(
              priority_queue
          )
  
          if distance > distances[current]:
              continue
  
          for neighbor, weight in graph[current]:
  
              new_distance = (
                  distance + weight
              )
  
              if new_distance < distances[neighbor]:
  
                  distances[neighbor] = \
                      new_distance
  
                  heapq.heappush(
                      priority_queue,
                      (
                          new_distance,
                          neighbor
                      )
                  )
  
      return distances`,
    },
  
    javascript: {
      name: "JavaScript",
      code: `function dijkstra(graph, start) {
  
      const distances = {};
  
      for (const node in graph) {
          distances[node] = Infinity;
      }
  
      distances[start] = 0;
  
      const queue = [[0, start]];
  
      while (queue.length > 0) {
  
          queue.sort(
              (a, b) => a[0] - b[0]
          );
  
          const [distance, current] =
              queue.shift();
  
          if (distance > distances[current]) {
              continue;
          }
  
          for (const [neighbor, weight]
              of graph[current]) {
  
              const newDistance =
                  distance + weight;
  
              if (
                  newDistance <
                  distances[neighbor]
              ) {
                  distances[neighbor] =
                      newDistance;
  
                  queue.push([
                      newDistance,
                      neighbor
                  ]);
              }
          }
      }
  
      return distances;
  }`,
    },
  
    cpp: {
      name: "C++",
      code: `#include <iostream>
  #include <vector>
  #include <queue>
  #include <climits>
  
  using namespace std;
  
  vector<int> dijkstra(
      vector<vector<pair<int, int>>>& graph,
      int start
  ) {
      int n = graph.size();
  
      vector<int> distance(
          n,
          INT_MAX
      );
  
      priority_queue<
          pair<int, int>,
          vector<pair<int, int>>,
          greater<pair<int, int>>
      > pq;
  
      distance[start] = 0;
  
      pq.push({
          0,
          start
      });
  
      while (!pq.empty()) {
  
          auto [dist, current] =
              pq.top();
  
          pq.pop();
  
          if (dist > distance[current]) {
              continue;
          }
  
          for (auto [neighbor, weight] :
               graph[current]) {
  
              int newDistance =
                  dist + weight;
  
              if (
                  newDistance <
                  distance[neighbor]
              ) {
                  distance[neighbor] =
                      newDistance;
  
                  pq.push({
                      newDistance,
                      neighbor
                  });
              }
          }
      }
  
      return distance;
  }`,
    },
  
    c: {
      name: "C",
      code: `#include <stdio.h>
  #include <limits.h>
  
  #define MAX 100
  
  void dijkstra(
      int graph[MAX][MAX],
      int n,
      int start
  ) {
      int distance[MAX];
      int visited[MAX];
  
      for (int i = 0; i < n; i++) {
          distance[i] = INT_MAX;
          visited[i] = 0;
      }
  
      distance[start] = 0;
  
      for (int count = 0; count < n; count++) {
  
          int current = -1;
  
          for (int i = 0; i < n; i++) {
  
              if (
                  !visited[i] &&
                  distance[i] != INT_MAX &&
                  (
                      current == -1 ||
                      distance[i] < distance[current]
                  )
              ) {
                  current = i;
              }
          }
  
          if (current == -1) {
              break;
          }
  
          visited[current] = 1;
  
          for (int neighbor = 0;
               neighbor < n;
               neighbor++) {
  
              if (
                  graph[current][neighbor] > 0 &&
                  !visited[neighbor]
              ) {
  
                  int newDistance =
                      distance[current] +
                      graph[current][neighbor];
  
                  if (
                      newDistance <
                      distance[neighbor]
                  ) {
                      distance[neighbor] =
                          newDistance;
                  }
              }
          }
      }
  }`,
    },
  };
  
  
  /* ============================================================
     PRIM'S ALGORITHM
     ============================================================ */
  
  export const primsCode = {
    java: {
      name: "Java",
      code: `import java.util.*;
  
  public class Prims {
  
      public static void prim(
          List<List<int[]>> graph,
          int start
      ) {
          int n = graph.size();
  
          boolean[] visited =
              new boolean[n];
  
          PriorityQueue<int[]> pq =
              new PriorityQueue<>(
                  Comparator.comparingInt(
                      edge -> edge[2]
                  )
              );
  
          visited[start] = true;
  
          for (int[] edge : graph.get(start)) {
              pq.offer(
                  new int[]{
                      start,
                      edge[0],
                      edge[1]
                  }
              );
          }
  
          int edgesUsed = 0;
  
          while (
              !pq.isEmpty() &&
              edgesUsed < n - 1
          ) {
              int[] edge = pq.poll();
  
              int from = edge[0];
              int to = edge[1];
              int weight = edge[2];
  
              if (visited[to]) {
                  continue;
              }
  
              visited[to] = true;
  
              System.out.println(
                  from + " - " +
                  to + " : " +
                  weight
              );
  
              edgesUsed++;
  
              for (int[] next :
                   graph.get(to)) {
  
                  if (!visited[next[0]]) {
  
                      pq.offer(
                          new int[]{
                              to,
                              next[0],
                              next[1]
                          }
                      );
                  }
              }
          }
      }
  }`,
    },
  
    python: {
      name: "Python",
      code: `import heapq
  
  def prim(graph, start):
  
      visited = {start}
  
      priority_queue = []
  
      for neighbor, weight in graph[start]:
  
          heapq.heappush(
              priority_queue,
              (
                  weight,
                  start,
                  neighbor
              )
          )
  
      mst = []
  
      while priority_queue:
  
          weight, current, neighbor = \
              heapq.heappop(priority_queue)
  
          if neighbor in visited:
              continue
  
          visited.add(neighbor)
  
          mst.append(
              (
                  current,
                  neighbor,
                  weight
              )
          )
  
          for next_node, next_weight \
              in graph[neighbor]:
  
              if next_node not in visited:
  
                  heapq.heappush(
                      priority_queue,
                      (
                          next_weight,
                          neighbor,
                          next_node
                      )
                  )
  
      return mst`,
    },
  
    javascript: {
      name: "JavaScript",
      code: `function prim(graph, start) {
  
      const visited = new Set();
  
      const edges = [];
  
      const mst = [];
  
      visited.add(start);
  
      for (const [neighbor, weight]
          of graph[start]) {
  
          edges.push([
              weight,
              start,
              neighbor
          ]);
      }
  
      while (edges.length > 0) {
  
          edges.sort(
              (a, b) => a[0] - b[0]
          );
  
          const [
              weight,
              current,
              neighbor
          ] = edges.shift();
  
          if (visited.has(neighbor)) {
              continue;
          }
  
          visited.add(neighbor);
  
          mst.push([
              current,
              neighbor,
              weight
          ]);
  
          for (const [nextNode, nextWeight]
              of graph[neighbor]) {
  
              if (!visited.has(nextNode)) {
  
                  edges.push([
                      nextWeight,
                      neighbor,
                      nextNode
                  ]);
              }
          }
      }
  
      return mst;
  }`,
    },
  
    cpp: {
      name: "C++",
      code: `#include <iostream>
  #include <vector>
  #include <queue>
  
  using namespace std;
  
  void prim(
      vector<vector<pair<int, int>>>& graph,
      int start
  ) {
      int n = graph.size();
  
      vector<bool> visited(n, false);
  
      priority_queue<
          tuple<int, int, int>,
          vector<tuple<int, int, int>>,
          greater<tuple<int, int, int>>
      > pq;
  
      visited[start] = true;
  
      for (auto [neighbor, weight] :
           graph[start]) {
  
          pq.push({
              weight,
              start,
              neighbor
          });
      }
  
      int edgesUsed = 0;
  
      while (
          !pq.empty() &&
          edgesUsed < n - 1
      ) {
          auto [
              weight,
              current,
              neighbor
          ] = pq.top();
  
          pq.pop();
  
          if (visited[neighbor]) {
              continue;
          }
  
          visited[neighbor] = true;
  
          cout
              << current
              << " - "
              << neighbor
              << " : "
              << weight
              << endl;
  
          edgesUsed++;
  
          for (auto [nextNode, nextWeight] :
               graph[neighbor]) {
  
              if (!visited[nextNode]) {
  
                  pq.push({
                      nextWeight,
                      neighbor,
                      nextNode
                  });
              }
          }
      }
  }`,
    },
  
    c: {
      name: "C",
      code: `#include <stdio.h>
  #include <limits.h>
  
  #define MAX 100
  
  void prim(
      int graph[MAX][MAX],
      int n
  ) {
      int selected[MAX] = {0};
  
      int key[MAX];
  
      int parent[MAX];
  
      for (int i = 0; i < n; i++) {
          key[i] = INT_MAX;
          parent[i] = -1;
      }
  
      key[0] = 0;
  
      for (int count = 0;
           count < n;
           count++) {
  
          int current = -1;
  
          for (int i = 0; i < n; i++) {
  
              if (
                  !selected[i] &&
                  (
                      current == -1 ||
                      key[i] < key[current]
                  )
              ) {
                  current = i;
              }
          }
  
          selected[current] = 1;
  
          if (parent[current] != -1) {
  
              printf(
                  "%d - %d : %d\\n",
                  parent[current],
                  current,
                  key[current]
              );
          }
  
          for (int neighbor = 0;
               neighbor < n;
               neighbor++) {
  
              if (
                  graph[current][neighbor] > 0 &&
                  !selected[neighbor] &&
                  graph[current][neighbor] <
                      key[neighbor]
              ) {
  
                  key[neighbor] =
                      graph[current][neighbor];
  
                  parent[neighbor] =
                      current;
              }
          }
      }
  }`,
    },
  };
  
  
  /* ============================================================
     KRUSKAL'S ALGORITHM
     ============================================================ */
  
  export const kruskalsCode = {
    java: {
      name: "Java",
      code: `import java.util.*;
  
  public class Kruskals {
  
      static class Edge {
          int from;
          int to;
          int weight;
  
          Edge(
              int from,
              int to,
              int weight
          ) {
              this.from = from;
              this.to = to;
              this.weight = weight;
          }
      }
  
      static int find(
          int[] parent,
          int node
      ) {
          if (parent[node] != node) {
              parent[node] =
                  find(parent, parent[node]);
          }
  
          return parent[node];
      }
  
      static boolean union(
          int[] parent,
          int[] rank,
          int a,
          int b
      ) {
          int rootA =
              find(parent, a);
  
          int rootB =
              find(parent, b);
  
          if (rootA == rootB) {
              return false;
          }
  
          if (rank[rootA] < rank[rootB]) {
              parent[rootA] = rootB;
          } else if (
              rank[rootA] > rank[rootB]
          ) {
              parent[rootB] = rootA;
          } else {
              parent[rootB] = rootA;
              rank[rootA]++;
          }
  
          return true;
      }
  
      public static void kruskal(
          List<Edge> edges,
          int vertices
      ) {
          edges.sort(
              Comparator.comparingInt(
                  edge -> edge.weight
              )
          );
  
          int[] parent =
              new int[vertices];
  
          int[] rank =
              new int[vertices];
  
          for (int i = 0;
               i < vertices;
               i++) {
  
              parent[i] = i;
          }
  
          int edgesUsed = 0;
  
          for (Edge edge : edges) {
  
              if (
                  union(
                      parent,
                      rank,
                      edge.from,
                      edge.to
                  )
              ) {
  
                  System.out.println(
                      edge.from +
                      " - " +
                      edge.to +
                      " : " +
                      edge.weight
                  );
  
                  edgesUsed++;
  
                  if (
                      edgesUsed ==
                      vertices - 1
                  ) {
                      break;
                  }
              }
          }
      }
  }`,
    },
  
    python: {
      name: "Python",
      code: `def kruskal(edges, vertices):
  
      parent = list(range(vertices))
  
      rank = [0] * vertices
  
      def find(node):
  
          if parent[node] != node:
  
              parent[node] = \
                  find(parent[node])
  
          return parent[node]
  
      def union(a, b):
  
          root_a = find(a)
          root_b = find(b)
  
          if root_a == root_b:
              return False
  
          if rank[root_a] < rank[root_b]:
  
              parent[root_a] = root_b
  
          elif rank[root_a] > rank[root_b]:
  
              parent[root_b] = root_a
  
          else:
  
              parent[root_b] = root_a
              rank[root_a] += 1
  
          return True
  
      edges.sort(
          key=lambda edge: edge[2]
      )
  
      mst = []
  
      for a, b, weight in edges:
  
          if union(a, b):
  
              mst.append(
                  (a, b, weight)
              )
  
              if len(mst) == vertices - 1:
                  break
  
      return mst`,
    },
  
    javascript: {
      name: "JavaScript",
      code: `function kruskal(edges, vertices) {
  
      const parent =
          Array.from(
              { length: vertices },
              (_, index) => index
          );
  
      const rank =
          new Array(vertices).fill(0);
  
      function find(node) {
  
          if (parent[node] !== node) {
  
              parent[node] =
                  find(parent[node]);
          }
  
          return parent[node];
      }
  
      function union(a, b) {
  
          const rootA = find(a);
          const rootB = find(b);
  
          if (rootA === rootB) {
              return false;
          }
  
          if (rank[rootA] < rank[rootB]) {
  
              parent[rootA] = rootB;
  
          } else if (
              rank[rootA] > rank[rootB]
          ) {
  
              parent[rootB] = rootA;
  
          } else {
  
              parent[rootB] = rootA;
              rank[rootA]++;
          }
  
          return true;
      }
  
      edges.sort(
          (a, b) => a[2] - b[2]
      );
  
      const mst = [];
  
      for (const [from, to, weight]
          of edges) {
  
          if (union(from, to)) {
  
              mst.push([
                  from,
                  to,
                  weight
              ]);
  
              if (
                  mst.length ===
                  vertices - 1
              ) {
                  break;
              }
          }
      }
  
      return mst;
  }`,
    },
  
    cpp: {
      name: "C++",
      code: `#include <iostream>
  #include <vector>
  #include <algorithm>
  
  using namespace std;
  
  struct Edge {
      int from;
      int to;
      int weight;
  };
  
  int find(
      vector<int>& parent,
      int node
  ) {
      if (parent[node] != node) {
  
          parent[node] =
              find(parent, parent[node]);
      }
  
      return parent[node];
  }
  
  bool unite(
      vector<int>& parent,
      vector<int>& rank,
      int a,
      int b
  ) {
      int rootA =
          find(parent, a);
  
      int rootB =
          find(parent, b);
  
      if (rootA == rootB) {
          return false;
      }
  
      if (rank[rootA] < rank[rootB]) {
  
          parent[rootA] = rootB;
  
      } else if (
          rank[rootA] > rank[rootB]
      ) {
  
          parent[rootB] = rootA;
  
      } else {
  
          parent[rootB] = rootA;
          rank[rootA]++;
      }
  
      return true;
  }
  
  vector<Edge> kruskal(
      vector<Edge>& edges,
      int vertices
  ) {
      sort(
          edges.begin(),
          edges.end(),
          [](Edge& a, Edge& b) {
              return a.weight < b.weight;
          }
      );
  
      vector<int> parent(vertices);
      vector<int> rank(vertices, 0);
  
      for (int i = 0;
           i < vertices;
           i++) {
  
          parent[i] = i;
      }
  
      vector<Edge> mst;
  
      for (Edge edge : edges) {
  
          if (
              unite(
                  parent,
                  rank,
                  edge.from,
                  edge.to
              )
          ) {
  
              mst.push_back(edge);
  
              if (
                  mst.size() ==
                  vertices - 1
              ) {
                  break;
              }
          }
      }
  
      return mst;
  }`,
    },
  
    c: {
      name: "C",
      code: `#include <stdio.h>
  #include <stdlib.h>
  
  #define MAX 100
  
  typedef struct {
      int from;
      int to;
      int weight;
  } Edge;
  
  int parent[MAX];
  int rankValue[MAX];
  
  int find(int node) {
  
      if (parent[node] != node) {
  
          parent[node] =
              find(parent[node]);
      }
  
      return parent[node];
  }
  
  int unionSets(
      int a,
      int b
  ) {
      int rootA = find(a);
      int rootB = find(b);
  
      if (rootA == rootB) {
          return 0;
      }
  
      if (
          rankValue[rootA] <
          rankValue[rootB]
      ) {
  
          parent[rootA] = rootB;
  
      } else if (
          rankValue[rootA] >
          rankValue[rootB]
      ) {
  
          parent[rootB] = rootA;
  
      } else {
  
          parent[rootB] = rootA;
          rankValue[rootA]++;
      }
  
      return 1;
  }
  
  int compareEdges(
      const void* a,
      const void* b
  ) {
      Edge* edgeA = (Edge*)a;
      Edge* edgeB = (Edge*)b;
  
      return edgeA->weight -
             edgeB->weight;
  }
  
  void kruskal(
      Edge edges[],
      int edgeCount,
      int vertices
  ) {
      for (int i = 0;
           i < vertices;
           i++) {
  
          parent[i] = i;
          rankValue[i] = 0;
      }
  
      qsort(
          edges,
          edgeCount,
          sizeof(Edge),
          compareEdges
      );
  
      int edgesUsed = 0;
  
      for (int i = 0;
           i < edgeCount;
           i++) {
  
          if (
              unionSets(
                  edges[i].from,
                  edges[i].to
              )
          ) {
  
              printf(
                  "%d - %d : %d\\n",
                  edges[i].from,
                  edges[i].to,
                  edges[i].weight
              );
  
              edgesUsed++;
  
              if (
                  edgesUsed ==
                  vertices - 1
              ) {
                  break;
              }
          }
      }
  }`,
    },
  };