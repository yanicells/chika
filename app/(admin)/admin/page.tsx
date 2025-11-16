import { requireAdmin } from "@/lib/auth-helper";

export default async function AdminDashboard() {
  const session = await requireAdmin();

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {session.user.email}</p>
      {/* Stats, quick links, etc. */}
    </div>
  );
}
