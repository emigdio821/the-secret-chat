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
      <Heading mb={6} noOfLines={2}>
        {conversation.friendlyName}
      </Heading>
      <Stack direction="row" justifyContent="space-between" mb={6}>
        <AddParticipant />
        <LeaveRoom />
      </Stack>
      <Stack
        mt={6}
        // spacing={0}
        height={500}
        direction={{ base: 'column', sm: 'row' }}
        minHeight={400}
        maxHeight="calc(100vh - 400px)"
      >
        <Participants />
        <Messages messages={messages} />
      </Stack>
      <ChatInput />
    </>
  )
}
