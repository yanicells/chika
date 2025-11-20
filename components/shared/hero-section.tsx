"use client";

import Link from "next/link";
import Button from "@/components/ui/button";
import WordCloudDisplay from "./word-cloud-display";

interface HeroSectionProps {
  textContent: string; // For word cloud
}

export default function HeroSection({ textContent }: HeroSectionProps) {
  return (
    <section className="py-12 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Side - Text Content (1/3 on desktop) */}
          <div className="lg:col-span-4 text-center lg:text-left">
            {/* App Name */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text mb-4">
              chika
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-subtext0 mb-8">
              Send messages{" "}
              <span className="text-mauve font-semibold">privately</span>,{" "}
              <span className="text-pink font-semibold">anonymously</span>, and{" "}
              <span className="text-peach font-semibold">comment</span> on my{" "}
              <span className="text-blue font-semibold">blog</span> or
              others&apos; notes
            </p>

            {/* Action Buttons */}
            <div className="flex flex-row flex-wrap gap-3 justify-center lg:justify-start">
              <Link href="/create" className="flex-shrink-0">
                <Button
                  variant="primary"
                  className="text-xs px-2 py-1 sm:px-3 sm:py-1.5 md:text-md lg:text-lg"
                >
                  + Send Note
                </Button>
              </Link>

              <Link href="/notes" className="flex-shrink-0">
                <Button
                  variant="secondary"
                  className="text-xs px-2 py-1 sm:px-3 sm:py-1.5 md:text-md lg:text-lg"
                >
                  Notes
                </Button>
              </Link>

              <Link href="/blog" className="flex-shrink-0">
                <Button
                  variant="secondary"
                  className="text-xs px-2 py-1 sm:px-3 sm:py-1.5 md:text-md lg:text-lg"
                >
                  Blog
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Word Cloud (2/3 on desktop) */}
          <div className="lg:col-span-8">
            <div className="rounded-lg p-4">
              <WordCloudDisplay textContent={textContent} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
