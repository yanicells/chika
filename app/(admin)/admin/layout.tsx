import { requireAdmin } from "@/lib/auth-helper";
import AdminNav from "@/components/admin/admin-nav";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin(); // Protects all admin routes

  return (
    <div className="flex">
      <AdminNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
