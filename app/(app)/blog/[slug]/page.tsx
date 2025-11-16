interface PageProps {
  params: Promise<{ title: string }>;
}

const BlogPostPage = async ({ params }: PageProps) => {
  const { title } = await params;
  return <div>Blog Post Page - {title}</div>;
};

export default BlogPostPage;