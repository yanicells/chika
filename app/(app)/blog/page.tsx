import { Suspense } from "react";
import Container from "@/components/shared/container";
import { getPublishedBlogPostsPaginated } from "@/lib/queries/blog";
import { getBlogCommentsWithReactions } from "@/lib/queries/comments";
import InfiniteBlogList from "@/components/blog/infinite-blog-list";
import BlogCardSkeleton from "@/components/blog/blog-card-skeleton";
import { isAdmin } from "@/lib/auth-helper";

export default async function BlogPage() {
  return (
    <Container>
      <div className="pt-12 pb-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text mb-2">My Blog Posts</h1>
          <p className="text-lg text-subtext1">
            Thoughts, learnings, and updates
          </p>
        </div>

        <Suspense fallback={<BlogGridFallback />}>
          <BlogContent />
        </Suspense>
      </div>
    </Container>
  );
}

async function BlogContent() {
  // Always start with page 1 for infinite scroll
  const { posts, totalPages } = await getPublishedBlogPostsPaginated(1, 6);
  const adminStatus = await isAdmin();

  // Fetch comment counts for all blog posts in parallel
  const postsWithComments = await Promise.all(
    posts.map(async (post) => {
      const comments = await getBlogCommentsWithReactions(post.id);
      return {
        ...post,
        commentCount: comments.length,
      };
    }),
  );

  // Calculate infinite scroll props
  const hasMore = totalPages > 1;
  const nextCursor = hasMore ? "2" : null;

  if (postsWithComments.length === 0) {
    return <p className="text-center text-subtext0 py-8">No blog posts yet.</p>;
  }

  return (
    <InfiniteBlogList
      initialPosts={postsWithComments}
      initialHasMore={hasMore}
      initialCursor={nextCursor}
      isUserAdmin={adminStatus}
    />
  );
}

function BlogGridFallback() {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-0">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={`blog-skeleton-${index}`} className="break-inside-avoid mb-6">
          <BlogCardSkeleton />
        </div>
      ))}
    </div>
  );
}
