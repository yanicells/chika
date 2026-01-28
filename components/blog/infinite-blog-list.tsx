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
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-0">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`loading-skeleton-${index}`}
              className="break-inside-avoid mb-6"
            >
              <BlogCardSkeleton />
            </div>
          ))}
        </div>
      )}

      {/* Sentinel element for intersection observer */}
      {hasMore && !isLoading && (
        <div ref={sentinelRef} className="h-4 w-full" aria-hidden="true" />
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
