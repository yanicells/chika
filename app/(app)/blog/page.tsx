import Container from '@/components/shared/container';
import { getPublishedBlogPostsPaginated } from '@/lib/queries/blog';
import BlogList from '@/components/blog/blog-list';
import BlogPagination from '@/components/blog/blog-pagination';
import { isAdmin } from '@/lib/auth-helper';

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page } = await searchParams;
  const currentPage = Number(page) || 1;

  const { posts, totalPages } = await getPublishedBlogPostsPaginated(currentPage, 6);
  const adminStatus = await isAdmin();

  return (
    <Container>
      <div className="pt-12 pb-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text mb-2">My Blog Posts</h1>
          <p className="text-lg text-subtext1">Thoughts, learnings, and updates</p>
        </div>

        {/* Blog Grid */}
        {posts.length > 0 ? (
          <>
            <BlogList posts={posts} isUserAdmin={adminStatus} />
            
            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <BlogPagination currentPage={currentPage} totalPages={totalPages} />
            </div>
          </>
        ) : (
          <p className="text-center text-subtext0 py-8">No blog posts yet.</p>
        )}
      </div>
    </Container>
  );
}
