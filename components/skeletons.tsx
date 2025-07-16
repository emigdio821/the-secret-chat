import { CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ProfileSekelton() {
  return (
    <>
      <CardHeader>
        <Skeleton className="mt-1 mb-2 h-3 w-20" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-28 w-28 rounded-lg" />
        <Skeleton className="mt-6 mb-8 h-2 w-1/2" />
        <Skeleton className="h-3 w-36" />
        <div className="mt-2 flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <Skeleton className="size-4" />
            <Skeleton className="h-2 w-32" />
          </div>
          <div className="flex items-center gap-1">
            <Skeleton className="size-4" />
            <Skeleton className="h-2 w-28" />
          </div>
        </div>
        <Skeleton className="mt-4 h-9 w-[120px]" />
      </CardContent>
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
