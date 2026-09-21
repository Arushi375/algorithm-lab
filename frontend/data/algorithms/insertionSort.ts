export const insertionSortCode = {
    java: {
      name: "Java",
      code: `public static void insertionSort(int[] arr) {
      int n = arr.length;
  
      for (int i = 1; i < n; i++) {
          int key = arr[i];
          int j = i - 1;
  
          while (j >= 0 && arr[j] > key) {
              arr[j + 1] = arr[j];
              j--;
          }
  
          arr[j + 1] = key;
      }
  }`,
    },
  
    python: {
      name: "Python",
      code: `def insertion_sort(arr):
  
      for i in range(1, len(arr)):
          key = arr[i]
          j = i - 1
  
          while j >= 0 and arr[j] > key:
              arr[j + 1] = arr[j]
              j -= 1
  
          arr[j + 1] = key
  
      return arr`,
    },
  
    javascript: {
      name: "JavaScript",
      code: `function insertionSort(arr) {
  
      for (let i = 1; i < arr.length; i++) {
          const key = arr[i];
          let j = i - 1;
  
          while (j >= 0 && arr[j] > key) {
              arr[j + 1] = arr[j];
              j--;
          }
  
          arr[j + 1] = key;
      }
  
      return arr;
  }`,
    },
  
    cpp: {
      name: "C++",
      code: `void insertionSort(vector<int>& arr) {
  
      for (int i = 1; i < arr.size(); i++) {
          int key = arr[i];
          int j = i - 1;
  
          while (j >= 0 && arr[j] > key) {
              arr[j + 1] = arr[j];
              j--;
          }
  
          arr[j + 1] = key;
      }
  }`,
    },
  
    c: {
      name: "C",
      code: `void insertionSort(int arr[], int n) {
  
      for (int i = 1; i < n; i++) {
          int key = arr[i];
          int j = i - 1;
  
          while (j >= 0 && arr[j] > key) {
              arr[j + 1] = arr[j];
              j--;
          }
  
          arr[j + 1] = key;
      }
  }`,
    },
  };