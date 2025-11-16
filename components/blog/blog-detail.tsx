import Link from "next/link";
import { BlogPost } from "@/db/schema";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import ReactionDisplay from "@/components/reactions/reaction-display";
import ReactionButton from "@/components/reactions/reaction-button";
import EditButton from "@/components/ui/edit-button";

interface BlogDetailProps {
  post: BlogPost & {
    reactions?: {
      regular: number;
      admin: number;
    };
  };
  isUserAdmin: boolean;
  hasReacted?: boolean;
}

export default function BlogDetail({
  post,
  isUserAdmin = false,
  hasReacted = false,
}: BlogDetailProps) {
  const backgroundColor = post.color || "#ffffff";

  return (
    <Card className="max-w-4xl mx-auto" style={{ backgroundColor }}>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            {post.isPinned && (
              <Badge variant="warning" size="sm">
                📌 Pinned
              </Badge>
            )}
            {!post.isPublished && isUserAdmin && (
              <Badge variant="default" size="sm">
                Draft
              </Badge>
            )}
          </div>
          {isUserAdmin && (
            <Link href={`/admin/blog/edit/${post.id}`}>
              <Button variant="secondary" size="sm">
                Edit
              </Button>
            </Link>
          )}
        </div>

        <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>

        {post.coverImageUrl && (
          <div>
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full max-h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {post.excerpt && (
          <p className="text-xl text-gray-600 italic">{post.excerpt}</p>
        )}

        <div className="prose max-w-none">
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-200">
          <div className="flex flex-col gap-1">
            <span>
              Published:{" "}
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString()
                : "Not published"}
            </span>
            <span>
              Created: {new Date(post.createdAt).toLocaleDateString()}
            </span>
            {post.updatedAt &&
              post.updatedAt.getTime() !== post.createdAt.getTime() && (
                <span>
                  Updated: {new Date(post.updatedAt).toLocaleDateString()}
                </span>
              )}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
          {post.reactions && (
            <>
              <ReactionDisplay reactions={post.reactions} />
              <ReactionButton
                type="blogPost"
                id={post.id}
                hasReacted={hasReacted}
              />
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
