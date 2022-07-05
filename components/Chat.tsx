import React, { Dispatch, SetStateAction, useEffect } from 'react'
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
import { Client, Conversation as Conver, Message } from '@twilio/conversations'
import { BiGhost, BiLogOut } from 'react-icons/bi'
import { sendMessage, leaveRoom, getMessages } from 'lib/chat'
import ChatBubble from './ChatBubble'

interface ChatProps {
  client: Client
  conversation: Conver
  callback: Dispatch<SetStateAction<Conver | undefined>>
}

function ScrollBottom({ messages }: { messages: Message[] }) {
  const elementRef = React.useRef<HTMLDivElement>(null)
  useEffect(() => {
    elementRef?.current?.scrollIntoView()
  }, [messages])
  return <div ref={elementRef} />
}

export default function Chat({ client, conversation, callback }: ChatProps) {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [message, setMessage] = React.useState('')

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    await sendMessage({ conversation, message })
  }

  async function handleLeaveRoom() {
    const status = await leaveRoom(conversation)
    if (status) {
      callback(undefined)
    }
  }

  React.useEffect(() => {
    async function getMsgs() {
      const msg = await getMessages(conversation)
      setMessages(msg.items)
    }

    if (conversation.status === 'joined') {
      getMsgs()
    }

    conversation.on('messageAdded', (msg: Message) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      client?.removeAllListeners()
    }
  }, [conversation, client])

  return (
    <>
      <Heading my={10}>Room: {conversation.friendlyName}</Heading>
      <Button onClick={() => handleLeaveRoom()} leftIcon={<BiLogOut />}>
        Leave room
      </Button>
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
                placeholder="Message..."
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
