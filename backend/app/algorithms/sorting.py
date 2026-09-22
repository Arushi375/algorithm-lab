def bubble_sort(array: list[int]) -> dict:
    arr = array.copy()

    comparisons = 0
    swaps = 0

    n = len(arr)

    for i in range(n):
        swapped = False

        for j in range(0, n - i - 1):
            comparisons += 1

            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]

                swaps += 1
                swapped = True

        if not swapped:
            break

    return {
        "array": arr,
        "comparisons": comparisons,
        "swaps": swaps,
    }

def insertion_sort(array: list[int]) -> dict:
    arr = array.copy()

    comparisons = 0
    moves = 0

    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1

        while j >= 0:
            comparisons += 1

            if arr[j] > key:
                arr[j + 1] = arr[j]
                moves += 1
                j -= 1
            else:
                break

        arr[j + 1] = key

    return {
        "array": arr,
        "comparisons": comparisons,
        "swaps": moves,
    }

def selection_sort(array: list[int]) -> dict:
    arr = array.copy()

    comparisons = 0
    swaps = 0

    n = len(arr)

    for i in range(n - 1):
        min_index = i

        for j in range(i + 1, n):
            comparisons += 1

            if arr[j] < arr[min_index]:
                min_index = j

        if min_index != i:
            arr[i], arr[min_index] = (
                arr[min_index],
                arr[i],
            )

            swaps += 1

    return {
        "array": arr,
        "comparisons": comparisons,
        "swaps": swaps,
    }
def merge_sort(array: list[int]) -> dict:
    arr = array.copy()

    comparisons = 0
    swaps = 0

    def merge(left: list[int], right: list[int]) -> list[int]:
        nonlocal comparisons, swaps

        result = []
        i = 0
        j = 0

        while i < len(left) and j < len(right):
            comparisons += 1

            if left[i] <= right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1

        result.extend(left[i:])
        result.extend(right[j:])

        return result

    def sort(values: list[int]) -> list[int]:
        if len(values) <= 1:
            return values

        middle = len(values) // 2

        left = sort(values[:middle])
        right = sort(values[middle:])

        return merge(left, right)

    sorted_array = sort(arr)

    return {
        "array": sorted_array,
        "comparisons": comparisons,
        "swaps": swaps,
    }

def quick_sort(array: list[int]) -> dict:
    arr = array.copy()

    comparisons = 0
    swaps = 0

    def partition(
        low: int,
        high: int
    ) -> int:
        nonlocal comparisons, swaps

        pivot = arr[high]

        i = low - 1

        for j in range(low, high):
            comparisons += 1

            if arr[j] <= pivot:
                i += 1

                if i != j:
                    arr[i], arr[j] = (
                        arr[j],
                        arr[i],
                    )

                    swaps += 1

        if i + 1 != high:
            arr[i + 1], arr[high] = (
                arr[high],
                arr[i + 1],
            )

            swaps += 1

        return i + 1

    def sort(
        low: int,
        high: int
    ) -> None:
        if low >= high:
            return

        pivot_index = partition(
            low,
            high
        )

        sort(
            low,
            pivot_index - 1
        )

        sort(
            pivot_index + 1,
            high
        )

    sort(0, len(arr) - 1)

    return {
        "array": arr,
        "comparisons": comparisons,
        "swaps": swaps,
    }
