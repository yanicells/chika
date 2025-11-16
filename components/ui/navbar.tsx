'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/**
 * Navbar component with logo, navigation links, and auth button
 * 
 * @param logo - Logo text or component to display on the left
 * @param links - Array of navigation links with href and label
 * @param authButton - Auth button component (Login/Logout)
 * @param isAuthenticated - Whether user is authenticated (affects mobile menu)
 */
interface NavLink {
  href: string;
  label: string;
}

interface NavbarProps {
  logo?: React.ReactNode;
  links?: NavLink[];
  authButton?: React.ReactNode;
  isAuthenticated?: boolean;
}

export default function Navbar({
  logo = 'Chika',
  links = [],
  authButton,
  isAuthenticated = false,
}: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-gray-700">
              {logo}
            </Link>
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-6 md:flex-1 md:justify-center">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Desktop Auth Button */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {authButton}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
              aria-label="Toggle menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {authButton && (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="px-3">{authButton}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

