import useStore from 'store/global'
import { getFirstName } from 'utils'
import Helmet from 'components/Helmet'
import { useRouter } from 'next/router'
import useCleanup from 'hooks/useCleanup'
import Reconnect from 'components/Reconnect'
import MyChats from 'components/home/MyChats'
import { useEffect, useCallback } from 'react'
import AppWrapper from 'components/AppWrapper'
import JoinRoom from 'components/home/JoinRoom'
import useInitClient from 'hooks/useInitClient'
import { Heading, Stack } from '@chakra-ui/react'
import { ModalCallbackProps, Session } from 'types'
import CreateRoom from 'components/home/CreateRoom'
import { getSession, GetSessionParams } from 'next-auth/react'

export default function Index({ session }: { session: Session }) {
  const {
    client,
    addError,
    addLoading,
    addMessage,
    conversation,
    removeMessage,
    removeLoading,
    addUsersTyping,
    addConversation,
    removeUsersTyping,
  } = useStore()
  const router = useRouter()
  const cleanUp = useCleanup()
  const { newClient, error: clientErr } = useInitClient()

  const handleCreateChatRoom = async ({
    closeModal,
    inputVal: inVal,
    additionalInputVal: descriptionVal,
  }: ModalCallbackProps) => {
    addLoading()
    const inputVal = inVal.trim()
    if (inputVal && client) {
      try {
        const conver = await client.createConversation({
          uniqueName: inputVal,
          friendlyName: inputVal,
          attributes: {
            description: descriptionVal || '',
          },
        })
        // await conver.add(session.user.email)
        await conver.join()
        addConversation(conver)
        closeModal()
      } catch {
        addError('Already exists or something went wrong, try again')
      }
    }
    removeLoading()
  }

  const handleJoinChatRoom = async ({
    closeModal,
    inputVal: inVal,
  }: ModalCallbackProps) => {
    addLoading()
    const inputVal = inVal.trim()
    if (inputVal && client) {
      try {
        const conver = await client.getConversationByUniqueName(inputVal)
        addConversation(conver)
        closeModal()
        router.push(`/chats/${conver.sid}`)
      } catch {
        addError('Doesn\'t exist or you don\'t have access to it')
      }
    }
    removeLoading()
  }

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
    if (!client) {
      newClient()
    }

    if (client) {
      client.on('tokenExpired', () => {
        if (session) {
          newClient()
        }
      })
    }

    if (conversation) {
      conversation.on('messageAdded', (message) => {
        const { author, index } = message
        updateMessagesIdx(index)

        if (author !== session.user.email) {
          const notifAudio = new Audio('/sounds/notif_sound.mp3')
          notifAudio.volume = 0.3
          if (notifAudio.paused) notifAudio.play()
        }
        addMessage(message)
      })
      conversation.on('messageRemoved', (message) => {
        removeMessage(message)
      })
      conversation.on('typingStarted', (participant) => {
        addUsersTyping(participant)
      })
      conversation.on('typingEnded', (participant) => {
        removeUsersTyping(participant)
      })
      conversation.on('removed', () => {
        cleanUp()
        router.push('/')
      })
    }

    return () => {
      if (client) {
        client.removeAllListeners()
      }
    }
  }, [
    client,
    router,
    cleanUp,
    session,
    newClient,
    addMessage,
    conversation,
    removeMessage,
    addUsersTyping,
    removeUsersTyping,
    updateMessagesIdx,
  ])

  useEffect(() => {
    async function updateAttrs() {
      await client?.user.updateAttributes({
        avatar: session.user.image,
        friendlyName: client.user.friendlyName,
      })
    }
    if (session && client) {
      updateAttrs()
    }
  }, [client, session])

  return (
    <AppWrapper>
      <Helmet />
      <>
        <Heading as="h2" size={{ base: 'md', sm: 'lg' }} mb={6}>
          Welcome, {getFirstName(session.user.name)}
        </Heading>
        {clientErr ? (
          <Reconnect error={clientErr} initClient={newClient} />
        ) : (
          <>
            <Stack direction={{ base: 'column', sm: 'row' }} mb={12}>
              <CreateRoom action={handleCreateChatRoom} />
              <JoinRoom action={handleJoinChatRoom} />
            </Stack>
            {client && <MyChats />}
          </>
        )}
      </>
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
