import { requireAdmin } from '@/lib/auth-helper';
import { getBlogPostById } from '@/lib/queries/blog';
import BlogForm from '@/components/blog/blog-form';
import { notFound } from 'next/navigation';

export default async function EditBlogPage({ params }: { params: { id: string } }) {
  await requireAdmin();
  const post = await getBlogPostById(params.id);
  
  if (!post) {
    notFound();
  }
  
  return (
    <div>
      <h1>Edit Blog Post</h1>
      <BlogForm mode="edit" post={post} />
    </div>
  );
}
