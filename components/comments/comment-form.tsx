"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  createNoteComment,
  createBlogComment,
} from "@/lib/actions/comments-actions";
import ImageUpload from "../ui/image-upload";
import CatppuccinColorPicker from "../ui/catppuccin-color-picker";

interface CommentFormProps {
  noteId?: string;
  blogPostId?: string;
}

export default function CommentForm({ noteId, blogPostId }: CommentFormProps) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    userName: "",
    content: "",
    imageUrl: "",
    color: "#89b4fa",
    isPrivate: false,
  });

  if (!noteId && !blogPostId) {
    return (
      <Card>
        <p className="text-red">
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
          color: "#89b4fa",
          isPrivate: false,
        });
        setIsExpanded(false);
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
    <div className="mt-6">
      {/* Toggle Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full flex items-center justify-between px-4 py-3 bg-surface0 hover:bg-surface1 border border-overlay0 rounded-lg transition-colors"
        >
          <span className="text-text font-medium">💬 Add Comment</span>
          <svg
            className="w-5 h-5 text-subtext1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      )}

      {/* Comment Form - Only shown when expanded */}
      {isExpanded && (
        <div className="bg-surface0 border border-overlay0 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text">Add Comment</h3>
            <button
              onClick={() => {
                setIsExpanded(false);
                setError(null);
                setSuccess(false);
              }}
              className="text-subtext1 hover:text-text transition-colors"
              aria-label="Close form"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

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
              placeholder="Write your comment here... (markdown supported)"
              rows={4}
              required
            />

            <div className="flex items-center gap-3 p-4 bg-surface0 border border-overlay0 rounded-lg">
              <Checkbox
                id="isPrivate"
                checked={formData.isPrivate}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isPrivate: checked === true })
                }
              />
              <label
                htmlFor="isPrivate"
                className="text-sm font-medium text-text cursor-pointer"
              >
                Send privately (only I can see this)
              </label>
            </div>

            <ImageUpload
              value={formData.imageUrl}
              onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              disabled={isLoading}
            />

            <CatppuccinColorPicker
              value={formData.color}
              onChange={(color) => setFormData({ ...formData, color })}
            />

            {error && (
              <div className="p-3 bg-red/10 border border-red rounded-md">
                <p className="text-sm text-red">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green/10 border border-green rounded-md">
                <p className="text-sm text-green">
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
        </div>
      )}
    </div>
  );
}
