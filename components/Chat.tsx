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
  const { dispatch, conversation, messages } = useGlobalContext()

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
  }, [conversation, dispatch])

  return (
    <Stack maxH={{ base: 'calc(100vh - 100px )', sm: '2xl' }}>
      <Stack
        mb={4}
        align="center"
        direction="row"
        justifyContent="space-between"
      >
        <Heading size={{ base: 'md', sm: 'lg' }} noOfLines={{ base: 2, sm: 1 }}>
          {conversation.friendlyName}
        </Heading>
        <Stack
          alignItems="flex-end"
          spacing={{ base: 1, sm: 2 }}
          direction={{ base: 'row', sm: 'row' }}
        >
          <AddParticipant />
          <LeaveRoom />
        </Stack>
      </Stack>
      <Stack
        mt={6}
        minH={400}
        spacing={2}
        position="relative"
        direction={{ base: 'column', sm: 'row' }}
      >
        <Participants />
        <Messages messages={messages} />
      </Stack>
      <ChatInput />
    </Stack>
  )
}
