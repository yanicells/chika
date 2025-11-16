"use client";

import { useState, useRef } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import Button from "./button";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

/**
 * Image Upload Component
 * Allows users to upload images via Uploadthing
 * Shows preview and allows removal
 */
export default function ImageUpload({
  value,
  onChange,
  disabled,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (files) => {
      if (files && files[0]) {
        onChange(files[0].url);
        setIsUploading(false);
        setError(null);
      }
    },
    onUploadError: (err) => {
      setError(err.message);
      setIsUploading(false);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Validate file size (4MB)
    if (file.size > 4 * 1024 * 1024) {
      setError("Image must be less than 4MB");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      await startUpload([file]);
    } catch (err) {
      setError("Upload failed. Please try again.");
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text">
        Image (optional)
      </label>

      {/* Image Preview */}
      {value && (
        <div className="relative w-full max-w-md">
          <img
            src={value}
            alt="Upload preview"
            className="w-full h-48 object-cover rounded-lg border-2 border-overlay0"
          />
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleRemove}
            disabled={disabled || isUploading}
            className="absolute top-2 right-2"
          >
            Remove
          </Button>
        </div>
      )}

      {/* Upload Button */}
      {!value && (
        <div className="flex items-center gap-3 p-4 border-2 border-dashed border-overlay0 rounded-lg hover:border-subtext0 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled || isUploading}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="flex-1">
            <Button
              type="button"
              variant="secondary"
              disabled={disabled || isUploading}
              isLoading={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? "Uploading..." : "Upload Image"}
            </Button>
          </label>
          <span className="text-sm text-subtext0">Max 4MB, JPG/PNG/GIF</span>
        </div>
      )}

      {/* Error Message */}
      {error && <div className="text-sm text-red">{error}</div>}
    </div>
  );
}
