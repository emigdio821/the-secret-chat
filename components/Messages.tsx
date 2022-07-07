import { useEffect, useRef } from 'react'
import { Box, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { BiGhost } from 'react-icons/bi'
import { Message } from '@twilio/conversations'
import { motion } from 'framer-motion'
import ChatBubble from './ChatBubble'

interface MessagesProps {
  messages: Message[]
}

function ScrollBottom({ messages }: MessagesProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    elementRef?.current?.scrollIntoView()
  }, [messages])
  return <div ref={elementRef} />
}

export default function Messages({ messages }: MessagesProps) {
  const mainBg = useColorModeValue('#E8E8E8', '#272727')
  const msgsPresent = messages.length > 0

  return (
    <Stack
      p={6}
      w="100%"
      bg={mainBg}
      height="100%"
      justify={msgsPresent ? 'inherit' : 'center'}
      overflowY="auto"
      borderRadius="md"
    >
      <Box>
        {msgsPresent ? (
          <>
            {messages.map((msg: Message) => (
              <motion.div
                key={`${msg.sid}-${msg.dateCreated}-${msg.author}`}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                initial={{ opacity: 0.8, y: 10 }}
              >
                <ChatBubble message={msg} />
              </motion.div>
            ))}
          </>
        ) : (
          <Stack alignItems="center" justify="center">
            <BiGhost size={40} />
            <Text textAlign="center" fontWeight={600}>
              Boo!, there are no messages yet
            </Text>
          </Stack>
        )}
      </Box>
      <ScrollBottom messages={messages} />
    </Stack>
  )
}
