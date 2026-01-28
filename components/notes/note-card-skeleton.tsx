import Card from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function NoteCardSkeleton() {
  return (
    <Card className="h-full border-t-4 border-overlay0 bg-surface0/60 animate-pulse">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-24 w-full rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </Card>
  );
}
