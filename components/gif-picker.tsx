import { useState } from 'react'
import { useDebouncedValue, useDisclosure } from '@mantine/hooks'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { GIPHY_GIFS_QUERY } from '@/lib/constants'
import { useGiphy } from '@/hooks/use-giphy'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { BlurImage } from '@/components/blur-image'
import { GifsSkeleton } from '@/components/skeletons'

interface GifPickerProps {
  trigger?: React.ReactNode
  callback: (url: string) => void
}

export function GifPicker({ trigger, callback }: GifPickerProps) {
  const giphy = useGiphy()
  const [opened, handlers] = useDisclosure()
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()
  const [debouncedSearch] = useDebouncedValue(search, 500)
  const { data: gifs, isLoading: gifsLoading } = useQuery({
    queryKey: [GIPHY_GIFS_QUERY, debouncedSearch],
    queryFn: async () => await getGifs(debouncedSearch),
    enabled: opened,
  })

  async function getGifs(searchGif: string) {
    try {
      if (searchGif) {
        const gifs = await giphy.search(searchGif, { limit: 50 })
        return gifs.data
      } else {
        const gifs = await giphy.trending({ offset: 0, limit: 50 })
        return gifs.data
      }
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.log('[GET_GIFS]', errMessage)
      return null
    }
  }

  return (
    <Dialog
      open={opened}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          queryClient.removeQueries({ queryKey: [GIPHY_GIFS_QUERY] })
        }
        handlers.toggle()
      }}
    >
      <DialogTrigger asChild>{trigger ?? <Button onClick={handlers.open}>Select a GIF</Button>}</DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>Pick a GIF</DialogTitle>
          <DialogDescription>Pick a GIF from the list below, powered by GIPHY.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Input
            autoComplete="false"
            placeholder="What are you looking for?"
            onChange={(e) => {
              setSearch(e.target.value)
            }}
          />
          <div className="relative grid h-[420px] grid-cols-2 gap-4 overflow-y-auto rounded-lg py-1 sm:grid-cols-3">
            {gifsLoading ? (
              <GifsSkeleton />
            ) : gifs && gifs?.length > 0 ? (
              gifs.map((gif) => (
                <Button
                  key={gif.id}
                  type="button"
                  variant="unstyled"
                  className="h-24 w-full rounded-lg p-0 transition-transform hover:scale-95 focus-visible:scale-95"
                  onClick={(e) => {
                    const parent = e.currentTarget.parentElement
                    if (parent) {
                      parent.style.pointerEvents = 'none'
                    }
                    handlers.close()
                    callback(gif.images.fixed_height.url)
                  }}
                >
                  <BlurImage src={gif.images.fixed_height.url} alt="gif" />
                  <span className="sr-only">GIF</span>
                </Button>
              ))
            ) : (
              <span className="text-sm">No GIFs found</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
