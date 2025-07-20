import { CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ProfileSekelton() {
  return (
    <>
      <CardHeader>
        <div className="flex h-4 items-center">
          <Skeleton className="h-2 w-20" />
        </div>
        <div className="flex h-5 items-center">
          <Skeleton className="h-2 w-44" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Skeleton className="size-16 rounded-full" />
          <div className="flex flex-col items-start">
            <div className="flex h-5 items-center">
              <Skeleton className="h-2 w-36" />
            </div>
            <div className="flex h-5 items-center">
              <Skeleton className="h-2 w-36" />
            </div>
            <div className="flex h-5 items-center">
              <Skeleton className="h-2 w-36" />
            </div>
            <div className="flex h-5 items-center">
              <Skeleton className="h-2 w-36" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-9 w-[60px]" />
      </CardFooter>
    </>
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
