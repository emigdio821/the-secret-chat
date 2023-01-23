import useStore from 'store/global'
import { getMessages } from 'lib/chat'
import { BiGhost } from 'react-icons/bi'
import { useSession } from 'next-auth/react'
import { Button, Stack, Text } from '@chakra-ui/react'
import useBgGradient from 'hooks/useBgGradient'
import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ScrollBottomBtn from 'components/ScrollBottomBtn'
import { Message, Paginator } from '@twilio/conversations'
import TypingBubble from './TypingBubble'
import ChatBubble from './ChatBubble'

function ScrollBottom({ messages }: { messages: Message[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    scrollRef?.current?.scrollIntoView()
  }, [messages])
  return <div ref={scrollRef} />
}

export default function Messages() {
  const bgGradient = useBgGradient()
  const { data: session } = useSession()
  const {
    addError,
    messages,
    isLoading,
    addLoading,
    usersTyping,
    addMessages,
    conversation,
    removeLoading,
  } = useStore()
  const currentUser = session?.user?.email || ''
  const msgsContainer = useRef<HTMLDivElement>(null)
  const firstMsgRef = useRef<HTMLDivElement>(null)
  const [showScrollArrow, setShowScrollArrow] = useState(false)
  const [paginator, setPaginator] = useState<Paginator<Message>>()
  const msgsPresent = messages.length > 0
  let scrollBottom = false
  const firstMessageEl = firstMsgRef.current
  const elContainer = msgsContainer.current
  if (elContainer) {
    const { scrollHeight, scrollTop, clientHeight } = msgsContainer.current
    scrollBottom =
      scrollTop + clientHeight === scrollHeight ||
      messages[messages.length - 1].author === currentUser
  }

  async function getPrevMsgs() {
    if (paginator) {
      try {
        addLoading()
        document.body.style.overflow = 'hidden'
        const prevMsgs = await paginator.prevPage()
        setPaginator(prevMsgs)
        addMessages([...prevMsgs.items, ...messages])
      } catch (error) {
        console.log('Something went wrong ->', error)
      } finally {
        if (firstMessageEl && elContainer) {
          firstMessageEl.scrollIntoView()
        }
        removeLoading()
      }
    }
  }

  useEffect(() => {
    async function getMsgs() {
      try {
        if (conversation) {
          const msgs = await getMessages(conversation)
          const { items } = msgs
          setPaginator(msgs)
          if (msgs.items.length > 0) {
            conversation.updateLastReadMessageIndex(
              items[items.length - 1].index,
            )
            addMessages(msgs.items)
          }
        }
      } catch {
        addError('Failed to get messages')
      }
    }
    if (conversation?.status === 'joined') {
      getMsgs()
    }
  }, [addError, addMessages, conversation])

  async function handleScroll() {
    if (elContainer) {
      const { scrollHeight, scrollTop, clientHeight } = elContainer
      const showScroll = scrollTop + clientHeight <= scrollHeight / 1.2
      if (showScroll && !showScrollArrow) {
        setShowScrollArrow(true)
      }
      if (!showScroll && showScrollArrow) {
        setShowScrollArrow(false)
      }
      // if (scrollTop === 0 && paginator?.hasPrevPage) {
      //   await getPrevMsgs()
      // }
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
      minH={{ base: 'calc(100vh - 320px)', sm: '100%' }}
    >
      <ScrollBottomBtn isVisible={showScrollArrow} container={elContainer} />
      {msgsPresent ? (
        <>
          {paginator?.hasPrevPage && (
            <Stack align="flex-end">
              <Button isLoading={isLoading} onClick={() => getPrevMsgs()}>
                Load more messages
              </Button>
            </Stack>
          )}
          {messages.map((msg: Message, index) => {
            const isAuthor = msg.author === currentUser
            return (
              <motion.div
                key={msg.sid}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                initial={{ opacity: 0, x: isAuthor ? 80 : -80 }}
              >
                <ChatBubble
                  message={msg}
                  ref={index === 0 ? firstMsgRef : undefined}
                />
              </motion.div>
            )
          })}
          <AnimatePresence initial={false} mode="wait">
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
