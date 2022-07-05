import Helmet from 'components/Helmet'
import { getSession, GetSessionParams } from 'next-auth/react'
import AppWrapper from 'components/AppWrapper'
import {
  Button,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { BiRightArrowAlt } from 'react-icons/bi'
import getAccessToken from 'lib/user'
import createClient from 'lib/client'
import { Client, Conversation as Conver } from '@twilio/conversations'
import Chat from 'components/Chat'
import { Session } from 'types'

export default function Index({ session }: { session: Session }) {
  const [client, setClient] = useState<Client>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure()
  const [roomName, setRoomName] = useState<string>('')
  const [activeConver, setActiveConver] = useState<Conver>()
  const [btnStatus, setBtnStatus] = useState<string>('Create')
  const [btnStatus2, setBtnStatus2] = useState<string>('Join')
  const [error, setError] = useState<string>('')

  async function handleCreateChatRoom() {
    setRoomName('')
    setBtnStatus('Creating...')
    const conversation = await client?.createConversation({
      uniqueName: roomName,
      friendlyName: roomName,
    })
    if (!conversation) {
      setBtnStatus('Create')
      setError(`Error creating room: "${roomName}", please try again`)
      return
    }
    conversation.add(session.user.email)
    setActiveConver(conversation)
    setBtnStatus('Create')
    onClose()
  }

  async function handleJoinChatRoom() {
    setRoomName('')
    setBtnStatus2('Joining...')
    const conversation = await client?.getConversationByUniqueName(roomName)
    if (!conversation) {
      setBtnStatus2('Join')
      setError(`Error joining room: "${roomName}", please try again`)
      return
    }
    setActiveConver(conversation)
    setBtnStatus2('Create')
    onClose2()
  }

  useEffect(() => {
    async function initClient() {
      const accessToken = await getAccessToken()
      const twilioClient = await createClient(accessToken)
      setClient(twilioClient)
    }

    if (!client) {
      initClient()
    }

    return () => {
      client?.removeAllListeners()
    }
  }, [client])

  return (
    <AppWrapper>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
        motionPreset="slideInBottom"
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg={useColorModeValue('#fafafa', '#333')}>
          <ModalHeader>Create chat room</ModalHeader>
          <ModalBody>
            <Input
              size="md"
              value={roomName}
              placeholder="Room name"
              onChange={(e) => setRoomName(e.target.value)}
            />
            {error && <Text color="red.500">{error}</Text>}
          </ModalBody>
          <ModalFooter>
            <Button size="sm" colorScheme="gray" mr={2} onClick={onClose}>
              Close
            </Button>
            <Button
              size="sm"
              disabled={!roomName}
              onClick={() => handleCreateChatRoom()}
              rightIcon={<BiRightArrowAlt size={16} />}
            >
              {btnStatus}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isOpen2}
        onClose={onClose2}
        closeOnOverlayClick={false}
        motionPreset="slideInBottom"
      >
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg={useColorModeValue('#fafafa', '#333')}>
          <ModalHeader>Join to chat room</ModalHeader>
          <ModalBody>
            <Input
              size="md"
              value={roomName}
              placeholder="Room name"
              onChange={(e) => setRoomName(e.target.value)}
            />
            {error && <Text color="red.500">{error}</Text>}
          </ModalBody>

          <ModalFooter>
            <Button size="sm" colorScheme="gray" mr={2} onClick={onClose2}>
              Close
            </Button>
            <Button
              size="sm"
              disabled={!roomName}
              onClick={() => handleJoinChatRoom()}
              rightIcon={<BiRightArrowAlt size={16} />}
            >
              {btnStatus2}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Helmet />
      <Heading mb={6}>Welcome</Heading>
      {!activeConver && (
        <>
          <Button onClick={onOpen} rightIcon={<BiRightArrowAlt size={20} />}>
            Create a chat room
          </Button>
          <Button onClick={onOpen2} rightIcon={<BiRightArrowAlt size={20} />}>
            Join to a chat room
          </Button>
        </>
      )}
      {activeConver && client && (
        <Chat
          client={client}
          callback={setActiveConver}
          conversation={activeConver}
        />
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
