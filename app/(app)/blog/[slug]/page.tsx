import { getBlogPostBySlug } from "@/lib/queries/blog";
import { getBlogCommentsWithReactions } from "@/lib/queries/comments";
import BlogDetail from "@/components/blog/blog-detail";
import CommentList from "@/components/comments/comment-list";
import CommentForm from "@/components/comments/comment-form";
import { notFound } from "next/navigation";

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const comments = await getBlogCommentsWithReactions(post.id);

  return (
    <div>
      <BlogDetail post={post} />

      <h2>Comments</h2>
      <CommentList comments={comments} />
      <CommentForm blogPostId={post.id} />
    </div>
  );
}
