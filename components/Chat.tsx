import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Text,
  Input,
  Stack,
  Button,
  Heading,
  FormControl,
  useColorModeValue,
} from '@chakra-ui/react'
import { useGlobalContext } from 'context/global'
import { BiGhost, BiLogOut, BiUserPlus } from 'react-icons/bi'
import { sendMessage, leaveRoom, getMessages } from 'lib/chat'
import { Message } from '@twilio/conversations'
import actions from 'context/globalActions'
import ChatBubble from './ChatBubble'

function ScrollBottom({ messages }: { messages: Message[] }) {
  const elementRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    elementRef?.current?.scrollIntoView()
  }, [messages])
  return <div ref={elementRef} />
}

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
      <Heading mb={10} noOfLines={2}>
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
      <Box
        p={6}
        mt={6}
        minHeight={400}
        overflowY="auto"
        borderRadius="md"
        maxHeight="calc(100vh - 400px)"
        bg={useColorModeValue('#fafafa', '#272727')}
      >
        <Box>
          {!messages || messages.length === 0 ? (
            <Stack alignItems="center" justify="center" height={352}>
              <BiGhost size={40} />
              <Text fontWeight={600}>Boo!, there are no messages yet</Text>
            </Stack>
          ) : (
            <>
              {messages.map((msg: Message) => (
                <ChatBubble key={msg.sid} message={msg} />
              ))}
            </>
          )}
        </Box>
        <ScrollBottom messages={messages} />
      </Box>
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
