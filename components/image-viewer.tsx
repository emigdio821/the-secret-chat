import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import { BlurImage } from './blur-image'

interface ImageViewerProps {
  url: string
  title?: string
}

export function ImageViewer({ url, title }: ImageViewerProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="unstyled" className="block h-20 w-28 rounded-lg p-0">
          <BlurImage src={url} />
          <span className="sr-only">Open image</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-4xl"
        onInteractOutside={(e) => {
          e.preventDefault()
        }}
      >
        <DialogHeader>{title && <DialogTitle>{title}</DialogTitle>}</DialogHeader>
        <div className="h-80 w-full rounded-lg lg:h-[600px]">
          <BlurImage src={url} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
