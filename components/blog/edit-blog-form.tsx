"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  updateBlogPost,
  deleteBlogPost,
  togglePinBlogPost,
  togglePublishBlogPost,
} from "@/lib/actions/blog-actions";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Card from "@/components/ui/card";
import type { BlogPost } from "@/db/schema";

interface EditBlogFormProps {
  post: BlogPost;
}

export default function EditBlogForm({ post }: EditBlogFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: post.title,
    content: post.content,
    excerpt: post.excerpt || "",
    coverImageUrl: post.coverImageUrl || "",
    color: post.color || "#ffffff",
    isPublished: post.isPublished,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const result = await updateBlogPost(post.id, {
      title: formData.title,
      content: formData.content,
      excerpt: formData.excerpt || undefined,
      coverImageUrl: formData.coverImageUrl || undefined,
      color: formData.color,
      isPublished: formData.isPublished,
    });

    setIsLoading(false);

    if (result.success) {
      setSuccess("Blog post updated successfully!");
      setTimeout(() => router.push("/admin/blog"), 1500);
    } else {
      setError(result.error || "Failed to update blog post");
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this blog post? This cannot be undone."
      )
    ) {
      return;
    }

    setIsLoading(true);
    const result = await deleteBlogPost(post.id);
    setIsLoading(false);

    if (result.success) {
      router.push("/admin/blog");
    } else {
      setError(result.error || "Failed to delete blog post");
    }
  };

  const handleTogglePin = async () => {
    setIsLoading(true);
    const result = await togglePinBlogPost(post.id, !post.isPinned);
    setIsLoading(false);

    if (result.success) {
      router.refresh();
    } else {
      setError(result.error || "Failed to toggle pin");
    }
  };

  const handleTogglePublish = async () => {
    setIsLoading(true);
    const result = await togglePublishBlogPost(post.id, !post.isPublished);
    setIsLoading(false);

    if (result.success) {
      setFormData({ ...formData, isPublished: !post.isPublished });
      router.refresh();
    } else {
      setError(result.error || "Failed to toggle publish");
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md">{error}</div>
        )}

        {success && (
          <div className="bg-green-50 text-green-600 p-3 rounded-md">
            {success}
          </div>
        )}

        <Input
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter blog title..."
          required
        />

        <Textarea
          label="Content"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          placeholder="Enter blog content (markdown supported)..."
          required
          rows={12}
        />

        <Textarea
          label="Excerpt (optional)"
          value={formData.excerpt}
          onChange={(e) =>
            setFormData({ ...formData, excerpt: e.target.value })
          }
          placeholder="Short summary for preview..."
          rows={3}
        />

        <Input
          label="Cover Image URL (optional)"
          value={formData.coverImageUrl}
          onChange={(e) =>
            setFormData({ ...formData, coverImageUrl: e.target.value })
          }
          placeholder="https://..."
        />

        <div>
          <label
            htmlFor="color"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Background Color
          </label>
          <input
            type="color"
            id="color"
            value={formData.color}
            onChange={(e) =>
              setFormData({ ...formData, color: e.target.value })
            }
            className="h-10 w-20 rounded border border-gray-300 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isPublished"
            type="checkbox"
            checked={formData.isPublished}
            onChange={(e) =>
              setFormData({ ...formData, isPublished: e.target.checked })
            }
            className="w-4 h-4 rounded"
          />
          <label htmlFor="isPublished" className="text-sm font-medium">
            Published (visible to public)
          </label>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            isLoading={isLoading}
          >
            Save Changes
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={handleTogglePin}
            disabled={isLoading}
          >
            {post.isPinned ? "Unpin" : "Pin"} Post
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={handleTogglePublish}
            disabled={isLoading}
          >
            {post.isPublished ? "Unpublish" : "Publish"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <div className="flex-1" />

          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={isLoading}
          >
            Delete Post
          </Button>
        </div>
      </form>
    </Card>
  );
}
