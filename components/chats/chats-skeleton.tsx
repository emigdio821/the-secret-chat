import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
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
            <span className="flex gap-1">
              <Skeleton className="h-2 w-3" />
              <Skeleton className="h-2 w-40" />
            </span>
            <Skeleton className="h-9 w-[74px]" />
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}