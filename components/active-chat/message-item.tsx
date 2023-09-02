import { useCallback, useEffect, useState } from 'react'
import { type MessageAttributes, type ParticipantAttributes } from '@/types'
import { useQuery } from '@tanstack/react-query'
import { type Message } from '@twilio/conversations'
import { motion } from 'framer-motion'
import { ImageOff, User } from 'lucide-react'
import { type Session } from 'next-auth'

import { AVATAR_FALLBACK_URL, MESSAGE_PARTICIPANT_QUERY } from '@/lib/constants'
import { cn, formatDate } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { BlurImage } from '../blur-image'
import { Skeleton } from '../ui/skeleton'
import { MessageActions } from './message-actions'

interface MessageItemProps {
  message: Message
  session: Session
}

export default function MessageItem({ session, message }: MessageItemProps) {
  const user = session.user
  const [mediaURL, setMediaURL] = useState<string>('')
  const { author, sid, body, dateCreated } = message
  const isAuthor = author === user?.email
  const hasMedia = message.type === 'media'
  const rawMedia = message.attachedMedia?.[0]
  // const isAudio = hasMedia && rawMedia?.contentType.startsWith('audio')
  const isImage = hasMedia && rawMedia?.contentType.startsWith('image')
  const { data: msgParticipant } = useQuery(
    [MESSAGE_PARTICIPANT_QUERY, message.sid],
    getMessageParticipant,
  )
  const partAttrs =
    msgParticipant && (msgParticipant.attributes as unknown as ParticipantAttributes)
  const msgAttrs = message.attributes as unknown as MessageAttributes

  async function getMessageParticipant() {
    try {
      return await message.getParticipant()
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.log('[GET_MSG_PARTICIPANT]', errMessage)
      return null
    }
  }

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
    <div
      className={cn('flex max-w-[75%] items-center gap-2', {
        'flex-row-reverse self-end': isAuthor,
      })}
    >
      <Avatar className="h-6 w-6 self-start rounded-lg">
        <AvatarImage
          className="object-cover"
          alt={`${user?.name}`}
          src={partAttrs?.avatar_url ?? AVATAR_FALLBACK_URL}
        />
        <AvatarFallback className="h-6 w-6 rounded-lg">
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <motion.div
        key={sid}
        animate={{ opacity: 1, x: 0 }}
        initial={{ opacity: 0, x: isAuthor ? 20 : -20 }}
        className={cn('flex flex-col gap-2 rounded-lg border bg-card/60 px-3 py-2 text-sm', {
          'bg-muted/60': !isAuthor,
        })}
      >
        <span className="flex justify-between gap-2">
          {msgAttrs?.gif ?? (isImage && mediaURL) ? (
            <div className="relative h-20 w-28 overflow-hidden rounded-lg">
              {body ?? mediaURL ? (
                <BlurImage src={body ?? mediaURL} />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-muted">
                  <ImageOff className="h-4 w-4" />
                </span>
              )}
            </div>
          ) : (
            <>{body ?? <Skeleton className="h-20 w-28" />}</>
          )}
          {message.author === user?.email && <MessageActions message={message} />}
        </span>
        <div className="flex flex-col text-[10px] leading-4 text-muted-foreground">
          <span>
            {dateCreated && formatDate(dateCreated)} {msgAttrs?.gif && ' (via GIPHY)'}{' '}
            {isImage && hasMedia && rawMedia?.contentType && ` (${rawMedia?.contentType})`}
          </span>
          {!isAuthor && <span>{partAttrs?.nickname ?? author}</span>}
        </div>
      </motion.div>
    </div>
  )
}
