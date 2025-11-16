import { BlogPost } from '@/db/schema';
import BlogCard from './blog-card';

interface BlogListProps {
  posts: BlogPost[];
  isUserAdmin?: boolean;
}

export default function BlogList({
  posts,
  isUserAdmin = false,
}: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">No blog posts yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogCard key={post.id} post={post} isUserAdmin={isUserAdmin} />
      ))}
    </div>
  );
}

