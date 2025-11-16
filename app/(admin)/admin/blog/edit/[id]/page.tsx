import { requireAdmin } from "@/lib/auth-helper";
import { getBlogPostById } from "@/lib/queries/blog";
import { notFound } from "next/navigation";
import EditBlogForm from "@/components/blog/edit-blog-form";

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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Edit Blog Post</h1>
      <EditBlogForm post={post} />
    </div>
  );
}
