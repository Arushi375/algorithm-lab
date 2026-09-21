export const bubbleSortCode = {
    java: {
      name: "Java",
      code: `public static void bubbleSort(int[] arr) {
      int n = arr.length;
  
      for (int i = 0; i < n - 1; i++) {
          for (int j = 0; j < n - i - 1; j++) {
  
              if (arr[j] > arr[j + 1]) {
                  int temp = arr[j];
                  arr[j] = arr[j + 1];
                  arr[j + 1] = temp;
              }
          }
      }
  }`,
    },
  
    python: {
      name: "Python",
      code: `def bubble_sort(arr):
      n = len(arr)
  
      for i in range(n - 1):
          for j in range(n - i - 1):
  
              if arr[j] > arr[j + 1]:
                  arr[j], arr[j + 1] = arr[j + 1], arr[j]`,
    },
  
    javascript: {
      name: "JavaScript",
      code: `function bubbleSort(arr) {
      const n = arr.length;
  
      for (let i = 0; i < n - 1; i++) {
          for (let j = 0; j < n - i - 1; j++) {
  
              if (arr[j] > arr[j + 1]) {
                  const temp = arr[j];
                  arr[j] = arr[j + 1];
                  arr[j + 1] = temp;
              }
          }
      }
  
      return arr;
  }`,
    },
  
    cpp: {
      name: "C++",
      code: `void bubbleSort(vector<int>& arr) {
      int n = arr.size();
  
      for (int i = 0; i < n - 1; i++) {
          for (int j = 0; j < n - i - 1; j++) {
  
              if (arr[j] > arr[j + 1]) {
                  swap(arr[j], arr[j + 1]);
              }
          }
      }
  }`,
    },
  
    c: {
      name: "C",
      code: `void bubbleSort(int arr[], int n) {
  
      for (int i = 0; i < n - 1; i++) {
          for (int j = 0; j < n - i - 1; j++) {
  
              if (arr[j] > arr[j + 1]) {
                  int temp = arr[j];
                  arr[j] = arr[j + 1];
                  arr[j + 1] = temp;
              }
          }
      }
  }`,
    },
  };