import { requireAdmin } from "@/lib/auth-helper";
import { getAllNotes } from "@/lib/queries/notes";
import { getAllBlogPosts } from "@/lib/queries/blog";
import Container from "@/components/shared/container";
import Link from "next/link";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";

// Force dynamic rendering for admin pages
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboard() {
  const session = await requireAdmin();
  const notes = await getAllNotes();
  const blogPosts = await getAllBlogPosts();

  const stats = {
    totalNotes: notes.length,
    privateNotes: notes.filter((n) => n.isPrivate).length,
    publicNotes: notes.filter((n) => !n.isPrivate).length,
    totalBlogs: blogPosts.length,
    publishedBlogs: blogPosts.filter((b) => b.isPublished).length,
    draftBlogs: blogPosts.filter((b) => !b.isPublished).length,
  };

  return (
    <Container>
      <div className="py-8">
        <h1 className="text-3xl font-bold text-text mb-2">Admin Dashboard</h1>
        <p className="text-subtext1 mb-8">Welcome back, {session.user.email}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <h3 className="text-sm font-medium text-subtext1 mb-1">
              Total Notes
            </h3>
            <p className="text-3xl font-bold text-text">{stats.totalNotes}</p>
            <p className="text-sm text-subtext0 mt-2">
              {stats.publicNotes} public, {stats.privateNotes} private
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-subtext1 mb-1">
              Blog Posts
            </h3>
            <p className="text-3xl font-bold text-text">{stats.totalBlogs}</p>
            <p className="text-sm text-subtext0 mt-2">
              {stats.publishedBlogs} published, {stats.draftBlogs} drafts
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-medium text-subtext1 mb-1">
              Quick Actions
            </h3>
            <div className="flex flex-col gap-2 mt-2">
              <Link href="/admin/blog/create">
                <Button variant="secondary" size="sm" className="w-full">
                  New Blog Post
                </Button>
              </Link>
              <Link href="/admin/notes">
                <Button variant="secondary" size="sm" className="w-full">
                  View Notes
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <h2 className="text-xl font-bold text-text mb-4">Recent Notes</h2>
        <div className="space-y-2">
          {notes.slice(0, 5).map((note) => (
            <Link key={note.id} href={`/admin/notes/edit/${note.id}`}>
              <Card className="p-2 my-4 hover:bg-surface1 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text font-medium">
                      {note.title || "Untitled"}
                    </p>
                    <p className="text-sm text-subtext0 flex items-center gap-1">
                      {note.isPrivate ? (
                        <>
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                          Private
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Public
                        </>
                      )}{" "}
                      • {note.userName || "Anonymous"}
                    </p>
                  </div>
                  <span className="text-subtext0 text-sm">Edit →</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
}
