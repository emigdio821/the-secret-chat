import { type Client } from '@twilio/conversations'
import { useQuery } from 'react-query'

import { Messages } from '@/components/active-chat/messages'

interface ConvoDescription {
  description?: string
}

interface ActiveChatContainerProps {
  client: Client
  chatId: string
}

export function ActiveChatContainer({ client, chatId }: ActiveChatContainerProps) {
  const { data: chat } = useQuery(['active-chat'], getCurrentChat)
  const attrs = chat?.attributes as unknown as ConvoDescription
  console.log(chat)

  async function getCurrentChat() {
    try {
      const chat = await client.getConversationBySid(chatId)

      return chat
    } catch (err) {
      console.error('[GET_CHATS]', err)
    }
  }

  return (
    <>
      {chat && client && (
        <>
          <h3 className="text-lg font-semibold">{chat.friendlyName}</h3>
          <h5 className="text-sm text-muted-foreground">{attrs.description}</h5>
          <div className="mt-4">
            <Messages chat={chat} />
          </div>
        </>
      )}
    </>
  )
}
