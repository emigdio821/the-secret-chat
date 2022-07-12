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
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scrollRef?.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages])
  return <div ref={scrollRef} />
}

export default function Messages({ messages }: MessagesProps) {
  const msgsContainer = useRef<HTMLDivElement>(null)
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

  let scrollBottom = false
  const elContainer = msgsContainer.current
  if (elContainer) {
    const { scrollHeight, scrollTop, clientHeight } = msgsContainer.current
    scrollBottom = scrollTop + clientHeight === scrollHeight
  }

  return (
    <Stack
      py={6}
      px={4}
      w="100%"
      ref={msgsContainer}
      bgImage={mainBg}
      overflowY="auto"
      borderRadius="md"
      overflowX="hidden"
      h={{ base: 'calc(100vh - 100px )', sm: 'inherit' }}
      justify={msgsPresent ? undefined : 'center'}
    >
      {msgsPresent ? (
        <>
          {messages.map((msg: Message) => {
            const isAuthor = msg.author === currentUser
            return (
              <motion.div
                key={msg.sid}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
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
              exit={{ opacity: 0, x: -10 }}
              initial={{ opacity: 0, x: -10 }}
              style={{
                bottom: 0,
                position: 'absolute',
              }}
            >
              {usersTyping.length > 0 && (
                <TypingBubble participants={usersTyping} />
              )}
            </motion.div>
          </AnimatePresence>
          {scrollBottom && <ScrollBottom messages={messages} />}
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
