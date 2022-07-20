import { useEffect } from 'react'
import Helmet from 'components/Helmet'
import { Heading, Stack } from '@chakra-ui/react'
import { ModalCallbackProps, Session } from 'types'
import actions from 'context/globalActions'
import AppWrapper from 'components/AppWrapper'
import { useGlobalContext } from 'context/global'
import { getSession, GetSessionParams } from 'next-auth/react'
import { Message } from '@twilio/conversations'
import { getFirstName } from 'utils'
import Reconnect from 'components/Reconnect'
import MyChats from 'components/home/MyChats'
import { useRouter } from 'next/router'
import CreateRoom from 'components/home/CreateRoom'
import JoinRoom from 'components/home/JoinRoom'
import useInitClient from 'hooks/useInitClient'
import useCleanup from 'hooks/useCleanup'

export default function Index({ session }: { session: Session }) {
  const router = useRouter()
  const cleanUp = useCleanup()
  const { newClient, error: clientErr } = useInitClient()
  const { dispatch, client, conversation } = useGlobalContext()

  const handleCreateChatRoom = async ({
    closeModal,
    inputVal: inVal,
    additionalInputVal: descriptionVal,
  }: ModalCallbackProps) => {
    dispatch({
      type: actions.setLoading,
    })
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
        dispatch({
          type: actions.addConversation,
          payload: conver,
        })
        closeModal()
      } catch {
        dispatch({
          type: actions.addError,
          payload: 'Already exists or something went wrong, try again',
        })
      }
    }
    dispatch({
      type: actions.removeLoading,
    })
  }

  const handleJoinChatRoom = async ({
    closeModal,
    inputVal: inVal,
  }: ModalCallbackProps) => {
    dispatch({
      type: actions.setLoading,
    })
    const inputVal = inVal.trim()
    if (inputVal && client) {
      try {
        const conver = await client.getConversationByUniqueName(inputVal)
        dispatch({
          type: actions.addConversation,
          payload: conver,
        })
        closeModal()
        router.push(`/chats/${conver.sid}`)
      } catch {
        dispatch({
          type: actions.addError,
          payload: 'Doesn\'t exist or you don\'t have access to it',
        })
      }
    }
    dispatch({
      type: actions.removeLoading,
    })
  }

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
      conversation.on('messageAdded', (msg: Message) => {
        dispatch({
          type: actions.addMessage,
          payload: msg,
        })
      })
      conversation.on('typingStarted', (participant) => {
        dispatch({
          type: actions.addUsersTyping,
          payload: participant,
        })
      })

      conversation.on('typingEnded', (participant) => {
        dispatch({
          type: actions.removeUsersTyping,
          payload: participant,
        })
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
  }, [cleanUp, client, conversation, dispatch, newClient, router, session])

  useEffect(() => {
    async function updateAttrs() {
      await client.user.updateAttributes({
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
