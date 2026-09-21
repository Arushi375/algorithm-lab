
export const binarySearchLanguages = {
  java: {
    name: "Java",
    code: `public static int binarySearch(
    int[] arr,
    int target
) {
    int left = 0;
    int right = arr.length - 1;

    while (left <= right) {
        int middle = (left + right) / 2;

        if (arr[middle] == target) {
            return middle;
        }

        if (arr[middle] < target) {
            left = middle + 1;
        } else {
            right = middle - 1;
        }
    }

    return -1;
}`,
  },

  python: {
    name: "Python",
    code: `def binary_search(arr, target):
    left = 0
    right = len(arr) - 1

    while left <= right:
        middle = (left + right) // 2

        if arr[middle] == target:
            return middle

        if arr[middle] < target:
            left = middle + 1
        else:
            right = middle - 1

    return -1`,
  },

  javascript: {
    name: "JavaScript",
    code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);

    if (arr[middle] === target) {
      return middle;
    }

    if (arr[middle] < target) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }

  return -1;
}`,
  },

  cpp: {
    name: "C++",
    code: `int binarySearch(
    vector<int>& arr,
    int target
) {
    int left = 0;
    int right = arr.size() - 1;

    while (left <= right) {
        int middle = (left + right) / 2;

        if (arr[middle] == target) {
            return middle;
        }

        if (arr[middle] < target) {
            left = middle + 1;
        } else {
            right = middle - 1;
        }
    }

    return -1;
}`,
  },

  c: {
    name: "C",
    code: `int binarySearch(
    int arr[],
    int size,
    int target
) {
    int left = 0;
    int right = size - 1;

    while (left <= right) {
        int middle = (left + right) / 2;

        if (arr[middle] == target) {
            return middle;
        }

        if (arr[middle] < target) {
            left = middle + 1;
        } else {
            right = middle - 1;
        }
    }

    return -1;
}`,
  },
};

