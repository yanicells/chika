import { db } from "../../db/drizzle";
import { blogPosts, reactions } from "../../db/schema";
import { eq, and, desc, sql, count } from "drizzle-orm";
import { withCache } from "@/lib/cache";

/**
 * Get all published blog posts (public)
 * Ordered by pinned first, then newest
 */
export const getPublishedBlogPosts = withCache(
  async () => {
    const posts = await db
      .select()
      .from(blogPosts)
      .where(
        and(eq(blogPosts.isDeleted, false), eq(blogPosts.isPublished, true))
      )
      .orderBy(desc(blogPosts.isPinned), desc(blogPosts.publishedAt));

    // Use helper function to get reactions for each post
    const postsWithReactions = await Promise.all(
      posts.map((post) => getBlogPostWithReactionsById(post.id))
    );

    return postsWithReactions.filter((post) => post !== null);
  },
  ["getPublishedBlogPosts"],
  { tags: ["blogs"] }
);

/**
 * Get all blog posts including drafts (admin only)
 */
export const getAllBlogPosts = withCache(
  async () => {
    return await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.isDeleted, false))
      .orderBy(desc(blogPosts.isPinned), desc(blogPosts.createdAt));
  },
  ["getAllBlogPosts"],
  { tags: ["blogs"] }
);

/**
 * Get blog post by slug
 */
export const getBlogPostBySlug = withCache(
  async (slug: string) => {
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
  },
  ["getBlogPostBySlug"],
  { tags: ["blogs"] }
);

/**
 * Get blog post by ID (admin can view drafts)
 */
export const getBlogPostById = withCache(
  async (id: string) => {
    const result = await db
      .select()
      .from(blogPosts)
      .where(and(eq(blogPosts.id, id), eq(blogPosts.isDeleted, false)))
      .limit(1);

    return result[0] || null;
  },
  ["getBlogPostById"],
  { tags: ["blogs"] }
);

/**
 * Get blog post with reactions by ID
 */
const getBlogPostWithReactionsById = withCache(
  async (id: string) => {
    const post = await getBlogPostById(id);
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
  },
  ["getBlogPostWithReactionsById"],
  { tags: ["blogs"] }
);

/**
 * Get blog post with reaction count
 */
export const getBlogPostWithReactions = withCache(
  async (slug: string) => {
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
  },
  ["getBlogPostWithReactions"],
  { tags: ["blogs"] }
);

/**
 * Get pinned blog posts only
 */
export const getPinnedBlogPosts = withCache(
  async () => {
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
  },
  ["getPinnedBlogPosts"],
  { tags: ["blogs"] }
);

/**
 * Get draft blog posts (admin only)
 */
export const getDraftBlogPosts = withCache(
  async () => {
    return await db
      .select()
      .from(blogPosts)
      .where(
        and(eq(blogPosts.isDeleted, false), eq(blogPosts.isPublished, false))
      )
      .orderBy(desc(blogPosts.createdAt));
  },
  ["getDraftBlogPosts"],
  { tags: ["blogs"] }
);

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

/**
 * Get published blog posts with pagination
 */
export const getPublishedBlogPostsPaginated = withCache(
  async (page: number = 1, limit: number = 6) => {
    const offset = (page - 1) * limit;

    const postsList = await db
      .select()
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.isDeleted, false),
          eq(blogPosts.isPublished, true)
        )
      )
      .orderBy(desc(blogPosts.isPinned), desc(blogPosts.publishedAt))
      .limit(limit)
      .offset(offset);

    // Get reactions for each post
    const postsWithReactions = await Promise.all(
      postsList.map((post) => getBlogPostWithReactionsById(post.id))
    );

    const filteredPosts = postsWithReactions.filter((post) => post !== null);

    // Get total count
    const totalResult = await db
      .select({ count: count() })
      .from(blogPosts)
      .where(
        and(
          eq(blogPosts.isDeleted, false),
          eq(blogPosts.isPublished, true)
        )
      );

    const total = totalResult[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    return {
      posts: filteredPosts,
      currentPage: page,
      totalPages,
      total,
    };
  },
  ["getPublishedBlogPostsPaginated"],
  { tags: ["blogs"] }
);
