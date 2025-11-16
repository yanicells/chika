import { requireAdmin } from "@/lib/auth-helper";
import { getAllBlogPosts } from "@/lib/queries/blog";
import BlogList from "@/components/blog/blog-list";
import Link from "next/link";
import Button from "@/components/ui/button";
import Container from "@/components/shared/container";

export default async function ManageBlogPage() {
  await requireAdmin();
  const allPosts = await getAllBlogPosts();
  const publishedPosts = allPosts.filter((p) => p.isPublished);
  const draftPosts = allPosts.filter((p) => !p.isPublished);

  return (
    <Container>
      <div className="py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text mb-2">Manage Blog</h1>
            <p className="text-subtext1">Create and manage blog posts</p>
          </div>
          <Link href="/admin/blog/create">
            <Button variant="primary">+ New Post</Button>
          </Link>
        </div>

        {/* Drafts Section */}
        {draftPosts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-text mb-4">
              Drafts ({draftPosts.length})
            </h2>
            <BlogList posts={draftPosts} isUserAdmin={true} />
          </div>
        )}

        {/* Published Section */}
        <div>
          <h2 className="text-xl font-bold text-text mb-4">
            Published ({publishedPosts.length})
          </h2>
          <BlogList posts={publishedPosts} isUserAdmin={true} />
        </div>
      </div>
    </Container>
  );
}
