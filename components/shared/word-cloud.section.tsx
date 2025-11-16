import { getAllTextContent } from "@/lib/queries/wordcloud";
import WordCloudDisplay from "./word-cloud-display";

/**
 * Server Component wrapper that fetches text content
 * and passes it to the client-side word cloud component
 */
export default async function WordCloudSection() {
  const textContent = await getAllTextContent();

  return (
    <section className="my-12">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Word Cloud</h2>
        <p className="text-gray-600">
          Frequently used words from notes, comments, and blog posts
        </p>
      </div>

      <WordCloudDisplay textContent={textContent} />
    </section>
  );
}
