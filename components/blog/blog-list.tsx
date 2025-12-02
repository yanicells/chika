import { BlogPost } from "@/db/schema";
import BlogCard from "./blog-card";

interface BlogListProps {
  posts: (BlogPost & {
    reactions?: {
      regular: number;
      admin: number;
    };
    commentCount?: number;
  })[];
  isUserAdmin?: boolean;
}

export default function BlogList({
  posts,
  isUserAdmin = false,
}: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-subtext0 text-lg">
          No blog posts yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-0">
      {posts.map((post) => (
        <div key={post.id} className="break-inside-avoid mb-6">
          <BlogCard post={post} isUserAdmin={isUserAdmin} />
        </div>
      ))}
    </div>
  );
}
