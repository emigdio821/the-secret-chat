'use client'

import { useEffect, useMemo, useState } from 'react'
import { debounce, throttle } from 'lodash'
import { WindIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGifs } from '@/hooks/use-gifs'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { BlurImage } from '../blur-image'
import { Icons } from '../icons'
import { Button } from '../ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

interface GifPickerDialogProps {
  trigger: React.ReactNode
  onSelect: (url: string) => void
}

export function GifPickerDialog({ onSelect, trigger }: GifPickerDialogProps) {
  const [search, setSearch] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const { data: infiniteGifs, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useGifs(debouncedQuery)
  const gifs = infiniteGifs?.pages.flatMap((page) => page.data) ?? []

  const updateQuery = useMemo(
    () =>
      debounce((val: string) => {
        setDebouncedQuery(val)
      }, 300),
    [],
  )

  const throttledSelect = useMemo(
    () =>
      throttle(
        (url: string) => {
          setOpenDialog(false)
          onSelect(url)
        },
        1000,
        { leading: true, trailing: false },
      ),
    [onSelect],
  )

  useEffect(() => {
    updateQuery(search)
    return () => updateQuery.cancel()
  }, [search, updateQuery])

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pick a GIF</DialogTitle>
          <DialogDescription>Pick a GIF from the list below, powered by GIPHY.</DialogDescription>
        </DialogHeader>
        <Input placeholder="Search" name="search-gifs" value={search} onChange={(e) => setSearch(e.target.value)} />

        <p className="text-muted-foreground text-sm">
          {debouncedQuery ? `Results for "${debouncedQuery}"` : 'Trending GIFs'}
        </p>

        {isLoading ? (
          <div className="grid max-h-96 grid-cols-3 place-items-center gap-2 overflow-y-auto rounded-lg">
            {Array.from(Array(15).keys()).map((n) => (
              <Skeleton key={`${n}-fig-skeleton`} className="h-24 w-full sm:h-20" />
            ))}
          </div>
        ) : (
          gifs &&
          (gifs.length > 0 ? (
            <div className="flex flex-col gap-4 overflow-hidden rounded-lg">
              <div className="grid max-h-96 grid-cols-3 place-items-center gap-2 overflow-y-auto rounded-lg">
                {gifs.map((gif) => (
                  <Button
                    type="button"
                    variant="unstyled"
                    aria-label={`${gif.title}-gif`}
                    className="h-24 w-full hover:scale-90 sm:h-20"
                    key={`${gif.id}-${gif.images.fixed_height.url}`}
                    onClick={() => throttledSelect(gif.images.fixed_height.url)}
                  >
                    <BlurImage className="object-contain" src={gif.images.fixed_height.url} alt={gif.title} />
                  </Button>
                ))}

                {hasNextPage && (
                  <>
                    <div />
                    <Button
                      size="sm"
                      type="button"
                      variant="outline"
                      className="relative"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                    >
                      <span className={cn(isFetchingNextPage && 'invisible')}>Load more</span>
                      {isFetchingNextPage && <Icons.Spinner className="absolute" />}
                    </Button>
                    <div />
                  </>
                )}
              </div>
            </div>
          ) : (
            <Card>
              <CardHeader className="flex flex-col items-center justify-center">
                <CardTitle>
                  <WindIcon className="size-6" />
                </CardTitle>
                <span>Empty</span>
                <CardDescription className="text-center">No gifs were found.</CardDescription>
              </CardHeader>
            </Card>
          ))
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
