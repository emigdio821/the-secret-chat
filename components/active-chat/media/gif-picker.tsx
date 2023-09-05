import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { useForm } from 'react-hook-form'
import type * as z from 'zod'

import { GIFS_QUERY } from '@/lib/constants'
import { searchGifsSchema } from '@/lib/zod-schemas'
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
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { BlurImage } from '@/components/blur-image'
import { GifsSkeleton } from '@/components/skeletons'

interface GifPickerProps {
  trigger?: React.ReactNode
  action: (url: string) => void
  isOpen: boolean
  setOpen: (isOpen?: boolean) => void
}

export function GifPicker({ trigger, action, isOpen, setOpen }: GifPickerProps) {
  const giphy = useGiphy()
  const form = useForm<z.infer<typeof searchGifsSchema>>({
    resolver: zodResolver(searchGifsSchema),
    defaultValues: {
      name: '',
    },
  })
  const {
    data: gifs,
    isLoading: gifsLoading,
    refetch,
  } = useQuery([GIFS_QUERY], async () => await getGifs(form.getValues('name')), {
    enabled: isOpen,
  })

  async function getGifs(searchGif: string) {
    try {
      let gifs
      if (searchGif) {
        gifs = await giphy.search(searchGif, { limit: 50 })
      } else {
        gifs = await giphy.trending({ offset: 0, limit: 50 })
      }

      return gifs.data
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.log('[GET_GIFS]', errMessage)
      return null
    }
  }

  async function onSubmit() {
    try {
      await refetch()
    } catch (err) {
      let errMsg = 'Unknown error'
      if (err instanceof Error) errMsg = err.message
      console.log('[SEARCH_GIFS]', errMsg)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button
            onClick={() => {
              setOpen(true)
            }}
          >
            Select a GIF
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        onOpenAutoFocus={(e) => {
          e.preventDefault()
        }}
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>
          <DialogTitle>Pick a GIF</DialogTitle>
          <DialogDescription>Pick a GIF from the list below, powered by GIPHY.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="w-full flex-1">
                    <FormControl>
                      <Input
                        autoComplete="false"
                        placeholder="What are you looking for?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </form>
          </Form>
          <div className="relative grid h-[420px] grid-cols-2 gap-4 overflow-y-auto rounded-lg p-1 sm:grid-cols-3">
            {gifsLoading ? (
              <GifsSkeleton />
            ) : (
              <>
                {gifs && gifs?.length > 0 ? (
                  <>
                    {gifs.map((gif) => (
                      <Button
                        key={gif.id}
                        type="button"
                        variant="unstyled"
                        className="h-24 w-full rounded-lg p-0 transition-transform hover:scale-105"
                        onClick={(e) => {
                          const parent = e.currentTarget.parentElement
                          if (parent) {
                            parent.style.pointerEvents = 'none'
                          }
                          setOpen(false)
                          action(gif.images.fixed_height.url)
                        }}
                      >
                        <BlurImage src={gif.images.fixed_height.url} />
                        <span className="sr-only">GIF</span>
                      </Button>
                    ))}
                  </>
                ) : (
                  <span className="text-sm">No GIFs found</span>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
