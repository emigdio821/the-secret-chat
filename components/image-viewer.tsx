import { XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { BlurImage } from './blur-image'

interface ImageViewerProps {
  url: string
  title?: string
  errorCb?: () => Promise<void>
}

export function ImageViewer({ url, title, errorCb }: ImageViewerProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="plain" className="h-20 w-28 rounded-sm">
          <BlurImage src={url} alt={title ?? ''} />
          <span className="sr-only">Open image</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="border-none bg-transparent p-0 pt-4 sm:max-w-4xl" showCloseButton={false}>
        <DialogHeader className="flex flex-row items-center">
          {title && <DialogTitle>{title}</DialogTitle>}

          <DialogClose asChild>
            <Button size="icon" className="ml-auto" aria-label="Close image viewer" variant="secondary">
              <XIcon className="size-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="h-80 w-full rounded-lg lg:h-[600px]">
          <BlurImage src={url} alt={title ?? ''} onError={errorCb} className="object-contain" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
