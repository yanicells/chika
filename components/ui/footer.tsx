import React from 'react';
import Link from 'next/link';

/**
 * Footer component with copyright and optional social links
 * 
 * @param copyright - Copyright text (defaults to current year)
 * @param companyName - Company/App name for copyright
 * @param socialLinks - Array of social media links with href, label, and optional icon
 */
interface SocialLink {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

interface FooterProps {
  copyright?: string;
  companyName?: string;
  socialLinks?: SocialLink[];
}

export default function Footer({
  copyright,
  companyName = 'Chika',
  socialLinks = [],
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const copyrightText = copyright || `© ${currentYear} ${companyName}. All rights reserved.`;
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex items-center space-x-6">
              {socialLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  aria-label={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.icon || link.label}
                </Link>
              ))}
            </div>
          )}
          
          {/* Copyright */}
          <p className="text-sm text-gray-600 text-center">
            {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}

