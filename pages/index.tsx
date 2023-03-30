import { useCallback, useEffect, useState } from 'react'
import useStore from 'store/global'
import { getFirstName, sortArray } from 'utils'
import Helmet from 'components/Helmet'
import { useRouter } from 'next/router'
import useCleanup from 'hooks/useCleanup'
import Reconnect from 'components/Reconnect'
import MyChats from 'components/home/MyChats'
import AppWrapper from 'components/AppWrapper'
import JoinRoom from 'components/home/JoinRoom'
import useInitClient from 'hooks/useInitClient'
import { Heading, Stack } from '@chakra-ui/react'
import { ModalCallbackProps, Session } from 'types'
import CreateRoom from 'components/home/CreateRoom'
import { getSession, GetSessionParams } from 'next-auth/react'
import { Conversation } from '@twilio/conversations'

export default function Index({ session }: { session: Session }) {
  const {
    client,
    addError,
    addLoading,
    removeLoading,
    addConversation,
    conversation,
  } = useStore()
  const router = useRouter()
  const cleanUp = useCleanup()
  const { newClient, error: clientErr } = useInitClient()
  const [conversations, setConversations] = useState<Conversation[]>([])

  const getConvos = useCallback(async () => {
    if (client) {
      addLoading()
      try {
        const convers = await client.getSubscribedConversations()
        const sortedConvers = sortArray(convers.items as [], 'friendlyName')
        setConversations(sortedConvers)
      } catch (err) {
        console.error('Failed to retreive conversations ->', err)
      } finally {
        removeLoading()
      }
    }
  }, [addLoading, client, removeLoading])

  const handleCreateChatRoom = async ({
    closeModal,
    inputVal: inVal,
    additionalInputVal: descriptionVal,
  }: ModalCallbackProps) => {
    addLoading()
    const inputVal = inVal.trim()
    if (inputVal && client) {
      try {
        const convo = await client.createConversation({
          uniqueName: inputVal,
          friendlyName: inputVal,
          attributes: {
            description: descriptionVal || '',
          },
        })
        await convo.add(session.user.email)
        // await conver.join()
        // addConversation(conver)
        getConvos()
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

  useEffect(() => {
    if (conversation) {
      cleanUp()
    }
  }, [cleanUp, conversation])

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

    return () => {
      if (client) {
        client.removeAllListeners()
      }
    }
  }, [client, newClient, session])

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
            {client && <MyChats convos={conversations} getConvos={getConvos} />}
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
