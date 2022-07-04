import React from 'react'
import {
  Box,
  Text,
  Input,
  Stack,
  Button,
  Avatar,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react'

import { useSession } from 'next-auth/react'

interface Message {
  body: string
  author: string
  sid: string
}

export default function Conversation({ client, activeConversation }: any) {
  const [messages, setMessages] = React.useState<Message[]>([])
  const [message, setMessage] = React.useState('')
  const mainMsgBg = useColorModeValue('gray.300', '#272727')
  const secondaryMsgBg = useColorModeValue('gray.100', '#141414')
  const { data } = useSession()

  async function handleSendMessage() {
    if (activeConversation.status === 'joined') {
      await activeConversation.sendMessage(message)
      setMessage('')
    } else {
      await activeConversation.join()
      await activeConversation.sendMessage(message)
      setMessage('')
    }
  }

  React.useEffect(() => {
    activeConversation.on('messageAdded', (msg: Message) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      client?.removeAllListeners()
    }
  }, [activeConversation, client])

  return (
    <Box mt={6}>
      <Heading>Room: {activeConversation.friendlyName}</Heading>
      <Box>
        {messages.map((msg: Message) => {
          if (msg.author !== client.user.state.identity) {
            return (
              <Stack
                py={1}
                spacing={2}
                key={msg.sid}
                alignItems="center"
                direction="row-reverse"
              >
                <Avatar
                  size="xs"
                  bg="blue.300"
                  src={data?.user?.image || ''}
                  name="Computer"
                />
                <Stack
                  p={2}
                  minW={100}
                  maxW={350}
                  spacing={2}
                  bg={mainMsgBg}
                  borderRadius="md"
                >
                  <Text>{msg.body}</Text>
                </Stack>
              </Stack>
            )
          }
          return (
            <Stack
              py={1}
              spacing={2}
              key={msg.sid}
              direction="row"
              alignItems="center"
            >
              <Avatar
                size="xs"
                bg="blue.300"
                src={data?.user?.image || ''}
                name="Computer"
              />
              <Stack
                p={2}
                minW={100}
                maxW={350}
                spacing={2}
                borderRadius="md"
                bg={secondaryMsgBg}
              >
                <Text>{msg.body}</Text>
              </Stack>
            </Stack>
          )
        })}
      </Box>
      <Box mt={2}>
        <Input
          value={message}
          placeholder="Message..."
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button onClick={() => handleSendMessage()}>Send!</Button>
      </Box>
    </Box>
  )
}
