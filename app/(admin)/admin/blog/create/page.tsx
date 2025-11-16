import { requireAdmin } from "@/lib/auth-helper";
import BlogForm from "@/components/blog/blog-form";

export default async function CreateBlogPage() {
  await requireAdmin();

  return (
    <div>
      <h1>Create Blog Post</h1>
      <BlogForm mode="create" />
    </div>
  );
}
