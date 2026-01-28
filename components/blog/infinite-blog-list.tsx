"use client";

import { useCallback } from "react";
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

  const { items, isLoading, hasMore, sentinelRef } =
    useInfiniteScroll<BlogPostWithMeta>({
      initialItems: initialPosts as BlogPostWithMeta[],
      fetchMore,
      initialCursor,
      initialHasMore,
      rootMargin: "600px", // Start loading before reaching the end
    });

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
      {/* Blog Posts Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-0">
        {items.map((post) => (
          <div key={post.id} className="break-inside-avoid mb-6">
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

        {/* Loading skeletons inline with masonry */}
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`loading-skeleton-${index}`}
              className="break-inside-avoid mb-6"
            >
              <BlogCardSkeleton />
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
