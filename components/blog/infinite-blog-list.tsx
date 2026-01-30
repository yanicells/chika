"use client";

import { useCallback, useMemo } from "react";
import { BlogPost } from "@/db/schema";
import BlogCard from "./blog-card";
import BlogCardSkeleton from "./blog-card-skeleton";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import {
  fetchBlogPostsInfinite,
  type BlogPostWithMeta,
} from "@/lib/actions/infinite-scroll-actions";

interface InfiniteBlogListProps {
  initialPosts: (BlogPost & {
    reactions?: {
      regular: number;
      admin: number;
    };
    commentCount?: number;
  })[];
  initialHasMore: boolean;
  initialCursor: string | null;
  isUserAdmin?: boolean;
}

export default function InfiniteBlogList({
  initialPosts,
  initialHasMore,
  initialCursor,
  isUserAdmin = false,
}: InfiniteBlogListProps) {
  const fetchMore = useCallback(async (cursor: string | null) => {
    return fetchBlogPostsInfinite(cursor);
  }, []);

  // Memoize getItemKey to prevent unnecessary re-renders
  const getItemKey = useCallback((item: BlogPostWithMeta) => item.id, []);

  const { items, isLoading, hasMore, sentinelRef } =
    useInfiniteScroll<BlogPostWithMeta>({
      initialItems: initialPosts as BlogPostWithMeta[],
      fetchMore,
      initialCursor,
      initialHasMore,
      rootMargin: "600px",
      getItemKey,
    });

  // Distribute items into columns using round-robin assignment
  // This ensures items stay in their assigned column and don't reflow when new items load
  const columns = useMemo(() => {
    const columnCount = 3;
    const cols: BlogPostWithMeta[][] = Array.from(
      { length: columnCount },
      () => [],
    );

    items.forEach((item, index) => {
      cols[index % columnCount].push(item);
    });

    return cols;
  }, [items]);

  if (items.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-subtext0 text-lg">
          No blog posts yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 
        Flexbox-based masonry with stable column assignment:
        - Items are pre-assigned to columns via round-robin
        - Adding new items doesn't cause existing items to reflow
      */}

      {/* Mobile: single column */}
      <div className="flex flex-col gap-6 md:hidden">
        {items.map((post) => (
          <div key={post.id} className="w-full">
            <BlogCard
              post={
                post as BlogPost & {
                  reactions?: { regular: number; admin: number };
                  commentCount?: number;
                }
              }
              isUserAdmin={isUserAdmin}
            />
          </div>
        ))}
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <BlogCardSkeleton key={`skeleton-mobile-${index}`} />
          ))}
      </div>

      {/* Tablet: 2 columns */}
      <div className="hidden md:flex lg:hidden gap-6 items-start">
        {[0, 1].map((colIndex) => (
          <div key={colIndex} className="flex-1 flex flex-col gap-6">
            {items
              .filter((_, i) => i % 2 === colIndex)
              .map((post) => (
                <div key={post.id} className="w-full">
                  <BlogCard
                    post={
                      post as BlogPost & {
                        reactions?: { regular: number; admin: number };
                        commentCount?: number;
                      }
                    }
                    isUserAdmin={isUserAdmin}
                  />
                </div>
              ))}
            {isLoading && colIndex < 2 && (
              <BlogCardSkeleton key={`skeleton-tablet-${colIndex}`} />
            )}
          </div>
        ))}
      </div>

      {/* Desktop: 3 columns */}
      <div className="hidden lg:flex gap-6 items-start">
        {columns.map((columnItems, colIndex) => (
          <div key={colIndex} className="flex-1 flex flex-col gap-6">
            {columnItems.map((post) => (
              <div key={post.id} className="w-full">
                <BlogCard
                  post={
                    post as BlogPost & {
                      reactions?: { regular: number; admin: number };
                      commentCount?: number;
                    }
                  }
                  isUserAdmin={isUserAdmin}
                />
              </div>
            ))}
            {isLoading && (
              <BlogCardSkeleton key={`skeleton-desktop-${colIndex}`} />
            )}
          </div>
        ))}
      </div>

      {/* Loading spinner for visual feedback */}
      {isLoading && (
        <div className="flex justify-center py-6">
          <div className="flex items-center gap-2 text-subtext0">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm">Loading more...</span>
          </div>
        </div>
      )}

      {/* Sentinel element for intersection observer */}
      {hasMore && !isLoading && (
        <div ref={sentinelRef} className="h-10 w-full" aria-hidden="true" />
      )}

      {/* End of content indicator */}
      {!hasMore && items.length > 0 && (
        <div className="text-center py-8">
          <p className="text-subtext0 text-sm">You&apos;ve reached the end!</p>
        </div>
      )}
    </div>
  );
}
