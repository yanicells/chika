"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButtonExtended() {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="md"
      className="mb-4 px-4 pb-2 text-subtext1 hover:bg-surface0 hover:text-text focus:ring-overlay0 hover:underline"
      onClick={() => router.back()}
      aria-label="Go back to the previous page"
    >
      <ArrowLeft className="h-5 w-5 mr-1" />
      Back
    </Button>
  );
}
