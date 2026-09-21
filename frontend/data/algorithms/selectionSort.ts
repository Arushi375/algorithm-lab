export const selectionSortCode = {
    java: {
      name: "Java",
      code: `public static void selectionSort(int[] arr) {
      int n = arr.length;
  
      for (int i = 0; i < n - 1; i++) {
          int minIndex = i;
  
          for (int j = i + 1; j < n; j++) {
              if (arr[j] < arr[minIndex]) {
                  minIndex = j;
              }
          }
  
          int temp = arr[i];
          arr[i] = arr[minIndex];
          arr[minIndex] = temp;
      }
  }`,
    },
  
    python: {
      name: "Python",
      code: `def selection_sort(arr):
      n = len(arr)
  
      for i in range(n - 1):
          min_index = i
  
          for j in range(i + 1, n):
              if arr[j] < arr[min_index]:
                  min_index = j
  
          arr[i], arr[min_index] = arr[min_index], arr[i]
  
      return arr`,
    },
  
    javascript: {
      name: "JavaScript",
      code: `function selectionSort(arr) {
      const n = arr.length;
  
      for (let i = 0; i < n - 1; i++) {
          let minIndex = i;
  
          for (let j = i + 1; j < n; j++) {
              if (arr[j] < arr[minIndex]) {
                  minIndex = j;
              }
          }
  
          const temp = arr[i];
          arr[i] = arr[minIndex];
          arr[minIndex] = temp;
      }
  
      return arr;
  }`,
    },
  
    cpp: {
      name: "C++",
      code: `void selectionSort(vector<int>& arr) {
      int n = arr.size();
  
      for (int i = 0; i < n - 1; i++) {
          int minIndex = i;
  
          for (int j = i + 1; j < n; j++) {
              if (arr[j] < arr[minIndex]) {
                  minIndex = j;
              }
          }
  
          swap(arr[i], arr[minIndex]);
      }
  }`,
    },
  
    c: {
      name: "C",
      code: `void selectionSort(int arr[], int n) {
  
      for (int i = 0; i < n - 1; i++) {
          int minIndex = i;
  
          for (int j = i + 1; j < n; j++) {
              if (arr[j] < arr[minIndex]) {
                  minIndex = j;
              }
          }
  
          int temp = arr[i];
          arr[i] = arr[minIndex];
          arr[minIndex] = temp;
      }
  }`,
    },
  };