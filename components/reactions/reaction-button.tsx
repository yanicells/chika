"use client";

import { useState } from "react";
import {
  addNoteReaction,
  removeNoteReaction,
  addCommentReaction,
  removeCommentReaction,
  addBlogPostReaction,
  removeBlogPostReaction,
} from "@/lib/actions/reactions-actions";

interface ReactionButtonProps {
  type: "note" | "comment" | "blogPost";
  id: string;
  initialCount: {
    regular: number;
    admin: number;
  };
  color: string; // Hex color from the card
  isAdmin?: boolean; // Is CURRENT USER admin?
  hasReacted?: boolean; // Initial reaction state
}

export default function ReactionButton({
  type,
  id,
  initialCount,
  color,
  isAdmin = false,
  hasReacted: initialHasReacted = false,
}: ReactionButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [hasReacted, setHasReacted] = useState(initialHasReacted);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const totalCount = count.regular + count.admin;

  const handleClick = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setIsAnimating(true);

    // Optimistic update
    if (hasReacted) {
      // Remove reaction
      setCount((prev) => ({
        regular: isAdmin ? prev.regular : prev.regular - 1,
        admin: isAdmin ? prev.admin - 1 : prev.admin,
      }));
      setHasReacted(false);

      // Call API
      if (type === "note") {
        await removeNoteReaction(id);
      } else if (type === "comment") {
        await removeCommentReaction(id);
      } else {
        await removeBlogPostReaction(id);
      }
    } else {
      // Add reaction
      setCount((prev) => ({
        regular: isAdmin ? prev.regular : prev.regular + 1,
        admin: isAdmin ? prev.admin + 1 : prev.admin,
      }));
      setHasReacted(true);

      // Call API
      if (type === "note") {
        await addNoteReaction(id);
      } else if (type === "comment") {
        await addCommentReaction(id);
      } else {
        await addBlogPostReaction(id);
      }
    }

    setIsLoading(false);
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Icon color: card color when reacted, gray when not
  const iconColor = hasReacted ? color : "#9da0b0";

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="flex items-center gap-2 group transition-all duration-200"
      aria-label={hasReacted ? "Remove reaction" : "Add reaction"}
    >
      {/* Icon Container */}
      <div className="relative">
        {isAdmin ? (
          // ADMIN SEES: Star (always star for admin user)
          <svg
            className={`w-5 h-5 transition-all duration-300 ${
              isAnimating ? "animate-bounce scale-125" : ""
            } ${hasReacted ? "scale-110" : "scale-100 group-hover:scale-110"}`}
            fill={iconColor}
            viewBox="0 0 24 24"
            stroke={iconColor}
            strokeWidth="1"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ) : (
          // REGULAR USER SEES: Heart (always heart for regular users)
          <svg
            className={`w-5 h-5 transition-all duration-300 ${
              isAnimating ? "animate-bounce scale-125" : ""
            } ${hasReacted ? "scale-110" : "scale-100 group-hover:scale-110"}`}
            fill={hasReacted ? iconColor : "none"}
            viewBox="0 0 24 24"
            stroke={iconColor}
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            />
          </svg>
        )}

        {/* Ping animation overlay */}
        {isAnimating && (
          <div className="absolute inset-0 flex items-center justify-center">
            {isAdmin ? (
              <svg
                className="w-5 h-5 animate-ping opacity-75"
                fill={color}
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ) : (
              <svg
                className="w-5 h-5 animate-ping opacity-75"
                fill={color}
                viewBox="0 0 24 24"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Count - total reactions */}
      {totalCount > 0 && (
        <span className="text-sm font-medium text-subtext1 tabular-nums">
          {totalCount}
        </span>
      )}

      {/* Blue star indicator - ONLY shown to regular users if admin has reacted */}
      {!isAdmin && count.admin > 0 && (
        <svg className="w-3 h-3" fill="#89b4fa" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      )}
    </button>
  );
}
