import { type Session } from 'next-auth'

import { CreateChatDialog } from './chats/create-chat-dialog'
import { JoinChatDialog } from './chats/join-chat-dialog'

interface CreateOrJoinChatProps {
  session: Session
  isLoading: boolean
}

export function CreateOrJoinChat({ session, isLoading }: CreateOrJoinChatProps) {
  return (
    <div className="flex items-center gap-2">
      <CreateChatDialog isLoading={isLoading} />
      <JoinChatDialog isLoading={isLoading} />
    </div>
  )
}
