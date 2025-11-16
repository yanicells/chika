"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth-actions";

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/notes", label: "Private Notes" },
    { href: "/admin/blog", label: "Manage Blog" },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="w-64 bg-surface0 border-r border-overlay0 min-h-screen p-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-text mb-4">Admin Panel</h2>

        {navLinks.map((link) => {
          const isActive =
            pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link key={link.href} href={link.href}>
              <div
                className={`px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-blue/20 text-blue font-medium"
                    : "text-subtext1 hover:bg-surface1"
                }`}
              >
                {link.label}
              </div>
            </Link>
          );
        })}

        <div className="pt-8 border-t border-overlay0">
          <Button
            variant="danger"
            size="sm"
            onClick={handleLogout}
            className="w-full"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
