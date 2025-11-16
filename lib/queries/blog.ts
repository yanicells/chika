// lib/queries/blog.ts
import { db } from "../../db/drizzle";
import { blogPosts, reactions } from "../../db/schema";
import { eq, and, desc, sql } from "drizzle-orm";

/**
 * Get all published blog posts (public)
 * Ordered by pinned first, then newest
 */
export async function getPublishedBlogPosts() {
  return await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.isDeleted, false), eq(blogPosts.isPublished, true)))
    .orderBy(desc(blogPosts.isPinned), desc(blogPosts.publishedAt));
}

/**
 * Get all blog posts including drafts (admin only)
 */
export async function getAllBlogPosts() {
  return await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.isDeleted, false))
    .orderBy(desc(blogPosts.isPinned), desc(blogPosts.createdAt));
}

/**
 * Get blog post by slug
 */
export async function getBlogPostBySlug(slug: string) {
  const result = await db
    .select()
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.slug, slug),
        eq(blogPosts.isDeleted, false),
        eq(blogPosts.isPublished, true)
      )
    )
    .limit(1);

  return result[0] || null;
}

/**
 * Get blog post by ID (admin can view drafts)
 */
export async function getBlogPostById(id: string) {
  const result = await db
    .select()
    .from(blogPosts)
    .where(and(eq(blogPosts.id, id), eq(blogPosts.isDeleted, false)))
    .limit(1);

  return result[0] || null;
}

/**
 * Get blog post with reaction count
 */
export async function getBlogPostWithReactions(slug: string) {
  const post = await getBlogPostBySlug(slug);
  if (!post) return null;

  const reactionCounts = await db
    .select({
      regularCount: sql<number>`count(*) filter (where ${reactions.isAdmin} = false)`,
      adminCount: sql<number>`count(*) filter (where ${reactions.isAdmin} = true)`,
    })
    .from(reactions)
    .where(eq(reactions.blogPostId, post.id));

  return {
    ...post,
    reactions: {
      regular: Number(reactionCounts[0]?.regularCount || 0),
      admin: Number(reactionCounts[0]?.adminCount || 0),
    },
  };
}

/**
 * Get pinned blog posts only
 */
export async function getPinnedBlogPosts() {
  return await db
    .select()
    .from(blogPosts)
    .where(
      and(
        eq(blogPosts.isDeleted, false),
        eq(blogPosts.isPublished, true),
        eq(blogPosts.isPinned, true)
      )
    )
    .orderBy(desc(blogPosts.publishedAt));
}

/**
 * Get draft blog posts (admin only)
 */
export async function getDraftBlogPosts() {
  return await db
    .select()
    .from(blogPosts)
    .where(
      and(eq(blogPosts.isDeleted, false), eq(blogPosts.isPublished, false))
    )
    .orderBy(desc(blogPosts.createdAt));
}

/**
 * Check if slug exists (for validation)
 */
export async function slugExists(slug: string, excludeId?: string) {
  const result = await db
    .select({ id: blogPosts.id })
    .from(blogPosts)
    .where(
      excludeId
        ? and(eq(blogPosts.slug, slug), sql`${blogPosts.id} != ${excludeId}`)
        : eq(blogPosts.slug, slug)
    )
    .limit(1);

  return result.length > 0;
}
