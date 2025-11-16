import { getBlogPostWithReactions } from "@/lib/queries/blog";
import { getBlogCommentsWithReactions } from "@/lib/queries/comments";
import BlogDetail from "@/components/blog/blog-detail";
import CommentList from "@/components/comments/comment-list";
import CommentForm from "@/components/comments/comment-form";
import { notFound } from "next/navigation";
import Container from "@/components/shared/container";
import { isAdmin } from "@/lib/auth-helper";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostWithReactions(slug);
  const adminStatus = await isAdmin();

  if (!post) {
    notFound();
  }

  const comments = await getBlogCommentsWithReactions(post.id);

  return (
    <div className="max-w-[85rem] mx-auto px-4 lg:px-8">
      <div className="pt-12 pb-8">
        {/* Blog Post Detail */}
        <BlogDetail post={post} isUserAdmin={adminStatus} />

        {/* Comments Section - More spacing */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-text mb-6">
            💬 Comments ({comments.length})
          </h2>

          <div className="space-y-6">
            <CommentList comments={comments} isUserAdmin={adminStatus} />
            <CommentForm blogPostId={post.id} />
          </div>
        </div>
      </div>

      {/* Bottom Spacing */}
      <div className="pb-32" />
    </div>
  );
}
