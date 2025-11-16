import Link from 'next/link';
import { BlogPost } from '@/db/schema';
import Card from '@/components/ui/card';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import EditButton from "@/components/ui/edit-button";

interface BlogCardProps {
  post: BlogPost;
  isUserAdmin?: boolean;
}

export default function BlogCard({ post, isUserAdmin = false }: BlogCardProps) {
  const excerpt = post.excerpt || post.content.substring(0, 150);
  const truncatedExcerpt =
    excerpt.length > 150 ? `${excerpt.substring(0, 150)}...` : excerpt;

  return (
    <Card className="h-full flex flex-col">
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

        {post.coverImageUrl && (
          <div className="mb-4">
            <img
              src={post.coverImageUrl}
              alt={post.title}
              className="w-full h-48 object-cover rounded-md"
            />
          </div>
        )}

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {post.title}
        </h3>

        <p className="text-gray-700 mb-4 line-clamp-3">{truncatedExcerpt}</p>

        <div className="text-sm text-gray-600">
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString()
            : new Date(post.createdAt).toLocaleDateString()}
        </div>
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

