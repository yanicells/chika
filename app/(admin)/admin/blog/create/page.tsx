import { requireAdmin } from "@/lib/auth-helper";
import BlogForm from "@/components/blog/blog-form";
import Container from "@/components/shared/container";

export default async function CreateBlogPage() {
  await requireAdmin();

  return (
    <Container size="md">
      <div className="py-8">
        <h1 className="text-3xl font-bold text-text mb-2">Create Blog Post</h1>
        <p className="text-subtext1 mb-8">Write and publish a new blog post</p>

        <BlogForm mode="create" />
      </div>
    </Container>
  );
}
