"use client";

import Link from "next/link";
import Button from "./button";

interface EditButtonProps {
  type: "note" | "blog";
  id: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Edit button that links to admin edit pages
 * Only show this component when user is admin
 */
export default function EditButton({
  type,
  id,
  variant = "secondary",
  size = "sm",
  className,
}: EditButtonProps) {
  const href =
    type === "note" ? `/admin/notes/edit/${id}` : `/admin/blog/edit/${id}`;

  return (
    <Link href={href}>
      <Button variant={variant} size={size} className={className}>
        ✏️ Edit
      </Button>
    </Link>
  );
}
