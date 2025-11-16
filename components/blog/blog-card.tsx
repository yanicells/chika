import Link from "next/link";
import { BlogPost } from "@/db/schema";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import EditButton from "@/components/ui/edit-button";
import ReactionDisplay from "@/components/reactions/reaction-display";
import ReactionButton from "@/components/reactions/reaction-button";

interface BlogCardProps {
  post: BlogPost & {
    reactions?: {
      regular: number;
      admin: number;
    };
  };
  isUserAdmin?: boolean;
}

export default function BlogCard({ post, isUserAdmin = false }: BlogCardProps) {
  const excerpt = post.excerpt || post.content.substring(0, 150);
  const truncatedExcerpt =
    excerpt.length > 150 ? `${excerpt.substring(0, 150)}...` : excerpt;
  const backgroundColor = post.color || "#ffffff";

  return (
    <Card className="h-full flex flex-col" style={{ backgroundColor }}>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
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
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {post.title}
        </h3>

        {post.coverImageUrl && (
          <div className="mb-4">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
        )}

        <p className="text-gray-700 mb-4 line-clamp-3">{truncatedExcerpt}</p>

        <div className="text-sm text-gray-600 mb-3">
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString()
            : new Date(post.createdAt).toLocaleDateString()}
        </div>

        {post.reactions && (
          <div className="flex items-center gap-3 mb-3">
            <ReactionDisplay reactions={post.reactions} />
            <ReactionButton type="blogPost" id={post.id} hasReacted={false} />
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200">
        <Link href={`/blog/${post.slug}`}>
          <Button variant="secondary" size="sm" className="w-full">
            Read More
          </Button>
        </Link>
        <div>{isUserAdmin && <EditButton type="blog" id={post.id} />}</div>
      </div>
    </Card>
  );
}
