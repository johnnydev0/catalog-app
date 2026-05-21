import { Skeleton } from '@/components/ui/skeleton'

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <Skeleton className="h-5 w-2/3 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-full rounded-full" />
        <Skeleton className="h-3.5 w-4/5 rounded-full" />
      </div>
      <div className="flex items-center gap-2 mt-1">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-4 w-20 rounded-full" />
      </div>
      <div className="flex items-center justify-between border-t border-border pt-3">
        <Skeleton className="h-6 w-20 rounded-full" />
        <div className="flex gap-1">
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-full" />
        </div>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export { LoadingSkeleton }
