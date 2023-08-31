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
            <Skeleton className="h-9 w-[74px]" />
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
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="my-4 flex items-center justify-between">
        <Skeleton className="h-2 w-20" />
        <Skeleton className="h-10 w-40" />
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
