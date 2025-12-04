import { db } from "@/db/drizzle";
import { notes, comments, blogPosts } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { withCache } from "@/lib/cache";

export type WordCloudWord = {
  text: string;
  value: number;
};

const STOP_WORDS = new Set(["anonymous", "admin", "that", "with", "this", "from", "they", "have", "your", "what", "when", "there", "about", "which", "would", "these", "could", "should", "their", "other", "some", "more", "also", "like", "just", "than", "then", "them", "were", "been", "into", "only", "over", "such", "most", "many", "much", "where", "will", "here", "each", "keep"]);

/**
 * Convert large amounts of text into the top 100 word-cloud entries.
 */
function buildWordCloudDataset(textChunks: string[]): WordCloudWord[] {
  const wordCount = new Map<string, number>();

  textChunks
    .join(" ")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // Remove punctuation
    .split(/\s+/)
    .filter((word) => word.length >= 4 && !STOP_WORDS.has(word) && !/^\d+$/.test(word))
    .forEach((word) => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });

  return Array.from(wordCount.entries())
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 100);
}

/**
 * Get all text content for word cloud (public, non-deleted content) and memoize
 * the expensive processing for an hour.
 */
export const getWordCloudData = withCache(
  async () => {
    // Get public notes
    const publicNotes = await db
      .select({
        title: notes.title,
        content: notes.content,
      })
      .from(notes)
      .where(
        and(eq(notes.isDeleted, false), eq(notes.isPrivate, false))
      );

    // Get public comments
    const publicComments = await db
      .select({
        content: comments.content,
      })
      .from(comments)
      .where(and(eq(comments.isDeleted, false), eq(comments.isPrivate, false)));

    // Get published blog posts
    const publishedBlogs = await db
      .select({
        title: blogPosts.title,
        content: blogPosts.content,
        excerpt: blogPosts.excerpt,
      })
      .from(blogPosts)
      .where(
        and(eq(blogPosts.isDeleted, false), eq(blogPosts.isPublished, true))
      );

    const allText: string[] = [];

    publicNotes.forEach((note) => {
      if (note.title) allText.push(note.title);
      if (note.content) allText.push(note.content);
    });

    publicComments.forEach((comment) => {
      if (comment.content) allText.push(comment.content);
    });

    publishedBlogs.forEach((blog) => {
      if (blog.title) allText.push(blog.title);
      if (blog.content) allText.push(blog.content);
      if (blog.excerpt) allText.push(blog.excerpt);
    });

    return buildWordCloudDataset(allText);
  },
  ["getWordCloudData"],
  { tags: ["word-cloud"] }
);
