
const API_URL = "http://127.0.0.1:8000";

export type SearchResponse = {
  found: boolean;
  index: number;
  comparisons: number;
};

export async function linearSearchAPI(
  array: number[],
  target: number
): Promise<SearchResponse> {
  const response = await fetch(
    `${API_URL}/api/searching/linear-search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        array,
        target,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to run Linear Search API");
  }

  return response.json();
}
export async function binarySearchAPI(
    array: number[],
    target: number
  ): Promise<SearchResponse> {
    const response = await fetch(
      `${API_URL}/api/searching/binary-search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          array,
          target,
        }),
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to run Binary Search API");
    }
  
    return response.json();
  }
  export type SortResponse = {
    array: number[];
    comparisons: number;
    swaps: number;
  };
  

export async function bubbleSortAPI(
    array: number[]
  ): Promise<SortResponse> {
    const response = await fetch(
      `${API_URL}/api/sorting/bubble-sort`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          array,
        }),
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to run Bubble Sort API");
    }
  
    return response.json();
  }
  export async function insertionSortAPI(
    array: number[]
  ): Promise<SortResponse> {
    const response = await fetch(
      `${API_URL}/api/sorting/insertion-sort`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          array,
        }),
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to run Insertion Sort API");
    }
  
    return response.json();
  }
  export async function selectionSortAPI(
    array: number[]
  ): Promise<SortResponse> {
    const response = await fetch(
      `${API_URL}/api/sorting/selection-sort`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          array,
        }),
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to run Selection Sort API");
    }
  
    return response.json();
  }
  export async function mergeSortAPI(
    array: number[]
  ): Promise<SortResponse> {
    const response = await fetch(
      `${API_URL}/api/sorting/merge-sort`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          array,
        }),
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to run Merge Sort API");
    }
  
    return response.json();
  }

  export async function quickSortAPI(
    array: number[]
  ): Promise<SortResponse> {
    const response = await fetch(
      `${API_URL}/api/sorting/quick-sort`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          array,
        }),
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to run Quick Sort API");
    }
  
    return response.json();
  }