import {
  Box,
  Icon,
  Text,
  Button,
  VStack,
  Heading,
  Spinner,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react'
import { Session } from 'types'
import NextLink from 'next/link'
import useStore from 'store/global'
import Helmet from 'components/Helmet'
import Chat from 'components/convo/Chat'
import { shallow } from 'zustand/shallow'
import { getSession } from 'next-auth/react'
import AppWrapper from 'components/AppWrapper'
import useInitClient from 'hooks/useInitClient'
import { GetServerSidePropsContext } from 'next'
import { useEffect, useCallback, useRef } from 'react'
import { BiArrowBack, BiGhost } from 'react-icons/bi'

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
    removeConversation,
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
      removeConversation: state.removeConversation,
    }),
    shallow,
  )
  const toast = useToast()
  const notificationAudio = useRef<HTMLAudioElement>(null)
  const { newClient } = useInitClient()
  const bg = useColorModeValue('#ededed', '#2d2d2d')
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
          position: 'top',
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
        if (notificationAudio.current) {
          notificationAudio.current.play()
        }
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
        position: 'top',
        title: 'Notification',
        description: `${participant.identity} has joined the chat room`,
      })
    })
    conversation?.on('participantLeft', (participant) => {
      if (participant.identity === client?.user.identity) {
        return
      }

      toast({
        status: 'info',
        isClosable: true,
        position: 'top',
        title: 'Notification',
        description: `${participant.identity} has left the chat room`,
      })
    })
    conversation?.on('removed', () => {
      toast({
        status: 'info',
        isClosable: true,
        position: 'top',
        title: 'Notification',
        description:
          'The room was removed by the admin or you were removed from it',
      })
      removeConversation()
    })

    return () => {
      conversation?.removeAllListeners()
    }
  }, [
    client,
    toast,
    addMessage,
    addUsersTyping,
    conversation,
    removeMessage,
    removeUsersTyping,
    session.user.email,
    updateMessagesIdx,
    removeConversation,
  ])

  return (
    <AppWrapper>
      <Helmet title={conversation?.friendlyName || undefined} />
      <audio ref={notificationAudio} src="/sounds/notif_sound.mp3" hidden>
        <track kind="captions" />
      </audio>
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
