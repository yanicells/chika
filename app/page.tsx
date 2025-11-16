import { getPublicNotes } from "@/lib/queries/notes";
import NoteList from "@/components/notes/note-list";
import Container from "@/components/shared/container";
import BlogList from "@/components/blog/blog-list";
import { getPublishedBlogPosts } from "@/lib/queries/blog";

export default async function HomePage() {
  const notes = await getPublicNotes();
  const blogs = await getPublishedBlogPosts();

  return (
    <Container>
      <h1 className="mt-16">Recent Notes</h1>
      <NoteList notes={notes} />
      <h1 className="mt-16">Recent Blog Posts</h1>
      <BlogList posts={blogs} />
    </Container>
  );
}
