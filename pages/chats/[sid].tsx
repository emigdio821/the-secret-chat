import {
  Box,
  Icon,
  Text,
  Button,
  VStack,
  Heading,
  useToast,
  useColorModeValue,
  Spinner,
} from '@chakra-ui/react'
import { Session } from 'types'
import NextLink from 'next/link'
import useStore from 'store/global'
import Helmet from 'components/Helmet'
import { useRouter } from 'next/router'
import Chat from 'components/convo/Chat'
import { shallow } from 'zustand/shallow'
import useCleanup from 'hooks/useCleanup'
import { getSession } from 'next-auth/react'
import { useEffect, useCallback } from 'react'
import AppWrapper from 'components/AppWrapper'
import { BiArrowBack, BiGhost } from 'react-icons/bi'
import { GetServerSidePropsContext } from 'next'
import useInitClient from 'hooks/useInitClient'

interface ChatPageProps {
  session: Session
  sid: string | null
}

export default function ChatPage({ session, sid }: ChatPageProps) {
  const {
    client,
    isLoading,
    addLoading,
    addMessage,
    conversation,
    removeLoading,
    removeMessage,
    addUsersTyping,
    addConversation,
    removeUsersTyping,
  } = useStore(
    (state) => ({
      client: state.client,
      isLoading: state.isLoading,
      addLoading: state.addLoading,
      addMessage: state.addMessage,
      conversation: state.conversation,
      removeMessage: state.removeMessage,
      removeLoading: state.removeLoading,
      addUsersTyping: state.addUsersTyping,
      addConversation: state.addConversation,
      removeUsersTyping: state.removeUsersTyping,
    }),
    shallow,
  )
  const toast = useToast()
  const router = useRouter()
  const cleanUp = useCleanup()
  const { newClient } = useInitClient()
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

  const getConversation = useCallback(async () => {
    if (sid) {
      addLoading()
      try {
        const convo = await client?.getConversationBySid(sid)
        if (convo) {
          addConversation(convo)
        } else {
          throw new Error('Conversation not found')
        }
      } catch (err) {
        toast({
          title: 'Error',
          status: 'error',
          isClosable: true,
          position: 'top-right',
          description: 'Failed to retrieve this conversation, try again',
        })
      } finally {
        removeLoading()
      }
    }
  }, [sid, client, addConversation, toast, addLoading, removeLoading])

  useEffect(() => {
    if (client) {
      getConversation()
    } else {
      newClient()
    }

    return () => {
      client?.removeAllListeners()
    }
  }, [client, getConversation, newClient])

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
    conversation?.on('participantJoined', (participant) => {
      toast({
        status: 'info',
        isClosable: true,
        position: 'top-right',
        title: 'Notification',
        description: `${participant.identity} has joined the chat room`,
      })
    })
    conversation?.on('participantLeft', (participant) => {
      toast({
        status: 'info',
        isClosable: true,
        position: 'top-right',
        title: 'Notification',
        description: `${participant.identity} has left the chat room`,
      })
    })
    conversation?.on('removed', () => {
      cleanUp()
      toast({
        status: 'info',
        isClosable: true,
        position: 'top-right',
        title: 'Notification',
        description:
          'The room was removed by the admin or you were removed from it',
      })
      router.push('/')
    })

    return () => {
      conversation?.removeAllListeners()
    }
  }, [
    toast,
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
            <VStack textAlign="center" w="100%">
              <Icon as={BiGhost} fontSize="5rem" />
              {isLoading ? (
                <Spinner />
              ) : (
                <>
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
                </>
              )}
            </VStack>
          </Box>
        </VStack>
      )}
    </AppWrapper>
  )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getSession(ctx)
  const { params } = ctx

  return {
    props: {
      session,
      sid: params?.sid || null,
    },
  }
}
