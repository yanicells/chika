"use client";

import dynamic from "next/dynamic";
import type { Word, WordCloudProps } from "@isoterik/react-word-cloud";
import type { WordCloudWord } from "@/lib/queries/wordcloud";

// Dynamically import components
const WordCloud = dynamic(
  () => import("@isoterik/react-word-cloud").then((mod) => mod.WordCloud),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-surface1 h-96 rounded-lg" />
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
  words: WordCloudWord[];
}

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
export default function WordCloudDisplay({ words }: WordCloudDisplayProps) {
  const preparedWords = (words as Word[]) || [];

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

  if (preparedWords.length === 0) {
    return (
      <div className="text-center py-12 text-subtext0">
        No words to display yet. Add some notes or blog posts!
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg p-4 overflow-hidden">
      <div className="w-full h-[500px] flex items-center justify-center">
        <WordCloud
          words={preparedWords}
          width={
            typeof window !== "undefined"
              ? Math.min(window.innerWidth - 100, 700)
              : 700
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
              "#89b4fa", // blue
              "#cba6f7", // mauve
              "#f5c2e7", // pink
              "#fab387", // peach
              "#a6e3a1", // green
              "#94e2d5", // teal
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
