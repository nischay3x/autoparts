import { useState, useEffect, useRef } from "react";

export default function useFetchData(query, skip, limit) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    setData([]);
  }, [query]);

  useEffect(() => {
    //if (!query || query.trim() === "") {
    //  setData([]);
    //  return;
    // }

    setIsLoading(true);

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    fetch(`/api/item?q=${query}&skip=${skip}&limit=${limit}`, {
      signal: abortController.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((responseData) => {
        setData(responseData);
        setError(null);
        setIsLoading(false);
        setHasMore(
          parseInt(responseData.total) >
            parseInt(skip) + responseData.data.length
        );
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          return;
        }
        setError(error);
        setData([]);
        setIsLoading(false);
      });

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, skip, limit]);

  return [isLoading, data, error, hasMore];
}
