import { useEffect, useRef } from 'react'
import { Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { BiGhost } from 'react-icons/bi'
import { Message } from '@twilio/conversations'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useGlobalContext } from 'context/global'
import ChatBubble from './ChatBubble'
import TypingBubble from './TypingBubble'

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
  const msgsPresent = messages.length > 0
  const { data: session } = useSession()
  const currentUser = session?.user?.email || ''
  const { usersTyping } = useGlobalContext()
  const mainGradient = useColorModeValue(
    'rgba(237, 237, 237, 0.2)',
    'rgba(39, 39, 39, 0.4)',
  )
  const secondGradient = useColorModeValue(
    'rgba(237, 237, 237, 1)',
    'rgba(39, 39, 39, 1)',
  )
  const mainBg = `linear-gradient(180deg, ${mainGradient}, ${secondGradient} 85%),radial-gradient(ellipse at top left, rgba(13, 110, 253, 0.2), transparent 50%),radial-gradient(ellipse at top right, rgba(255, 228, 132, 0.2), transparent 50%),radial-gradient(ellipse at center right, rgba(112, 44, 249, 0.2), transparent 50%),radial-gradient(ellipse at center left, rgba(214, 51, 132, 0.2), transparent 50%)`

  return (
    <Stack
      py={6}
      px={4}
      w="100%"
      bgImage={mainBg}
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
          <AnimatePresence initial={false} exitBeforeEnter>
            <motion.div
              key={usersTyping.length > 0 ? 'animate' : 'exit'}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              exit={{ opacity: 0, x: -80 }}
              initial={{ opacity: 0, x: -80 }}
            >
              {usersTyping.length > 0 && (
                <TypingBubble participants={usersTyping} />
              )}
            </motion.div>
          </AnimatePresence>
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
