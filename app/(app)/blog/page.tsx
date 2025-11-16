import { getPublishedBlogPosts } from "@/lib/queries/blog";
import BlogList from "@/components/blog/blog-list";

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <div>
      <h1>Blog</h1>
      <BlogList posts={posts} />
    </div>
  );
}
