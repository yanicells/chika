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

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin"; // Exact match for dashboard
    }
    return pathname.startsWith(path); // Starts with for sub-pages
  };

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
    <nav className="w-64 bg-[#1e1e2e]/95 backdrop-blur-sm border-r border-[#45475a]/50 min-h-screen p-4">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[#cdd6f4] mb-4">
          Admin Panel
        </h2>

        {navLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link key={link.href} href={link.href}>
              <div
                className={`px-4 py-2 m-1 rounded-md transition-colors duration-200 ${
                  active
                    ? "bg-[#89b4fa]/20 text-[#89b4fa] font-medium"
                    : "text-[#cdd6f4] hover:bg-[#313244] hover:text-[#89b4fa]"
                }`}
              >
                {link.label}
              </div>
            </Link>
          );
        })}

        <div className="pt-8 border-t border-[#45475a]/50">
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
