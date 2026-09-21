
export const linearSearchLanguages = {
  java: {
    name: "Java",
    code: `public static int linearSearch(
    int[] arr,
    int target
) {
    for (int i = 0; i < arr.length; i++) {
        if (arr[i] == target) {
            return i;
        }
    }

    return -1;
}`,
  },

  python: {
    name: "Python",
    code: `def linear_search(arr, target):
    for i in range(len(arr)):
        if arr[i] == target:
            return i

    return -1`,
  },

  javascript: {
    name: "JavaScript",
    code: `function linearSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      return i;
    }
  }

  return -1;
}`,
  },

  cpp: {
    name: "C++",
    code: `int linearSearch(
    vector<int>& arr,
    int target
) {
    for (int i = 0; i < arr.size(); i++) {
        if (arr[i] == target) {
            return i;
        }
    }

    return -1;
}`,
  },

  c: {
    name: "C",
    code: `int linearSearch(
    int arr[],
    int size,
    int target
) {
    for (int i = 0; i < size; i++) {
        if (arr[i] == target) {
            return i;
        }
    }

    return -1;
}`,
  },
};

