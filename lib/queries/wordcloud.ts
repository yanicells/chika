import { db } from "@/db/drizzle";
import { notes, comments, blogPosts } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Get all text content for word cloud
 * Only includes public, non-deleted content
 */
export async function getAllTextContent() {
  // Get public notes
  const publicNotes = await db
    .select({
      title: notes.title,
      content: notes.content,
    })
    .from(notes)
    .where(eq(notes.isDeleted, false));

  // Get public comments
  const publicComments = await db
    .select({
      content: comments.content,
    })
    .from(comments)
    .where(eq(comments.isDeleted, false));

  // Get published blog posts
  const publishedBlogs = await db
    .select({
      title: blogPosts.title,
      content: blogPosts.content,
      excerpt: blogPosts.excerpt,
    })
    .from(blogPosts)
    .where(eq(blogPosts.isDeleted, false));

  // Combine all text
  const allText: string[] = [];

  // Add notes
  publicNotes.forEach((note) => {
    if (note.title) allText.push(note.title);
    allText.push(note.content);
  });

  // Add comments
  publicComments.forEach((comment) => {
    allText.push(comment.content);
  });

  // Add blog posts
  publishedBlogs.forEach((blog) => {
    allText.push(blog.title);
    allText.push(blog.content);
    if (blog.excerpt) allText.push(blog.excerpt);
  });

  return allText.join(" ");
}
