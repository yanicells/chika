import { Suspense } from "react";
import Container from "@/components/shared/container";
import { getPublishedBlogPostsPaginated } from "@/lib/queries/blog";
import { getBlogCommentsWithReactions } from "@/lib/queries/comments";
import BlogList from "@/components/blog/blog-list";
import BlogCardSkeleton from "@/components/blog/blog-card-skeleton";
import BlogPagination from "@/components/blog/blog-pagination";
import { isAdmin } from "@/lib/auth-helper";

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

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
          <BlogContent currentPage={currentPage} />
        </Suspense>
      </div>
    </Container>
  );
}

async function BlogContent({ currentPage }: { currentPage: number }) {
  const { posts, totalPages } = await getPublishedBlogPostsPaginated(
    currentPage,
    6
  );
  const adminStatus = await isAdmin();

  // Fetch comment counts for all blog posts
  const postsWithComments = await Promise.all(
    posts.map(async (post) => {
      const comments = await getBlogCommentsWithReactions(post.id);
      return {
        ...post,
        commentCount: comments.length,
      };
    })
  );

  if (postsWithComments.length === 0) {
    return <p className="text-center text-subtext0 py-8">No blog posts yet.</p>;
  }

  return (
    <>
      <BlogList posts={postsWithComments} isUserAdmin={adminStatus} />

      {/* Pagination */}
      <div className="mt-12 flex justify-center">
        <BlogPagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </>
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
