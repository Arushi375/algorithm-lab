
def linear_search(array: list[int], target: int) -> dict:
    comparisons = 0

    for index, value in enumerate(array):
        comparisons += 1

        if value == target:
            return {
                "found": True,
                "index": index,
                "comparisons": comparisons,
            }

    return {
        "found": False,
        "index": -1,
        "comparisons": comparisons,
    }
def binary_search(array: list[int], target: int) -> dict:
    left = 0
    right = len(array) - 1
    comparisons = 0

    while left <= right:
        middle = (left + right) // 2
        comparisons += 1

        if array[middle] == target:
            return {
                "found": True,
                "index": middle,
                "comparisons": comparisons,
            }

        if array[middle] < target:
            left = middle + 1
        else:
            right = middle - 1

    return {
        "found": False,
        "index": -1,
        "comparisons": comparisons,
    }

