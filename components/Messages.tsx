import { useEffect, useRef, useState } from 'react'
import { Stack, Text } from '@chakra-ui/react'
import { Message } from '@twilio/conversations'
import { AnimatePresence, motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import { useGlobalContext } from 'context/global'
import useBgGradient from 'hooks/useBgGradient'
import { BiGhost } from 'react-icons/bi'
import ChatBubble from './ChatBubble'
import TypingBubble from './TypingBubble'
import ScrollBottomBtn from './ScrollBottomBtn'

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
  const bgGradient = useBgGradient()
  const msgsContainer = useRef<HTMLDivElement>(null)
  const msgsPresent = messages.length > 0
  const { data: session } = useSession()
  const currentUser = session?.user?.email || ''
  const { usersTyping } = useGlobalContext()
  const [showScrollArrow, setShowScrollArrow] = useState(false)
  let scrollBottom = false
  const elContainer = msgsContainer.current
  if (elContainer) {
    const { scrollHeight, scrollTop, clientHeight } = msgsContainer.current
    scrollBottom = scrollTop + clientHeight === scrollHeight
  }

  function handleScroll() {
    if (elContainer) {
      const { scrollHeight, scrollTop, clientHeight } = elContainer
      const showScroll = scrollTop + clientHeight <= scrollHeight / 1.5
      if (showScroll && !showScrollArrow) {
        setShowScrollArrow(true)
      }
      if (!showScroll && showScrollArrow) {
        setShowScrollArrow(false)
      }
    }
  }

  return (
    <Stack
      py={6}
      px={4}
      w="100%"
      rounded="md"
      overflowY="auto"
      overflowX="hidden"
      ref={msgsContainer}
      bgImage={bgGradient}
      onScroll={() => handleScroll()}
      justify={msgsPresent ? undefined : 'center'}
    >
      <ScrollBottomBtn isVisible={showScrollArrow} container={elContainer} />
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
