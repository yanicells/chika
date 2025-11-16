"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Notes", href: "/notes" },
  { name: "Blog", href: "/blog" },
  { name: "Send Note", href: "/create" },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen
          ? "bg-[#1e1e2e]/95 backdrop-blur-sm shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[86rem] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-xl font-mono font-semibold text-[#cdd6f4] hover:text-[#89b4fa] transition-colors duration-200"
          >
            {"<chika / >"}
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={
                  link.name === "Send Note"
                    ? "text-sm font-sans px-4 py-2 rounded-md bg-blue text-base border-2 border-blue hover:bg-[#74a7f5] hover:border-[#74a7f5] transition-all duration-200"
                    : "text-sm font-sans text-[#cdd6f4] hover:text-[#89b4fa] transition-colors duration-200 relative group"
                }
              >
                {link.name}
                {link.name !== "Send Note" && (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#89b4fa] group-hover:w-full transition-all duration-300" />
                )}
              </Link>
            ))}
          </div>
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-[#cdd6f4] hover:text-[#89b4fa] transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <span className="text-sm font-mono">
              {isMenuOpen ? "Close" : "Menu"}
            </span>
          </button>
        </div>
        {/* Mobile dropdown menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="border-t border-[#45475a]/50 py-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={
                    link.name === "Send Note"
                      ? "text-sm font-sans px-4 py-2 rounded-md bg-blue text-base border-2 border-blue hover:bg-[#74a7f5] hover:border-[#74a7f5] transition-all duration-200 text-center"
                      : "text-sm font-sans text-[#cdd6f4] hover:text-[#89b4fa] transition-colors duration-200 py-2"
                  }
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
