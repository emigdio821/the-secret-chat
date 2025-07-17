import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
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
        <Button variant="unstyled" className="block h-20 w-28 rounded-sm p-0">
          <BlurImage src={url} alt={title ?? ''} />
          <span className="sr-only">Open image</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>{title && <DialogTitle>{title}</DialogTitle>}</DialogHeader>
        <div className="h-80 w-full rounded-xs lg:h-[600px]">
          <BlurImage src={url} alt={title ?? ''} onError={errorCb} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
