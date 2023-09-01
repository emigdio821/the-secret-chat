import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ChatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Array.from(Array(2).keys()).map((n) => (
        <Card key={n}>
          <CardHeader>
            <CardTitle>
              <Skeleton className="my-3 h-2 w-24" />
            </CardTitle>
            <Skeleton className="h-2 w-28" />
          </CardHeader>
          <CardFooter className="mt-1 justify-between">
            <div className="flex flex-col gap-1">
              <span className="flex gap-1">
                <Skeleton className="h-2 w-3" />
                <Skeleton className="h-2 w-6" />
              </span>
              <span className="flex gap-1">
                <Skeleton className="h-2 w-3" />
                <Skeleton className="h-2 w-32" />
              </span>
            </div>
            <Skeleton className="h-9 w-[52px]" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export function UserChatsSkeleton() {
  return (
    <>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-20" />
      </div>
      <div className="my-4 flex items-center justify-between">
        <Skeleton className="h-2 w-20" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-11 sm:w-24" />
          <Skeleton className="h-10 w-40" />
        </div>
      </div>
      <ChatsSkeleton />
    </>
  )
}

export function ProfileSekelton() {
  return (
    <>
      <CardHeader>
        <Skeleton className="mb-2 mt-1 h-3 w-20" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-28 w-28 rounded-lg" />
        <Skeleton className="mb-8 mt-6 h-2 w-1/2" />
        <Skeleton className="h-3 w-36" />
        <div className="mt-2 flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-2 w-32" />
          </div>
          <div className="flex items-center gap-1 ">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-2 w-28" />
          </div>
        </div>
        <Skeleton className="mt-4 h-9 w-[120px]" />
      </CardContent>
    </>
  )
}

export function ChatOnlySkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="h-20 w-full overflow-auto rounded-lg border sm:h-[420px] sm:w-36">
          <div className="flex h-full w-full flex-row items-center gap-1 p-4 sm:flex-col">
            <div className="flex h-8 items-center gap-1">
              <Skeleton className="h-5 w-5 rounded-sm" />
              <Skeleton className="h-2 w-10" />
            </div>
            <div className="flex h-8 items-center gap-1">
              <Skeleton className="h-5 w-5 rounded-sm" />
              <Skeleton className="h-2 w-[72px]" />
            </div>
            <div className="flex h-8 items-center gap-1">
              <Skeleton className="h-5 w-5 rounded-sm" />
              <Skeleton className="h-2 w-[72px]" />
            </div>
          </div>
        </div>
        <div className="flex h-96 w-full flex-col gap-2 rounded-lg border p-4 sm:h-[420px] sm:flex-1">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-6 rounded-lg" />
            <Skeleton className="h-16 w-28" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-6 rounded-lg" />
            <Skeleton className="h-16 w-28" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-6 rounded-lg" />
            <Skeleton className="h-16 w-32" />
          </div>
          <div className="mt-auto flex gap-2 self-end">
            <Skeleton className="h-16 w-32" />
            <Skeleton className="h-6 w-6 rounded-lg" />
          </div>
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

export function GifsSkeleton() {
  return (
    <>
      {Array.from(Array(12).keys()).map((n) => (
        <Skeleton key={n} className="h-24 w-full rounded-lg" />
      ))}
    </>
  )
}
