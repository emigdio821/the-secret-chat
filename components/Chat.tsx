import { useEffect } from 'react'
import { Stack, Heading } from '@chakra-ui/react'
import { useGlobalContext } from 'context/global'
import { getMessages } from 'lib/chat'
import actions from 'context/globalActions'
import Messages from './Messages'
import Participants from './Participants'
import LeaveRoom from './LeaveRoom'
import ChatInput from './ChatInput'
import AddParticipant from './AddParticipant'

export default function Chat() {
  const { dispatch, client, conversation, messages } = useGlobalContext()

  useEffect(() => {
    async function getMsgs() {
      try {
        const msgs = await getMessages(conversation)
        if (msgs.items.length > 0) {
          dispatch({
            type: actions.addMessages,
            payload: msgs.items,
          })
        }
      } catch {
        dispatch({
          type: actions.addError,
          payload: 'Failed to get messages',
        })
      }
    }

    if (conversation.status === 'joined') {
      getMsgs()
    }

    return () => {
      client.removeAllListeners()
    }
  }, [conversation, client, dispatch])

  return (
    <>
      <Stack
        mb={4}
        align="center"
        direction="row"
        justifyContent="space-between"
      >
        <Heading size="lg" noOfLines={{ base: 2, sm: 1 }}>
          {conversation.friendlyName}
        </Heading>
        <Stack alignItems="flex-end" direction={{ base: 'column', sm: 'row' }}>
          <AddParticipant />
          <LeaveRoom />
        </Stack>
      </Stack>
      <Stack
        mt={6}
        minH={400}
        spacing={2}
        direction={{ base: 'column', sm: 'row' }}
        h={{ base: 'calc(100vh - 252px)', sm: 'xl' }}
        maxH={{ base: 'calc(100vh - 252px)', sm: 'xl' }}
      >
        <Participants />
        <Messages messages={messages} />
      </Stack>
      <ChatInput />
    </>
  )
}
