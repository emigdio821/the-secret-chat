import { useState, useEffect } from 'react'
import {
  Box,
  Input,
  Stack,
  Button,
  Heading,
  FormControl,
} from '@chakra-ui/react'
import { useGlobalContext } from 'context/global'
import { BiLogOut, BiUserPlus } from 'react-icons/bi'
import { sendMessage, leaveRoom, getMessages } from 'lib/chat'
import { Message } from '@twilio/conversations'
import actions from 'context/globalActions'
import Messages from './Messages'
import Participants from './Participants'

export default function Chat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const { dispatch, client, conversation } = useGlobalContext()

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    await sendMessage({ conversation, message })
  }

  async function handleLeaveRoom() {
    const status = await leaveRoom(conversation)
    if (status) {
      dispatch({
        type: actions.removeConversation,
      })
    }
  }

  useEffect(() => {
    async function getMsgs() {
      const msgs = await getMessages(conversation)
      if (msgs) {
        setMessages(msgs.items)
      }
    }

    if (conversation.status === 'joined') {
      getMsgs()
    }

    conversation.on('messageAdded', (msg: Message) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      client.removeAllListeners()
    }
  }, [conversation, client])

  return (
    <>
      <Heading mb={6} noOfLines={2}>
        {conversation.friendlyName}
      </Heading>
      <Stack direction="row" justifyContent="space-between">
        <Button
          // onClick={() => handleAddUser}
          leftIcon={<BiUserPlus size={22} />}
        >
          Add user
        </Button>
        <Button
          onClick={() => handleLeaveRoom()}
          leftIcon={<BiLogOut size={22} />}
        >
          Leave room
        </Button>
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
      <Box my={6}>
        <form onSubmit={handleSendMessage}>
          <Stack direction="row">
            <FormControl isRequired>
              <Input
                value={message}
                placeholder="Message"
                focusBorderColor="#B2ABCC"
                onChange={(e) => setMessage(e.target.value)}
              />
            </FormControl>
            <Button disabled={!message.trim()} type="submit">
              Send
            </Button>
          </Stack>
        </form>
      </Box>
    </>
  )
}
