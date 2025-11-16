import { requireAdmin } from "@/lib/auth-helper";
import { getAllBlogPosts } from "@/lib/queries/blog";
import BlogList from "@/components/blog/blog-list";
import Link from "next/link";
import Button from "@/components/ui/button";
import Container from "@/components/shared/container";

export default async function ManageBlogPage() {
  await requireAdmin();
  const posts = await getAllBlogPosts(); 

  return (
    <Container>
      <div className="flex justify-between">
        <h1>Manage Blog</h1>
        <Link href="/admin/blog/create">
          <Button>Create Post</Button>
        </Link>
      </div>
      <BlogList posts={posts} isUserAdmin={true} />
    </Container>
  );
}
