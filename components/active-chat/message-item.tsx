import { type Message } from '@twilio/conversations'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import { type Session } from 'next-auth'

import { AVATAR_FALLBACK_URL } from '@/lib/constants'
import { cn, formatDate } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface MessageItemProps {
  message: Message
  session: Session
}

export default function MessageItem({ session, message }: MessageItemProps) {
  const sessionUser = session.user
  const { author, sid, body, dateCreated } = message
  const isAuthor = author === sessionUser?.email

  return (
    <div
      className={cn('flex max-w-[75%] items-center gap-2', {
        'flex-row-reverse self-end': isAuthor,
      })}
    >
      <Avatar className="h-6 w-6 self-start rounded-lg">
        <AvatarImage src={sessionUser?.image ?? AVATAR_FALLBACK_URL} alt={`${sessionUser?.name}`} />
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
        {body}
        <div className="flex flex-col text-[10px] leading-4 text-muted-foreground">
          <span>{dateCreated && formatDate(dateCreated)}</span>
          {!isAuthor && <span>{author}</span>}
        </div>
      </motion.div>
    </div>
  )
}
