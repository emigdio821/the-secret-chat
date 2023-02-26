import {
  Box,
  Icon,
  Text,
  Button,
  VStack,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react'
import { Session } from 'types'
import NextLink from 'next/link'
import useStore from 'store/global'
import Helmet from 'components/Helmet'
import { useRouter } from 'next/router'
import Chat from 'components/convo/Chat'
import { shallow } from 'zustand/shallow'
import useCleanup from 'hooks/useCleanup'
import { useEffect, useCallback } from 'react'
import AppWrapper from 'components/AppWrapper'
import { BiArrowBack, BiGhost } from 'react-icons/bi'
import { getSession, GetSessionParams } from 'next-auth/react'

export default function ChatPage({ session }: { session: Session }) {
  const {
    client,
    addMessage,
    conversation,
    removeMessage,
    addUsersTyping,
    removeUsersTyping,
  } = useStore(
    (state) => ({
      client: state.client,
      addMessage: state.addMessage,
      conversation: state.conversation,
      removeMessage: state.removeMessage,
      addUsersTyping: state.addUsersTyping,
      removeUsersTyping: state.removeUsersTyping,
    }),
    shallow,
  )

  const router = useRouter()
  const cleanUp = useCleanup()
  const bg = useColorModeValue('#EDEDED', '#2d2d2d')
  const btnBg = useColorModeValue('#333', '#262626')

  const updateMessagesIdx = useCallback(
    async (msgIndex: number) => {
      if (conversation) {
        try {
          await conversation.updateLastReadMessageIndex(msgIndex)
        } catch (err) {
          console.error('Failed to update messages count ->', err)
        }
      }
    },
    [conversation],
  )

  useEffect(() => {
    conversation?.on('messageAdded', (message) => {
      const { author, index } = message
      updateMessagesIdx(index)

      if (author !== session.user.email) {
        const notifAudio = new Audio('/sounds/notif_sound.mp3')
        notifAudio.volume = 0.3
        if (notifAudio.paused) notifAudio.play()
      }
      addMessage(message)
    })
    conversation?.on('messageRemoved', (message) => {
      removeMessage(message)
    })
    conversation?.on('typingStarted', (participant) => {
      addUsersTyping(participant)
    })
    conversation?.on('typingEnded', (participant) => {
      removeUsersTyping(participant)
    })
    conversation?.on('removed', () => {
      cleanUp()
      router.push('/')
    })

    return () => {
      conversation?.removeAllListeners()
    }
  }, [
    addMessage,
    addUsersTyping,
    cleanUp,
    conversation,
    removeMessage,
    removeUsersTyping,
    router,
    session.user.email,
    updateMessagesIdx,
  ])

  return (
    <AppWrapper>
      <Helmet title={conversation?.friendlyName || undefined} />
      {conversation && client ? (
        <Chat session={session} />
      ) : (
        <VStack justify="center">
          <Box px={6} bg={bg} w="100%" rounded="xl" py={{ base: 6, sm: 20 }}>
            <Box textAlign="center" w="100%">
              <Icon as={BiGhost} fontSize="5rem" />
              <Heading fontSize="3xl">Chat not found</Heading>
              <Text fontSize="lg">
                Seems like you don&apos;t have an active chat, try again.
              </Text>
              <NextLink href="/">
                <Button
                  mt={10}
                  bg={btnBg}
                  shadow="xl"
                  color="#fafafa"
                  leftIcon={<BiArrowBack />}
                  _hover={{
                    bg: '#444',
                  }}
                  _active={{
                    bg: '#262626',
                  }}
                >
                  Back to home
                </Button>
              </NextLink>
            </Box>
          </Box>
        </VStack>
      )}
    </AppWrapper>
  )
}

export async function getServerSideProps(ctx: GetSessionParams) {
  const session = await getSession(ctx)

  return {
    props: {
      session,
    },
  }
}
