import Chat from 'components/Chat'
import createClient from 'lib/client'
import getAccessToken from 'lib/user'
import Helmet from 'components/Helmet'
import { Heading } from '@chakra-ui/react'
import actions from 'context/globalActions'
import { useState, useEffect } from 'react'
import AppWrapper from 'components/AppWrapper'
import ActionModal from 'components/ActionModal'
import { useGlobalContext } from 'context/global'
import { Session, ModalCallbackProps } from 'types'
import { getSession, GetSessionParams } from 'next-auth/react'
import { BiMessageAltAdd, BiMessageAltDots } from 'react-icons/bi'

const joinLbl = 'Join'
const createLbl = 'Create'
const joiningLbl = 'Joining...'
const creatingLbl = 'Creating...'

export default function Index({ session }: { session: Session }) {
  const [createBtnLbl, setCreateBtnLbl] = useState<string>(createLbl)
  const [joinBtnLbl, setJoinBtnLbl] = useState<string>(joinLbl)
  const { dispatch, client, conversation } = useGlobalContext()

  const handleCreateChatRoom = async ({
    onClose,
    inputVal,
    setInputVal,
  }: ModalCallbackProps) => {
    setInputVal('')
    setCreateBtnLbl(creatingLbl)
    if (inputVal && client) {
      try {
        const conver = await client.createConversation({
          uniqueName: inputVal,
          friendlyName: inputVal,
        })
        // await conversation.join()

        conver.add(session.user.email)
        dispatch({
          type: actions.addConversation,
          payload: conver,
        })
        setCreateBtnLbl(createLbl)
        onClose()
      } catch (e) {
        setCreateBtnLbl(createLbl)
        dispatch({
          type: actions.addError,
          payload: `Error creating room: "${inputVal}", please try again`,
        })
      }
    }
  }

  const handleJoinChatRoom = async ({
    onClose,
    inputVal,
    setInputVal,
  }: ModalCallbackProps) => {
    setInputVal('')
    setJoinBtnLbl(joiningLbl)
    if (inputVal && client) {
      try {
        const conver = await client.getConversationByUniqueName(inputVal)
        dispatch({
          type: actions.addConversation,
          payload: conver,
        })
        setJoinBtnLbl(joinLbl)
        onClose()
      } catch {
        setJoinBtnLbl(joinLbl)
        dispatch({
          type: actions.addError,
          payload: `Error joining room: "${inputVal}", please try again`,
        })
      }
    }
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
            btnLabel={createBtnLbl}
            BtnIcon={BiMessageAltAdd}
            action={handleCreateChatRoom}
            headerTitle="Create chat room"
          />
          <ActionModal
            btnLabel={joinBtnLbl}
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

export async function getServerSideProps(ctx: GetSessionParams) {
  const session = await getSession(ctx)

  return {
    props: {
      session,
    },
  }
}
