"use client";

import Link from "next/link";
import Button from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function FloatingCreateButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/create"
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50"
            aria-label="Create note"
          >
            <Button
              variant="primary"
              size="lg"
              className="rounded-full w-14 h-14 sm:w-16 sm:h-16 shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
            >
              <svg
                className="w-12 h-12 sm:w-16 sm:h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent
          side="left"
          className="bg-surface0 text-text border-2 border-overlay0 px-4 py-2 text-base sm:text-md font-medium"
        >
          Send Note
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
