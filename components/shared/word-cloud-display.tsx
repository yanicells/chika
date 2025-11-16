"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import type { Word, WordCloudProps } from "@isoterik/react-word-cloud";

// Dynamically import components
const WordCloud = dynamic(
  () => import("@isoterik/react-word-cloud").then((mod) => mod.WordCloud),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-96 rounded-lg" />
    ),
  }
);

const AnimatedWordRenderer = dynamic(
  () =>
    import("@isoterik/react-word-cloud").then(
      (mod) => mod.AnimatedWordRenderer
    ),
  { ssr: false }
);

interface WordCloudDisplayProps {
  textContent: string;
}

// Common words to filter out (stopwords)
const STOP_WORDS = new Set(["anonymous", "admin"]);

// Array of fonts to rotate through
const FONTS = [
  "Impact",
  "Arial",
  "Georgia",
  "Courier New",
  "Comic Sans MS",
  "Verdana",
  "Times New Roman",
];

/**
 * Word Cloud Display Component
 * Shows frequently used words from notes, comments, and blog posts
 */
export default function WordCloudDisplay({
  textContent,
}: WordCloudDisplayProps) {
  const words = useMemo(() => {
    if (!textContent) return [];

    // Process text: lowercase, remove punctuation, split into words
    const allWords = textContent
      .toLowerCase()
      .replace(/[^\w\s]/g, " ") // Remove punctuation
      .split(/\s+/) // Split by whitespace
      .filter((word) => {
        // Filter: 4+ letters, not a stopword, not a number
        return word.length >= 4 && !STOP_WORDS.has(word) && !/^\d+$/.test(word);
      });

    // Count word frequency
    const wordCount = new Map<string, number>();
    allWords.forEach((word) => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });

    // Convert to Word array format
    const wordArray: Word[] = Array.from(wordCount.entries())
      .map(([text, value]) => ({ text, value }))
      .sort((a, b) => b.value - a.value) // Sort by frequency
      .slice(0, 100); // Top 100 words

    return wordArray;
  }, [textContent]);

  // Render word with animation
  const renderWord: WordCloudProps["renderWord"] = (data, ref) => (
    <AnimatedWordRenderer
      ref={ref}
      data={data}
      animationDelay={(_, index) => index * 50} // Stagger animation
    />
  );

  // Resolve font based on index
  const resolveFont: WordCloudProps["font"] = (_, index) => {
    return FONTS[index % FONTS.length];
  };

  if (words.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No words to display yet. Add some notes or blog posts!
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-4 overflow-hidden">
      <div className="w-full h-[500px] flex items-center justify-center">
        <WordCloud
          words={words}
          width={
            typeof window !== "undefined"
              ? Math.min(window.innerWidth - 100, 900)
              : 900
          }
          height={500}
          font={resolveFont}
          fontSize={(word) => Math.sqrt(word.value) * 12}
          rotate={() => (Math.random() > 0.5 ? 0 : 90)}
          spiral="archimedean"
          padding={3}
          random={Math.random}
          fill={(_, index) => {
            const colors = [
              "#3b82f6", // blue
              "#8b5cf6", // purple
              "#ec4899", // pink
              "#f59e0b", // amber
              "#10b981", // green
              "#06b6d4", // cyan
            ];
            return colors[index % colors.length];
          }}
          enableTooltip // Enable default tooltip showing word count
          renderWord={renderWord} // Use animated word renderer
        />
      </div>
    </div>
  );
}
