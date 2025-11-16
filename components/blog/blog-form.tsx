"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BlogPost } from "@/db/schema";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { createBlogPost, updateBlogPost } from "@/lib/actions/blog-actions";
import ImageUpload from "../ui/image-upload";

interface BlogFormProps {
  mode: "create" | "edit";
  post?: BlogPost;
}

export default function BlogForm({ mode, post }: BlogFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    coverImageUrl: "",
    color: "#ffffff",
    isPublished: false,
  });

  useEffect(() => {
    if (mode === "edit" && post) {
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || "",
        coverImageUrl: post.coverImageUrl || "",
        color: post.color || "#ffffff",
        isPublished: post.isPublished,
      });
    }
  }, [mode, post]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    if (!formData.title.trim()) {
      setError("Title is required");
      setIsLoading(false);
      return;
    }

    if (!formData.content.trim()) {
      setError("Content is required");
      setIsLoading(false);
      return;
    }

    try {
      const result =
        mode === "create"
          ? await createBlogPost({
              title: formData.title,
              content: formData.content,
              excerpt: formData.excerpt || undefined,
              coverImageUrl: formData.coverImageUrl || undefined,
              color: formData.color,
              isPublished: formData.isPublished,
            })
          : await updateBlogPost(post!.id, {
              title: formData.title,
              content: formData.content,
              excerpt: formData.excerpt || undefined,
              coverImageUrl: formData.coverImageUrl || undefined,
              color: formData.color,
              isPublished: formData.isPublished,
            });

      if (result.success) {
        setSuccess(true);
        router.refresh();
        if (mode === "create") {
          router.push("/admin/blog");
        }
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError(result.error || `Failed to ${mode} blog post`);
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Blog form error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {mode === "create" ? "Create New Blog Post" : "Edit Blog Post"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title *"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter blog post title..."
          required
        />

        <Textarea
          label="Excerpt (optional)"
          value={formData.excerpt}
          onChange={(e) =>
            setFormData({ ...formData, excerpt: e.target.value })
          }
          placeholder="Brief summary of the post..."
          rows={3}
        />

        <Textarea
          label="Content *"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          placeholder="Write your blog post here..."
          rows={12}
          required
        />

        <ImageUpload
          value={formData.coverImageUrl}
          onChange={(url) => setFormData({ ...formData, coverImageUrl: url })}
          disabled={isLoading}
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

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublished"
            checked={formData.isPublished}
            onChange={(e) =>
              setFormData({ ...formData, isPublished: e.target.checked })
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublished" className="ml-2 text-sm text-gray-700">
            Publish this post
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">
              Blog post {mode === "create" ? "created" : "updated"}{" "}
              successfully!
            </p>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="flex-1"
          >
            {mode === "create" ? "Create Post" : "Update Post"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
