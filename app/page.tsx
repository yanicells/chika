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
          <div className="flex items-center justify-between mb-4">
            <div>
              <Link href="/notes" className="group inline-block">
                <h2 className="text-2xl sm:text-4xl font-bold underline decoration-2 underline-offset-4 decoration-subtext0 group-hover:decoration-blue text-text group-hover:text-blue transition-colors inline-flex items-center gap-2">
                  Notes
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
                Chika&apos;s people have sent
              </p>
            </div>
          </div>

          {displayNotes.length > 0 ? (
            <NoteList notes={displayNotes} isUserAdmin={adminStatus} />
          ) : (
            <p className="text-center text-subtext0 py-8">No notes yet.</p>
          )}
        </section>

        {/* Blog Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Link href="/blog" className="group inline-block">
                <h2 className="text-2xl sm:text-4xl font-bold underline decoration-2 underline-offset-4 decoration-subtext0 group-hover:decoration-blue text-text group-hover:text-blue transition-colors inline-flex items-center gap-2">
                  Blog
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
              <p className="text-sm sm:text-lg text-subtext1 mt-1">
                My blog posts
              </p>
            </div>
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
