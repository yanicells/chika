"use client";

import Link from "next/link";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { FilterType } from "@/components/notes/note-filter";

interface NotesPaginationProps {
  currentPage: number;
  totalPages: number;
  filter?: FilterType;
}

export default function NotesPagination({
  currentPage,
  totalPages,
  filter = "all",
}: NotesPaginationProps) {
  // Generate page numbers to display (show 5 pages max)
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) range.unshift("...");
    if (currentPage + delta < totalPages - 1) range.push("...");

    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  const pageNumbers = getPageNumbers();

  // Build URL with filter preserved
  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    if (page > 1) {
      params.set("page", page.toString());
    }
    if (filter && filter !== "all") {
      params.set("filter", filter);
    }
    const queryString = params.toString();
    return queryString ? `/notes?${queryString}` : "/notes";
  };

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? buildUrl(currentPage - 1) : "#"}
            size="default"
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {/* Page Numbers */}
        {pageNumbers.map((page, idx) => (
          <PaginationItem key={idx}>
            {page === "..." ? (
              <span className="px-2 text-subtext0">•••</span>
            ) : (
              <PaginationLink
                href={buildUrl(page as number)}
                isActive={page === currentPage}
                size="default"
                className={
                  page === currentPage
                    ? "bg-blue text-base border-blue"
                    : "text-text hover:text-blue"
                }
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            href={currentPage < totalPages ? buildUrl(currentPage + 1) : "#"}
            size="default"
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
