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
import CatppuccinColorPicker from "../ui/catppuccin-color-picker";

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
    color: "#89b4fa",
    isPublished: false,
  });

  useEffect(() => {
    if (mode === "edit" && post) {
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt || "",
        coverImageUrl: post.coverImageUrl || "",
        color: post.color || "#89b4fa",
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
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Input
            label="Title *"
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
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

          <CatppuccinColorPicker
            value={formData.color}
            onChange={(color) => setFormData({ ...formData, color })}
          />

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublished"
              checked={formData.isPublished}
              onChange={(e) =>
                setFormData({ ...formData, isPublished: e.target.checked })
              }
              className="h-4 w-4 accent-blue rounded"
            />
            <label htmlFor="isPublished" className="ml-2 text-sm text-text">
              Publish this post
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-red/10 text-red border border-red rounded-lg p-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green/10 text-green border border-green rounded-lg p-4">
            Blog post {mode === "create" ? "created" : "updated"} successfully!
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-6 border-t border-overlay0">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
          >
            {mode === "create" ? "Create Post" : "Update Post"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
