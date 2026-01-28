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
  /** Function to get unique key from item (for deduplication) */
  getItemKey?: (item: T) => string;
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
}

export function useInfiniteScroll<T>({
  initialItems,
  fetchMore,
  initialCursor,
  initialHasMore,
  rootMargin = "400px",
  threshold = 0,
  getItemKey = (item: T) => (item as { id: string }).id,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollReturn<T> {
  // State is initialized from props - component should be keyed to reset on filter/sort change
  const [items, setItems] = useState<T[]>(initialItems);
  const [cursor, setCursor] = useState<string | null>(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [error, setError] = useState<Error | null>(null);
  const [isPending, startTransition] = useTransition();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const isLoadingRef = useRef(false);
  // Track seen IDs to prevent duplicates - using ref to avoid re-renders
  const seenIdsRef = useRef<Set<string>>(new Set(initialItems.map(getItemKey)));

  const loadMore = useCallback(async () => {
    // Prevent multiple simultaneous fetches
    if (isLoadingRef.current || !hasMore) return;

    isLoadingRef.current = true;

    startTransition(async () => {
      try {
        const result = await fetchMore(cursor);

        // Deduplicate items by checking against seen IDs
        const newUniqueItems = result.items.filter((item) => {
          const key = getItemKey(item);
          if (seenIdsRef.current.has(key)) {
            return false;
          }
          seenIdsRef.current.add(key);
          return true;
        });

        setItems((prev) => [...prev, ...newUniqueItems]);
        setCursor(result.nextCursor);
        setHasMore(result.hasMore);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load more items"),
        );
      } finally {
        isLoadingRef.current = false;
      }
    });
  }, [cursor, fetchMore, hasMore, getItemKey]);

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
        },
      );

      observerRef.current.observe(node);
    },
    [hasMore, loadMore, rootMargin, threshold],
  );

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    items,
    isLoading: isPending,
    hasMore,
    error,
    sentinelRef,
    loadMore,
  };
}
