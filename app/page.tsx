import HeroSection from "@/components/shared/hero-section";
import { getAllTextContent } from "@/lib/queries/wordcloud";
import { getPublicNotes } from "@/lib/queries/notes";
import { getPublishedBlogPosts } from "@/lib/queries/blog";
import NoteList from "@/components/notes/note-list";
import BlogList from "@/components/blog/blog-list";
import Container from "@/components/shared/container";
import Link from "next/link";
import { isAdmin } from "@/lib/auth-helper";

export default async function HomePage() {
  // Get text content for word cloud
  const textContent = await getAllTextContent();

  // Get notes and blogs (pinned first, then recent, max 6 each)
  const allNotes = await getPublicNotes();
  const pinnedNotes = allNotes.filter((note) => note.isPinned);
  const recentNotes = allNotes
    .filter((note) => !note.isPinned)
    .slice(0, 6 - pinnedNotes.length);
  const displayNotes = [...pinnedNotes, ...recentNotes].slice(0, 6);

  const recentBlogs = (await getPublishedBlogPosts()).slice(0, 6);
  const adminStatus = await isAdmin();

  return (
    <div>
      {/* Hero Section */}
      <HeroSection textContent={textContent} />

      <div className="max-w-[85rem] mx-auto px-4 lg:px-8">
        {/* Notes Section */}
        <section className="my-12">
          <div className="flex items-center justify-between mb-6">
            <Link href="/notes" className="group">
              <h2 className="text-2xl font-bold text-text group-hover:text-blue transition-colors">
                Notes
              </h2>
            </Link>
            <Link
              href="/notes"
              className="text-sm text-blue hover:underline transition-colors"
            >
              View all →
            </Link>
          </div>

          {displayNotes.length > 0 ? (
            <NoteList notes={displayNotes} isUserAdmin={adminStatus} />
          ) : (
            <p className="text-center text-subtext0 py-8">No notes yet.</p>
          )}
        </section>

        {/* Blog Section */}
        <section className="my-12">
          <div className="flex items-center justify-between mb-6">
            <Link href="/blog" className="group">
              <h2 className="text-2xl font-bold text-text group-hover:text-blue transition-colors">
                Blog
              </h2>
            </Link>
            <Link
              href="/blog"
              className="text-sm text-blue hover:underline transition-colors"
            >
              View all →
            </Link>
          </div>

          {recentBlogs.length > 0 ? (
            <BlogList posts={recentBlogs} isUserAdmin={adminStatus} />
          ) : (
            <p className="text-center text-subtext0 py-8">No blog posts yet.</p>
          )}
        </section>
      </div>

      {/* Bottom Spacing */}
      <div className="pb-32" />
    </div>
  );
}
