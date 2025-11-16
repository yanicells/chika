import { getPublishedBlogPosts } from "@/lib/queries/blog";
import BlogList from "@/components/blog/blog-list";
import Container from "@/components/shared/container";
import { isAdmin } from "@/lib/auth-helper";

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();
  const adminStatus = await isAdmin();

  return (
    <div className="max-w-[85rem] mx-auto px-4 lg:px-8 my-12">
      <h1>Blog</h1>
      <BlogList posts={posts} isUserAdmin={adminStatus} />

      {/* Bottom Spacing */}
      <div className="pb-32" />
    </div>
  );
}
