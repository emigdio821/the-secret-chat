import { Skeleton } from '@/components/ui/skeleton'

export function ChatOnlySkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-96 flex-col gap-2 rounded-lg border p-4 sm:h-[420px]">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-16 w-28" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-16 w-28" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-16 w-32" />
        </div>
        <div className="mt-auto flex gap-2 self-end">
          <Skeleton className="h-16 w-32" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-full flex-1" />
        <Skeleton className="h-10 w-10" />
      </div>
    </div>
  )
}

export function FullChatSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="my-1 h-4 w-28" />
      <Skeleton className="mb-4 h-2 w-3/4" />
      <ChatOnlySkeleton />
    </div>
  )
}
