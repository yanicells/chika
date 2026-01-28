"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";

interface UseInfiniteScrollOptions<T> {
  /** Initial items to display */
  initialItems: T[];
  /** Function to fetch more items */
  fetchMore: (cursor: string | null) => Promise<{
    items: T[];
    nextCursor: string | null;
    hasMore: boolean;
  }>;
  /** Initial cursor for pagination */
  initialCursor: string | null;
  /** Whether there are more items to load initially */
  initialHasMore: boolean;
  /** Root margin for intersection observer */
  rootMargin?: string;
  /** Threshold for intersection observer */
  threshold?: number;
}

interface UseInfiniteScrollReturn<T> {
  /** All loaded items */
  items: T[];
  /** Whether more items are being loaded */
  isLoading: boolean;
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Error if any occurred */
  error: Error | null;
  /** Ref to attach to the sentinel element */
  sentinelRef: (node: HTMLDivElement | null) => void;
  /** Manually trigger loading more items */
  loadMore: () => void;
  /** Reset the infinite scroll state with new items */
  reset: (newItems: T[], newCursor: string | null, newHasMore: boolean) => void;
}

export function useInfiniteScroll<T>({
  initialItems,
  fetchMore,
  initialCursor,
  initialHasMore,
  rootMargin = "400px",
  threshold = 0,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  const [items, setItems] = useState<T[]>(initialItems);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, startTransition] = useTransition();
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isLoadingRef = useRef(false);

  // Reset state when initial items change (e.g., filter/sort change)
  useEffect(() => {
    setItems(initialItems);
    setCursor(initialCursor);
    setHasMore(initialHasMore);
    setError(null);
  }, [initialItems, initialCursor, initialHasMore]);

  const loadMore = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (isLoadingRef.current || !hasMore) return;
    
    isLoadingRef.current = true;
    
    startTransition(async () => {
      try {
        const result = await fetchMore(cursor);
        
        setItems((prev) => [...prev, ...result.items]);
        setCursor(result.nextCursor);
        setHasMore(result.hasMore);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load more items"));
      } finally {
        isLoadingRef.current = false;
      }
    });
  }, [cursor, fetchMore, hasMore]);

  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      // Disconnect previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (!node || !hasMore) return;

      // Create new intersection observer
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting && hasMore && !isLoadingRef.current) {
            loadMore();
          }
        },
        {
          rootMargin,
          threshold,
        }
      );

      observerRef.current.observe(node);
    },
    [hasMore, loadMore, rootMargin, threshold]
  );

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const reset = useCallback((newItems: T[], newCursor: string | null, newHasMore: boolean) => {
    setItems(newItems);
    setCursor(newCursor);
    setHasMore(newHasMore);
    setError(null);
  }, []);

  return {
    items,
    isLoading: isPending,
    hasMore,
    error,
    sentinelRef,
    loadMore,
    reset,
  };
}
