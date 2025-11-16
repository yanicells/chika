"use server";

import { db } from "../../db/drizzle";
import { blogPosts } from "../../db/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "../auth-helper";
import { slugExists } from "@/lib/queries/blog";

/**
 * Generate a URL-friendly slug from title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/[\s_-]+/g, "-") // Replace spaces with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Create a new blog post (admin only)
 */
export async function createBlogPost(data: {
  title: string;
  content: string;
  excerpt?: string;
  coverImageUrl?: string;
  isPublished?: boolean;
}) {
  try {
    await requireAdmin();

    const postId = nanoid();
    let slug = generateSlug(data.title);

    // Ensure slug is unique
    let counter = 1;
    while (await slugExists(slug)) {
      slug = `${generateSlug(data.title)}-${counter}`;
      counter++;
    }

    const now = new Date();

    await db.insert(blogPosts).values({
      id: postId,
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt || null,
      coverImageUrl: data.coverImageUrl || null,
      isPublished: data.isPublished || false,
      isPinned: false,
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
      publishedAt: data.isPublished ? now : null,
    });

    revalidatePath("/blog");
    revalidatePath("/admin/blog");

    return { success: true, postId, slug };
  } catch (error) {
    console.error("Create blog post error:", error);
    return { success: false, error: "Failed to create blog post" };
  }
}

/**
 * Update a blog post (admin only)
 */
export async function updateBlogPost(
  postId: string,
  data: {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImageUrl?: string;
    isPublished?: boolean;
  }
) {
  try {
    await requireAdmin();

    const updateData: any = {
      ...data,
      updatedAt: new Date(),
    };

    // If title is being updated, regenerate slug
    if (data.title) {
      let slug = generateSlug(data.title);
      let counter = 1;
      while (await slugExists(slug, postId)) {
        slug = `${generateSlug(data.title)}-${counter}`;
        counter++;
      }
      updateData.slug = slug;
    }

    // If publishing for the first time, set publishedAt
    if (data.isPublished) {
      const post = await db.query.blogPosts.findFirst({
        where: eq(blogPosts.id, postId),
      });
      if (post && !post.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, postId));

    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    revalidatePath(`/blog/${updateData.slug || ""}`);

    return { success: true };
  } catch (error) {
    console.error("Update blog post error:", error);
    return { success: false, error: "Failed to update blog post" };
  }
}

/**
 * Delete a blog post (soft delete, admin only)
 */
export async function deleteBlogPost(postId: string) {
  try {
    await requireAdmin();

    await db
      .update(blogPosts)
      .set({
        isDeleted: true,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, postId));

    revalidatePath("/blog");
    revalidatePath("/admin/blog");

    return { success: true };
  } catch (error) {
    console.error("Delete blog post error:", error);
    return { success: false, error: "Failed to delete blog post" };
  }
}

/**
 * Pin/unpin a blog post (admin only)
 */
export async function togglePinBlogPost(postId: string, isPinned: boolean) {
  try {
    await requireAdmin();

    await db
      .update(blogPosts)
      .set({
        isPinned,
        updatedAt: new Date(),
      })
      .where(eq(blogPosts.id, postId));

    revalidatePath("/blog");
    revalidatePath("/admin/blog");

    return { success: true };
  } catch (error) {
    console.error("Toggle pin blog post error:", error);
    return { success: false, error: "Failed to toggle pin" };
  }
}

/**
 * Publish/unpublish a blog post (admin only)
 */
export async function togglePublishBlogPost(
  postId: string,
  isPublished: boolean
) {
  try {
    await requireAdmin();

    const updateData: any = {
      isPublished,
      updatedAt: new Date(),
    };

    // Set publishedAt when publishing for the first time
    if (isPublished) {
      const post = await db.query.blogPosts.findFirst({
        where: eq(blogPosts.id, postId),
      });
      if (post && !post.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    await db.update(blogPosts).set(updateData).where(eq(blogPosts.id, postId));

    revalidatePath("/blog");
    revalidatePath("/admin/blog");

    return { success: true };
  } catch (error) {
    console.error("Toggle publish blog post error:", error);
    return { success: false, error: "Failed to toggle publish" };
  }
}
