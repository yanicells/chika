import HeroSection from "@/components/shared/hero-section";
import { getPublicNotes } from "@/lib/queries/notes";
import { getPublishedBlogPosts } from "@/lib/queries/blog";
import NoteList from "@/components/notes/note-list";
import BlogList from "@/components/blog/blog-list";
import NoteCardSkeleton from "@/components/notes/note-card-skeleton";
import BlogCardSkeleton from "@/components/blog/blog-card-skeleton";
import Link from "next/link";
import { Suspense } from "react";
import { isAdmin } from "@/lib/auth-helper";

// Force dynamic rendering to prevent session cache issues
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const adminStatus = await isAdmin();

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      <div className="max-w-[85rem] mx-auto px-4 lg:px-8">
        {/* Notes Section */}
        <section className="my-12">
          <SectionHeader
            href="/notes"
            title="Notes"
            subtitle="Chika's people have sent"
          />

          <Suspense fallback={<NoteFeedFallback />}>
            <NoteFeedSection isUserAdmin={adminStatus} />
          </Suspense>
        </section>

        {/* Blog Section */}
        <section className="mb-12">
          <SectionHeader href="/blog" title="Blog" subtitle="My blog posts" />

          <Suspense fallback={<BlogFeedFallback />}>
            <BlogFeedSection isUserAdmin={adminStatus} />
          </Suspense>
        </section>
      </div>

      {/* Bottom Spacing */}
      <div className="pb-32" />
    </div>
  );
}

function SectionHeader({
  href,
  title,
  subtitle,
}: {
  href: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <Link href={href} className="group inline-block">
          <h2 className="text-2xl sm:text-4xl font-bold underline decoration-2 underline-offset-4 decoration-subtext0 group-hover:decoration-blue text-text group-hover:text-blue transition-colors inline-flex items-center gap-2">
            {title}
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 opacity-0 group-hover:opacity-100 transition-opacity"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </h2>
        </Link>
        <p className="text-sm sm:text-lg text-subtext1 mt-1 mb-0 pb-0">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

async function NoteFeedSection({
  isUserAdmin,
}: {
  isUserAdmin: boolean;
}) {
  const allNotes = await getPublicNotes();
  const pinnedNotes = allNotes.filter((note) => note.isPinned);
  const recentNotes = allNotes
    .filter((note) => !note.isPinned)
    .slice(0, 6 - pinnedNotes.length);
  const displayNotes = [...pinnedNotes, ...recentNotes].slice(0, 6);

  if (displayNotes.length === 0) {
    return <p className="text-center text-subtext0 py-8">No notes yet.</p>;
  }

  return <NoteList notes={displayNotes} isUserAdmin={isUserAdmin} />;
}

async function BlogFeedSection({
  isUserAdmin,
}: {
  isUserAdmin: boolean;
}) {
  const recentBlogs = (await getPublishedBlogPosts()).slice(0, 6);

  if (recentBlogs.length === 0) {
    return (
      <p className="text-center text-subtext0 py-8">No blog posts yet.</p>
    );
  }

  return <BlogList posts={recentBlogs} isUserAdmin={isUserAdmin} />;
}

function NoteFeedFallback() {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-0">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={`note-skeleton-${index}`} className="break-inside-avoid mb-6">
          <NoteCardSkeleton />
        </div>
      ))}
    </div>
  );
}

function BlogFeedFallback() {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-0">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={`blog-skeleton-${index}`} className="break-inside-avoid mb-6">
          <BlogCardSkeleton />
        </div>
      ))}
    </div>
  );
}
