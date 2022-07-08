import { useEffect, useRef } from 'react'
import { Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { BiGhost } from 'react-icons/bi'
import { Message } from '@twilio/conversations'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import ChatBubble from './ChatBubble'

interface MessagesProps {
  messages: Message[]
}

function ScrollBottom({ messages }: MessagesProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    elementRef?.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages])
  return <div ref={elementRef} />
}

export default function Messages({ messages }: MessagesProps) {
  const mainBg = useColorModeValue('#E8E8E8', '#272727')
  const msgsPresent = messages.length > 0
  const { data: session } = useSession()
  const currentUser = session?.user?.email || ''

  return (
    <Stack
      py={6}
      px={4}
      w="100%"
      bg={mainBg}
      overflowY="auto"
      borderRadius="md"
      overflowX="hidden"
      justify={msgsPresent ? undefined : 'center'}
      h={{ base: 'calc(100vh - 252px)', sm: 'inherit' }}
    >
      {msgsPresent ? (
        <>
          {messages.map((msg: Message) => {
            const isAuthor = msg.author === currentUser
            return (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                key={`${msg.sid}-${msg.dateCreated}`}
                initial={{ opacity: 0, x: isAuthor ? 80 : -80 }}
              >
                <ChatBubble message={msg} />
              </motion.div>
            )
          })}
          <ScrollBottom messages={messages} />
        </>
      ) : (
        <Stack alignItems="center">
          <BiGhost size={40} />
          <Text textAlign="center" fontWeight={600}>
            Boo!, there are no messages yet
          </Text>
        </Stack>
      )}
    </Stack>
  )
}
