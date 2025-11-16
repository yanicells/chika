import { requireAdmin } from "@/lib/auth-helper";
import { getBlogPostById } from "@/lib/queries/blog";
import { notFound } from "next/navigation";
import EditBlogForm from "@/components/blog/edit-blog-form";
import Container from "@/components/shared/container";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const post = await getBlogPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-3xl font-bold text-text mb-2">Edit Blog Post</h1>
        <p className="text-subtext1 mb-8">
          Update the content and settings for this post
        </p>

        <EditBlogForm post={post} />
      </div>
    </Container>
  );
}
