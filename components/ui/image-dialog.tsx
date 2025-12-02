"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageDialogProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * Clickable image that opens in fullscreen dialog
 * Used for note/blog/comment images in detail pages
 */
export default function ImageDialog({ src, alt, className }: ImageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Thumbnail - clickable */}
      <div
        className={`relative cursor-pointer ${className || ""}`}
        onClick={() => setIsOpen(true)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="hover:opacity-90 transition-opacity object-cover"
        />
      </div>

      {/* Fullscreen Dialog */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
          onClick={() => setIsOpen(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-subtext0 transition-colors bg-black bg-opacity-50 rounded-full p-2 z-10"
              aria-label="Close fullscreen image"
            >
              <svg
                className="w-6 h-6"
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

            {/* Full-size image */}
            <div
              className="relative w-[90vw] h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
