import Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogDetailSkeleton() {
  return (
    <Card className="max-w-[85rem] mx-auto border-t-4 border-overlay0 bg-surface0/60">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-24" />
        </div>

        <Skeleton className="h-10 w-3/4" />

        <Skeleton className="h-3 w-48" />

        <Skeleton className="h-64 w-full rounded-md" />

        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        <div className="flex items-center justify-between pt-4">
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    </Card>
  );
}
