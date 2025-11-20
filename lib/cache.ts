import { unstable_cache } from "next/cache";

export const DEFAULT_REVALIDATE_SECONDS = 3600;

type CacheOptions = {
  tags?: string[];
};

/**
 * Wrap a data fetching function with Next.js unstable_cache using the default
 * revalidation window. Ensures we reuse one consistent configuration across
 * queries and keep tag wiring ergonomic.
 */
export function withCache<Args extends unknown[], Result>(
  fn: (...args: Args) => Promise<Result>,
  keyParts: string[],
  options: CacheOptions = {}
): (...args: Args) => Promise<Result> {
  return unstable_cache(fn, keyParts, {
    revalidate: DEFAULT_REVALIDATE_SECONDS,
    tags: options.tags,
  });
}

