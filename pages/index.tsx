import { useCallback, useEffect, useState } from 'react'
import Chat from 'components/Chat'
import createClient from 'lib/client'
import getAccessToken from 'lib/user'
import Helmet from 'components/Helmet'
import { Heading, Stack } from '@chakra-ui/react'
import { ModalCallbackProps, Session } from 'types'
import actions from 'context/globalActions'
import AppWrapper from 'components/AppWrapper'
import ActionModal from 'components/ActionModal'
import { useGlobalContext } from 'context/global'
import { BiMessageAltAdd, BiMessageAltDots } from 'react-icons/bi'
import { getSession, GetSessionParams } from 'next-auth/react'
import { Message } from '@twilio/conversations'
import { getFirstName } from 'utils'
import Reconnect from 'components/Reconnect'

const joinLbl = 'Join'
const createLbl = 'Create'

export default function Index({ session }: { session: Session }) {
  const { dispatch, client, conversation } = useGlobalContext()
  const [error, setError] = useState<string>('')

  const handleCreateChatRoom = async ({
    onClose,
    inputVal: inVal,
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
        })
        // await conver.add(session.user.email)
        await conver.join()
        dispatch({
          type: actions.addConversation,
          payload: conver,
        })
        onClose()
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

  const initClient = useCallback(async () => {
    try {
      const accessToken = await getAccessToken()
      const twilioClient = await createClient(accessToken)
      dispatch({
        type: actions.addClient,
        payload: twilioClient,
      })
    } catch {
      setError('Failed to create twilio client')
    }
  }, [dispatch])

  const handleJoinChatRoom = async ({
    onClose,
    inputVal,
  }: ModalCallbackProps) => {
    dispatch({
      type: actions.setLoading,
    })
    if (inputVal && client) {
      try {
        const conver = await client.getConversationByUniqueName(inputVal)
        dispatch({
          type: actions.addConversation,
          payload: conver,
        })
        onClose()
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
      initClient()
    }

    if (client) {
      client.on('tokenExpired', () => {
        if (session) {
          initClient()
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
    }

    return () => {
      if (client) {
        client.removeAllListeners()
      }
    }
  }, [client, conversation, dispatch, initClient, session])

  return (
    <AppWrapper>
      <Helmet />
      {!conversation && (
        <>
          <Heading mb={6}>Welcome, {getFirstName(session.user.name)}</Heading>
          <Stack direction={{ base: 'column', sm: 'row' }}>
            <ActionModal
              btnLabel={createLbl}
              BtnIcon={BiMessageAltAdd}
              action={handleCreateChatRoom}
              headerTitle="Create chat room"
            />
            <ActionModal
              btnLabel={joinLbl}
              BtnIcon={BiMessageAltDots}
              action={handleJoinChatRoom}
              headerTitle="Join to a chat room"
            />
          </Stack>
        </>
      )}
      {conversation && client && <Chat />}
      {error && <Reconnect error={error} initClient={initClient} />}
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
