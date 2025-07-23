'use client'

import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'
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
import { BlurImage } from './blur-image'

type ImageViewerProps = {
  url: string
  title?: string
} & ButtonProps

export function ImageViewer({ url, title, className, ...props }: ImageViewerProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant="plain" className={cn('h-20 w-28 rounded-sm', className)} {...props}>
          <BlurImage src={url} alt={title ?? ''} />
          <span className="sr-only">Open image</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="border-none bg-transparent p-0 pt-4 sm:max-w-4xl" showCloseButton={false}>
        <DialogHeader>
          {title && <DialogTitle className="break-all">{title}</DialogTitle>}

          <DialogDescription className="sr-only">Image viewer.</DialogDescription>
        </DialogHeader>
        <div className="h-80 w-full rounded-lg lg:h-[600px]">
          <BlurImage src={url} alt={title ?? ''} className="object-contain" />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
