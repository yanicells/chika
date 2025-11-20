"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/input";
import Textarea from "@/components/ui/textarea";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { createNote } from "@/lib/actions/notes-actions";
import Container from "@/components/shared/container";
import ImageUpload from "../ui/image-upload";
import CatppuccinColorPicker from "../ui/catppuccin-color-picker";
import BackButtonExtended from "../ui/back-button";

export default function NoteForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    userName: "",
    color: "#89b4fa",
    isPrivate: false,
    imageUrl: "",
  });

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
      const result = await createNote({
        title: formData.title || undefined,
        content: formData.content,
        userName: formData.userName || undefined,
        color: formData.color,
        isPrivate: formData.isPrivate,
        imageUrl: formData.imageUrl || undefined,
      });

      if (result.success) {
        setSuccess(true);
        router.push("/notes");
      } else {
        setError(result.error || "Failed to create note");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Note form error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="mt-12 mb-16">
      <BackButtonExtended />
      <Card>
        <h2 className="text-2xl font-bold text-text mb-4">Create New Note</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title (optional)"
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Give your note a title"
          />

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
            label="Content *"
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            placeholder="Write your note here... (markdown supported)"
            rows={6}
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

          <CatppuccinColorPicker
            value={formData.color}
            onChange={(color) => setFormData({ ...formData, color })}
          />

          <ImageUpload
            value={formData.imageUrl}
            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
            disabled={isLoading}
          />

          {error && (
            <div className="p-3 bg-red/20 border border-red rounded-md">
              <p className="text-sm text-red">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green/20 border border-green rounded-md">
              <p className="text-sm text-green">Note created successfully!</p>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full"
          >
            Create Note
          </Button>
        </form>
      </Card>
    </Container>
  );
}
