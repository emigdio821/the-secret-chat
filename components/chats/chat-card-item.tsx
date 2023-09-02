import NextLink from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { type Conversation } from '@twilio/conversations'
import { motion } from 'framer-motion'
import { MessageSquare, Shield, User } from 'lucide-react'
import { type Session } from 'next-auth'

import { UNREAD_MSGS_QUERY } from '@/lib/constants'
import { buttonVariants } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { ChatCardActions } from './chat-card-actions'

interface ChatCardItemProps {
  chat: Conversation
  session: Session
}

interface ConvoDescription {
  description?: string
}

export function ChatCardItem({ chat, session }: ChatCardItemProps) {
  const { createdBy } = chat
  const attrs = chat.attributes as unknown as ConvoDescription
  const partsCount = chat._participants.size
  const isOwner = session.user?.email === createdBy
  const { data: unreadMsgs } = useQuery([UNREAD_MSGS_QUERY, chat.sid], getUnreadMessages)

  async function getUnreadMessages() {
    try {
      return await chat.getUnreadMessagesCount()
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.log('[UNREAD_MSGS_QUERY]', errMessage)
      return null
    }
  }

  return (
    <Card key={chat.sid} className="flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <span className="relative flex items-center gap-1">
            <CardTitle className="text-base">{chat.friendlyName ?? chat.uniqueName}</CardTitle>
            {unreadMsgs && unreadMsgs > 0 ? (
              <span className="flex items-center gap-1 rounded-lg border px-1 py-px text-xs font-semibold text-muted-foreground">
                <MessageSquare className="h-3 w-3" />
                <motion.span
                  key={unreadMsgs}
                  className="text-xs"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {unreadMsgs}
                </motion.span>
              </span>
            ) : null}
          </span>
          {isOwner && <ChatCardActions chat={chat} />}
        </div>
        {attrs.description && <CardDescription>{attrs.description}</CardDescription>}
      </CardHeader>
      <CardFooter className="mt-auto justify-between">
        <div>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="h-3 w-3" />
            {partsCount}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            {createdBy}
          </span>
        </div>
        <NextLink
          // as={`/chat/${chat.sid}`}
          className={buttonVariants({ variant: 'outline' })}
          href={`/chat/${chat.sid}?name=${chat.friendlyName ?? chat.uniqueName}`}
        >
          Join
        </NextLink>
      </CardFooter>
    </Card>
  )
}
