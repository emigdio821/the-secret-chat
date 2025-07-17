import { useCallback, useEffect, useState } from 'react'
import type { MessageAttributes, ParticipantAttributes } from '@/types'
import type { Message } from '@twilio/conversations'
import { UserIcon } from 'lucide-react'
import { motion } from 'motion/react'
import type { Session } from 'next-auth'
import { AVATAR_FALLBACK_URL } from '@/lib/constants'
import { cn, formatDate } from '@/lib/utils'
import { useMessageParticipant } from '@/hooks/chat/use-message-participant'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { AudioPlayer } from '@/components/audio-player'
import { ImageViewer } from '@/components/image-viewer'
import { MessageActions } from './message-actions'

interface MessageItemProps {
  message: Message
  session: Session
}

export function MessageItem({ message, session }: MessageItemProps) {
  const user = session.user
  const [mediaURL, setMediaURL] = useState<string>('')
  const { author, sid, body, dateCreated } = message
  const isAuthor = author === user?.email
  const hasMedia = message.type === 'media'
  const rawMedia = message.attachedMedia?.[0]
  const isAudio = hasMedia && rawMedia?.contentType.startsWith('audio')
  const isRawImage = hasMedia && rawMedia?.contentType.startsWith('image')
  const { data: participant } = useMessageParticipant(message)
  const partAttrs = participant?.attributes as ParticipantAttributes | undefined
  const msgAttrs = message.attributes as MessageAttributes | undefined
  const isGif = msgAttrs?.gif

  const getMediaUrl = useCallback(async () => {
    if (rawMedia) {
      const url = await rawMedia.getContentTemporaryUrl()
      setMediaURL(url ?? '')
    }
  }, [rawMedia])

  useEffect(() => {
    if (hasMedia) {
      void getMediaUrl()
    }
  }, [getMediaUrl, hasMedia])

  return (
    <motion.div
      layout
      key={sid}
      animate={{ opacity: 1, x: 0 }}
      initial={{ opacity: 0, x: isAuthor ? -50 : 50 }}
      exit={{ opacity: 0, x: -50 }}
      className={cn('flex max-w-[75%] items-center gap-2', {
        'flex-row-reverse self-end': isAuthor,
      })}
    >
      <Avatar className="size-6 self-start">
        <AvatarImage
          className="object-cover"
          alt={`${user?.name}`}
          src={
            isAuthor
              ? ((partAttrs?.avatar_url || user.image) ?? AVATAR_FALLBACK_URL)
              : partAttrs?.avatar_url || AVATAR_FALLBACK_URL
          }
        />
        <AvatarFallback>
          <UserIcon className="size-4" />
        </AvatarFallback>
      </Avatar>
      <div
        className={cn('bg-card flex flex-col gap-2 rounded-lg border px-3 py-2 text-sm shadow-xs', {
          'bg-input/30': !isAuthor,
        })}
      >
        <div className="flex justify-between gap-2">
          <span>
            {isGif &&
              (body ? (
                <ImageViewer url={body} title="GIPHY" errorCb={getMediaUrl} />
              ) : (
                <Skeleton className="h-20 w-28" />
              ))}
            {isRawImage &&
              (mediaURL ? (
                <ImageViewer url={mediaURL} title={rawMedia?.filename ?? undefined} />
              ) : (
                <Skeleton className="h-20 w-28" />
              ))}
            {isAudio &&
              (mediaURL ? <AudioPlayer url={mediaURL} errorCb={getMediaUrl} /> : <Skeleton className="h-20 w-32" />)}
            {!isGif && !isRawImage && !isAudio && (
              <span
                className={cn({
                  'text-muted-foreground italic': !body,
                  'whitespace-pre-line': body,
                })}
              >
                {body ?? 'Empty message'}
              </span>
            )}
          </span>

          {message.author === user?.email && (
            <MessageActions message={message} editMode={!isRawImage && !isGif && !isAudio} />
          )}
        </div>
        <div className="text-muted-foreground flex flex-col text-[10px] leading-4">
          <span>
            {dateCreated && formatDate(dateCreated)}
            {isGif && ' (via GIPHY)'}
            {msgAttrs?.isEdited && ' (edited)'}
            {isRawImage && hasMedia && rawMedia?.contentType && ` (${rawMedia?.contentType})`}
          </span>
          {!isAuthor && <span>{partAttrs?.nickname ?? author}</span>}
        </div>
      </div>
    </motion.div>
  )
}
