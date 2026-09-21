
export const quickSortLanguages = {
  java: {
    name: "Java",
    code: `public static void quickSort(
    int[] arr,
    int low,
    int high
) {
    if (low >= high) {
        return;
    }

    int pivotIndex = partition(arr, low, high);

    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
}

private static int partition(
    int[] arr,
    int low,
    int high
) {
    int pivot = arr[high];

    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;

            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;

    return i + 1;
}`,
  },

  python: {
    name: "Python",
    code: `def quick_sort(arr, low, high):
    if low >= high:
        return

    pivot_index = partition(arr, low, high)

    quick_sort(arr, low, pivot_index - 1)
    quick_sort(arr, pivot_index + 1, high)


def partition(arr, low, high):
    pivot = arr[high]

    i = low - 1

    for j in range(low, high):
        if arr[j] < pivot:
            i += 1

            arr[i], arr[j] = arr[j], arr[i]

    arr[i + 1], arr[high] = (
        arr[high],
        arr[i + 1]
    )

    return i + 1`,
  },

  javascript: {
    name: "JavaScript",
    code: `function quickSort(arr, low, high) {
  if (low >= high) {
    return;
  }

  const pivotIndex = partition(
    arr,
    low,
    high
  );

  quickSort(
    arr,
    low,
    pivotIndex - 1
  );

  quickSort(
    arr,
    pivotIndex + 1,
    high
  );
}

function partition(arr, low, high) {
  const pivot = arr[high];

  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;

      [arr[i], arr[j]] = [
        arr[j],
        arr[i],
      ];
    }
  }

  [arr[i + 1], arr[high]] = [
    arr[high],
    arr[i + 1],
  ];

  return i + 1;
}`,
  },

  cpp: {
    name: "C++",
    code: `int partition(
    vector<int>& arr,
    int low,
    int high
) {
    int pivot = arr[high];

    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;

            swap(arr[i], arr[j]);
        }
    }

    swap(arr[i + 1], arr[high]);

    return i + 1;
}

void quickSort(
    vector<int>& arr,
    int low,
    int high
) {
    if (low >= high) {
        return;
    }

    int pivotIndex =
        partition(arr, low, high);

    quickSort(
        arr,
        low,
        pivotIndex - 1
    );

    quickSort(
        arr,
        pivotIndex + 1,
        high
    );
}`,
  },

  c: {
    name: "C",
    code: `int partition(
    int arr[],
    int low,
    int high
) {
    int pivot = arr[high];

    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;

            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;

    return i + 1;
}

void quickSort(
    int arr[],
    int low,
    int high
) {
    if (low >= high) {
        return;
    }

    int pivotIndex =
        partition(arr, low, high);

    quickSort(
        arr,
        low,
        pivotIndex - 1
    );

    quickSort(
        arr,
        pivotIndex + 1,
        high
    );
}`,
  },
};

