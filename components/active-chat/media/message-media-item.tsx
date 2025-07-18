import type { Media } from '@twilio/conversations'
import { Skeleton } from '@/components/ui/skeleton'
import { AudioPlayer } from '@/components/audio-player'
import { ImageViewer } from '@/components/image-viewer'

interface MessageMediaItemProps {
  body: string | null
  isGif: boolean | undefined
  isAudio: boolean | undefined
  isRawImage: boolean | undefined
  rawMedia: Media | undefined
  msgMedia: { url: string; loading: boolean }
}

export function MessageMediaItem(props: MessageMediaItemProps) {
  const { isGif, isRawImage, isAudio, body, msgMedia, rawMedia } = props

  if (isGif) {
    return msgMedia.loading ? <Skeleton className="h-20 w-28" /> : <ImageViewer url={body ?? ''} title="GIPHY" />
  }

  if (isRawImage) {
    return msgMedia.loading ? (
      <Skeleton className="h-20 w-28" />
    ) : (
      <ImageViewer url={msgMedia.url} title={rawMedia?.filename ?? 'Image'} />
    )
  }

  if (isAudio) {
    return msgMedia.loading ? <Skeleton className="h-20 w-40" /> : <AudioPlayer src={msgMedia.url} />
  }

  return <p className="break-words">{body}</p>
}
