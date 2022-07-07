import { useEffect } from 'react'
import Chat from 'components/Chat'
import createClient from 'lib/client'
import getAccessToken from 'lib/user'
import Helmet from 'components/Helmet'
import { Heading } from '@chakra-ui/react'
import actions from 'context/globalActions'
import AppWrapper from 'components/AppWrapper'
import ActionModal from 'components/ActionModal'
import { useGlobalContext } from 'context/global'
import { ModalCallbackProps } from 'types'
import { BiMessageAltAdd, BiMessageAltDots } from 'react-icons/bi'

const joinLbl = 'Join'
const createLbl = 'Create'

export default function Index() {
  const { dispatch, client, conversation } = useGlobalContext()

  const handleCreateChatRoom = async ({
    onClose,
    inputVal,
    setInputVal,
  }: ModalCallbackProps) => {
    setInputVal('')
    dispatch({
      type: actions.addLoading,
    })
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
          payload: `Room "${inputVal}" already exists or something went wrong, try again`,
        })
      }
    }
    dispatch({
      type: actions.removeLoading,
    })
  }

  const handleJoinChatRoom = async ({
    onClose,
    inputVal,
    setInputVal,
  }: ModalCallbackProps) => {
    setInputVal('')
    dispatch({
      type: actions.addLoading,
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
          payload: `Room "${inputVal}" doesn't exist or you don't have access to it`,
        })
      }
    }
    dispatch({
      type: actions.removeLoading,
    })
  }

  useEffect(() => {
    async function initClient() {
      const accessToken = await getAccessToken()
      const twilioClient = await createClient(accessToken)
      dispatch({
        type: actions.addClient,
        payload: twilioClient,
      })
    }

    if (!client) {
      initClient()
    }

    return () => {
      if (client) {
        client.removeAllListeners()
      }
    }
  }, [client, dispatch])

  return (
    <AppWrapper>
      <Helmet />
      {!conversation && (
        <>
          <Heading mb={6}>Welcome</Heading>
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
        </>
      )}
      {conversation && client && <Chat />}
    </AppWrapper>
  )
}
