import type { Client } from '@twilio/conversations'
import { CreateChatDialog } from './chats/create-chat-dialog'

// import { JoinChatDialog } from './chats/join-chat-dialog'

interface CreateOrJoinChatProps {
  isLoading: boolean
  client: Client
}

export function CreateOrJoinChat({ client, isLoading }: CreateOrJoinChatProps) {
  return (
    <div className="flex items-center gap-2">
      <CreateChatDialog isLoading={isLoading} client={client} />
      {/* <JoinChatDialog isLoading={isLoading} client={client} /> */}
    </div>
  )
}
