export const bfsCode = {
    java: {
      name: "Java",
      code: `import java.util.*;
  
  public class BFS {
      public static void bfs(
          Map<Integer, List<Integer>> graph,
          int start
      ) {
          Queue<Integer> queue = new LinkedList<>();
          Set<Integer> visited = new HashSet<>();
  
          queue.add(start);
          visited.add(start);
  
          while (!queue.isEmpty()) {
              int current = queue.poll();
  
              System.out.println(current);
  
              for (int neighbor : graph.get(current)) {
                  if (!visited.contains(neighbor)) {
                      visited.add(neighbor);
                      queue.add(neighbor);
                  }
              }
          }
      }
  }`,
    },
  
    python: {
      name: "Python",
      code: `from collections import deque
  
  def bfs(graph, start):
      queue = deque([start])
      visited = {start}
  
      while queue:
          current = queue.popleft()
  
          print(current)
  
          for neighbor in graph[current]:
              if neighbor not in visited:
                  visited.add(neighbor)
                  queue.append(neighbor)`,
    },
  
    javascript: {
      name: "JavaScript",
      code: `function bfs(graph, start) {
      const queue = [start];
      const visited = new Set([start]);
  
      while (queue.length > 0) {
          const current = queue.shift();
  
          console.log(current);
  
          for (const neighbor of graph[current]) {
              if (!visited.has(neighbor)) {
                  visited.add(neighbor);
                  queue.push(neighbor);
              }
          }
      }
  }`,
    },
  
    cpp: {
      name: "C++",
      code: `#include <iostream>
  #include <queue>
  #include <unordered_map>
  #include <unordered_set>
  #include <vector>
  
  using namespace std;
  
  void bfs(
      unordered_map<int, vector<int>>& graph,
      int start
  ) {
      queue<int> q;
      unordered_set<int> visited;
  
      q.push(start);
      visited.insert(start);
  
      while (!q.empty()) {
          int current = q.front();
          q.pop();
  
          cout << current << endl;
  
          for (int neighbor : graph[current]) {
              if (!visited.count(neighbor)) {
                  visited.insert(neighbor);
                  q.push(neighbor);
              }
          }
      }
  }`,
    },
  
    c: {
      name: "C",
      code: `#include <stdio.h>
  
  #define MAX 100
  
  void bfs(int graph[MAX][MAX], int n, int start) {
      int queue[MAX];
      int visited[MAX] = {0};
  
      int front = 0;
      int rear = 0;
  
      queue[rear++] = start;
      visited[start] = 1;
  
      while (front < rear) {
          int current = queue[front++];
  
          printf("%d\\n", current);
  
          for (int neighbor = 0; neighbor < n; neighbor++) {
              if (graph[current][neighbor] &&
                  !visited[neighbor]) {
  
                  visited[neighbor] = 1;
                  queue[rear++] = neighbor;
              }
          }
      }
  }`,
    },
  };
  
  export const dfsCode = {
    java: {
      name: "Java",
      code: `import java.util.*;
  
  public class DFS {
      public static void dfs(
          Map<Integer, List<Integer>> graph,
          int current,
          Set<Integer> visited
      ) {
          visited.add(current);
  
          System.out.println(current);
  
          for (int neighbor : graph.get(current)) {
              if (!visited.contains(neighbor)) {
                  dfs(graph, neighbor, visited);
              }
          }
      }
  }`,
    },
  
    python: {
      name: "Python",
      code: `def dfs(graph, current, visited):
      visited.add(current)
  
      print(current)
  
      for neighbor in graph[current]:
          if neighbor not in visited:
              dfs(graph, neighbor, visited)`,
    },
  
    javascript: {
      name: "JavaScript",
      code: `function dfs(graph, current, visited = new Set()) {
      visited.add(current);
  
      console.log(current);
  
      for (const neighbor of graph[current]) {
          if (!visited.has(neighbor)) {
              dfs(graph, neighbor, visited);
          }
      }
  }`,
    },
  
    cpp: {
      name: "C++",
      code: `#include <iostream>
  #include <unordered_map>
  #include <unordered_set>
  #include <vector>
  
  using namespace std;
  
  void dfs(
      unordered_map<int, vector<int>>& graph,
      int current,
      unordered_set<int>& visited
  ) {
      visited.insert(current);
  
      cout << current << endl;
  
      for (int neighbor : graph[current]) {
          if (!visited.count(neighbor)) {
              dfs(graph, neighbor, visited);
          }
      }
  }`,
    },
  
    c: {
      name: "C",
      code: `#include <stdio.h>
  
  #define MAX 100
  
  void dfs(
      int graph[MAX][MAX],
      int n,
      int current,
      int visited[MAX]
  ) {
      visited[current] = 1;
  
      printf("%d\\n", current);
  
      for (int neighbor = 0; neighbor < n; neighbor++) {
          if (graph[current][neighbor] &&
              !visited[neighbor]) {
  
              dfs(
                  graph,
                  n,
                  neighbor,
                  visited
              );
          }
      }
  }`,
    },
  };
  
  