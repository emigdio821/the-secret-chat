import type { MessageAttributes, ParticipantAttributes } from '@/types'
import type { Message } from '@twilio/conversations'
import { motion } from 'motion/react'
import type { Session } from 'next-auth'
import { AVATAR_FALLBACK_URL } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useMessageMedia } from '@/hooks/chat/use-message-media'
import { useMessageParticipant } from '@/hooks/chat/use-message-participant'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageMediaItem } from './media/message-media-item'
import { MessageActions } from './message-actions'
import { MessageMeta } from './message-meta'

interface MessageItemProps {
  message: Message
  session: Session
}

export function MessageItem({ message, session }: MessageItemProps) {
  const user = session.user
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
  const isEditable = !isRawImage && !isGif && !isAudio
  const { msgMedia } = useMessageMedia(rawMedia)

  const avatarUrl = isAuthor
    ? ((partAttrs?.avatar_url || user.image) ?? AVATAR_FALLBACK_URL)
    : partAttrs?.avatar_url || AVATAR_FALLBACK_URL

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
        <AvatarImage className="object-cover" alt={`${user?.name}`} src={avatarUrl} />
        <AvatarFallback />
      </Avatar>

      <div className="bg-card flex flex-col gap-2 rounded-lg border px-3 py-2 text-sm shadow-xs">
        <div className="flex gap-2">
          <MessageMediaItem
            body={body}
            isGif={isGif}
            isAudio={isAudio}
            msgMedia={msgMedia}
            rawMedia={rawMedia}
            isRawImage={isRawImage}
          />
        </div>

        <MessageMeta
          isGif={isGif}
          author={author}
          msgAttrs={msgAttrs}
          isAuthor={isAuthor}
          rawMedia={rawMedia}
          partAttrs={partAttrs}
          dateCreated={dateCreated}
        />
      </div>
      {isAuthor && <MessageActions message={message} isEditable={isEditable} />}
    </motion.div>
  )
}
