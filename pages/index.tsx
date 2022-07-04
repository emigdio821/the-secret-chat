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
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { BiRightArrowAlt } from 'react-icons/bi'
import getAccessToken from 'lib/user'
import createClient from 'lib/client'
import Conversation from 'components/Conversation'

export default function Index() {
  const [client, setClient] = useState<any>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [roomName, setRoomName] = useState<string>('')
  const [activeConver, setActiveConver] = useState<any>(null)

  async function handleCreateChatRoom() {
    const conversation = await client.createConversation({
      friendlyName: roomName,
    })
    setActiveConver(conversation)
    onClose()
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
          </ModalBody>

          <ModalFooter>
            <Button size="sm" colorScheme="gray" mr={2} onClick={onClose}>
              Close
            </Button>
            <Button
              size="sm"
              onClick={() => handleCreateChatRoom()}
              disabled={!roomName}
              rightIcon={<BiRightArrowAlt size={16} />}
            >
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Helmet />
      <Heading mb={6}>Welcome</Heading>
      <Button onClick={onOpen} rightIcon={<BiRightArrowAlt size={20} />}>
        Create a chat room
      </Button>
      {activeConver && (
        <Conversation client={client} activeConversation={activeConver} />
      )}
    </AppWrapper>
  )
}

export async function getServerSideProps(ctx: GetSessionParams | undefined) {
  const session = await getSession(ctx)

  return {
    props: {
      session,
    },
  }
}
