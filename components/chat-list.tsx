import { useEffect, useState } from 'react'
import { type Client, type Conversation, type Paginator } from '@twilio/conversations'

export function ChatList({ client }: { client: Client }) {
  const [convos, setConvos] = useState<Paginator<Conversation>>()
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    async function getConvos() {
      try {
        const convos = await client.getSubscribedConversations()
        // const sortedConvers = sortArray(convers.items as [], 'friendlyName')
        // setConversations(sortedConvers)
        setConvos(convos)
        return convos
      } catch (err) {
        console.error('[GET_CONVOS]', err)
      } finally {
        setLoading(false)
      }
    }

    void getConvos()
  }, [client])

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {convos && convos.items.length > 0 ? (
            <div> Convos will be shown here</div>
          ) : (
            <p>No chats yet</p>
          )}
        </>
      )}
    </div>
  )
}
