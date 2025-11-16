import { requireAdmin } from "@/lib/auth-helper";
import { getAllBlogPosts } from "@/lib/queries/blog";
import BlogList from "@/components/blog/blog-list";
import Link from "next/link";
import Button from "@/components/ui/button";

export default async function ManageBlogPage() {
  await requireAdmin();
  const posts = await getAllBlogPosts(); // Includes drafts

  return (
    <div>
      <div className="flex justify-between">
        <h1>Manage Blog</h1>
        <Link href="/admin/blog/create">
          <Button>Create Post</Button>
        </Link>
      </div>
      <BlogList posts={posts} />
    </div>
  );
}
