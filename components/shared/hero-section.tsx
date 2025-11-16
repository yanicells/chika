import Link from "next/link";
import Button from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
          Leave me a note
        </h1>
        <p className="text-lg text-subtext1 mb-8">
          Send anonymous messages, share your thoughts, or just say hi!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/create">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              ✍️ Create Note
            </Button>
          </Link>

          <Link href="/notes">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              📝 View All Notes
            </Button>
          </Link>

          <Link href="/blog">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              📖 View Blog
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

