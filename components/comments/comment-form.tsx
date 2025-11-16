"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import {
  createNoteComment,
  createBlogComment,
} from "@/lib/actions/comments-actions";
import ImageUpload from "../ui/image-upload";

interface CommentFormProps {
  noteId?: string;
  blogPostId?: string;
}

export default function CommentForm({ noteId, blogPostId }: CommentFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    content: "",
    imageUrl: "",
    color: "#ffffff",
    isPrivate: false,
  });

  if (!noteId && !blogPostId) {
    return (
      <Card>
        <p className="text-red-600">
          Error: Either noteId or blogPostId is required
        </p>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    if (!formData.content.trim()) {
      setError("Content is required");
      setIsLoading(false);
      return;
    }

    try {
      const result = noteId
        ? await createNoteComment({
            noteId,
            content: formData.content,
            userName: formData.userName || undefined,
            imageUrl: formData.imageUrl || undefined,
            color: formData.color,
            isPrivate: formData.isPrivate,
          })
        : await createBlogComment({
            blogPostId: blogPostId!,
            content: formData.content,
            userName: formData.userName || undefined,
            imageUrl: formData.imageUrl || undefined,
            color: formData.color,
            isPrivate: formData.isPrivate,
          });

      if (result.success) {
        setSuccess(true);
        setFormData({
          userName: "",
          content: "",
          imageUrl: "",
          color: "#ffffff",
          isPrivate: false,
        });
        router.refresh();
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      } else {
        setError(result.error || "Failed to create comment");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Comment form error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Add a Comment
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Your Name (optional)"
          type="text"
          value={formData.userName}
          onChange={(e) =>
            setFormData({ ...formData, userName: e.target.value })
          }
          placeholder="Anonymous"
        />

        <Textarea
          label="Comment *"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
          placeholder="Write your comment here..."
          rows={4}
          required
        />

        <ImageUpload
          value={formData.imageUrl}
          onChange={(url) => setFormData({ ...formData, imageUrl: url })}
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
            id="isPrivate"
            checked={formData.isPrivate}
            onChange={(e) =>
              setFormData({ ...formData, isPrivate: e.target.checked })
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPrivate" className="ml-2 text-sm text-gray-700">
            Make this comment private (admin only)
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
              Comment added successfully!
            </p>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          className="w-full"
        >
          Post Comment
        </Button>
      </form>
    </Card>
  );
}
