import { getPublishedBlogPosts } from "@/lib/queries/blog";
import BlogList from "@/components/blog/blog-list";
import Container from "@/components/shared/container";
import { isAdmin } from "@/lib/auth-helper";

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();
  const adminStatus = await isAdmin();

  return (
    <div className="max-w-[85rem] mx-auto px-4 lg:px-8">
      <div className="pt-12 pb-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-text mb-2">My Blog Posts</h1>
          <p className="text-lg text-subtext1">
            Thoughts, learnings, and updates
          </p>
        </div>

        {posts.length > 0 ? (
          <BlogList posts={posts} isUserAdmin={adminStatus} />
        ) : (
          <p className="text-center text-subtext0 py-8">No blog posts yet.</p>
        )}
      </div>

      {/* Bottom Spacing */}
      <div className="pb-32" />
    </div>
  );
}
