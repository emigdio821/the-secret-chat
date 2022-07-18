import { useEffect, useState } from 'react'
import {
  Box,
  Menu,
  Stack,
  Button,
  Heading,
  MenuList,
  MenuButton,
  useColorModeValue,
  Text,
} from '@chakra-ui/react'
import { useGlobalContext } from 'context/global'
import { BiChevronDown } from 'react-icons/bi'
import useInitClient from 'hooks/useInitClient'
import { Session } from 'types'
import { isAdmin } from 'utils'
import { Participant } from '@twilio/conversations'
import { AnimatePresence } from 'framer-motion'
import Messages from './Messages'
import Participants from './Participants'
import LeaveRoom from './LeaveRoom'
import ChatInput from './ChatInput'
import AddParticipant from './AddParticipant'
import EditConvo from './EditConvo'
import MotionDiv from '../MotionDiv'

interface ChatProps {
  session: Session
}

export default function Chat({ session }: ChatProps) {
  const { dispatch, conversation, client } = useGlobalContext()
  const btnHover = useColorModeValue('#fff', '#222')
  const btnBg = useColorModeValue('#fafafa', '#262626')
  const { newClient } = useInitClient()
  const [adminPart, setAdminPart] = useState<Participant>()
  // @ts-ignore
  const convoDescription = conversation.attributes.description

  useEffect(() => {
    async function getAdminPart() {
      try {
        const parts = await conversation.getParticipants()
        const admin = parts.find((p) => isAdmin(p))
        setAdminPart(admin)
      } catch (err) {
        console.error('Failed to get admin ->', err)
      }
    }

    if (conversation) {
      getAdminPart()
    }

    if (client) {
      client.on('tokenExpired', () => {
        if (session) {
          newClient()
        }
      })
    }

    return () => {
      client?.removeAllListeners()
    }
  }, [client, conversation, dispatch, newClient, session])

  return (
    <Stack maxH={{ base: 'calc(100vh - 100px )', sm: '2xl' }}>
      <Stack align="center" direction="row" justifyContent="space-between">
        <Stack direction="row" align="center">
          <AnimatePresence
            exitBeforeEnter
            key={conversation.friendlyName || convoDescription}
          >
            <MotionDiv>
              <Stack spacing={0}>
                <Heading noOfLines={1} size={{ base: 'md', sm: 'lg' }}>
                  {conversation.uniqueName}
                </Heading>
                {convoDescription && (
                  <Text opacity={0.8} fontSize="sm">
                    {convoDescription}
                  </Text>
                )}
              </Stack>
            </MotionDiv>
          </AnimatePresence>
        </Stack>
        <Stack
          alignItems="flex-end"
          spacing={{ base: 1, sm: 2 }}
          direction={{ base: 'row', sm: 'row' }}
        >
          {session.user.email === adminPart?.identity && (
            <EditConvo convo={conversation} />
          )}
          <Box>
            <Menu>
              <MenuButton
                bg={btnBg}
                shadow="sm"
                as={Button}
                _hover={{
                  bg: btnHover,
                }}
                _active={{
                  bg: btnHover,
                }}
                size="sm"
                rightIcon={<BiChevronDown />}
              >
                Actions
              </MenuButton>
              <MenuList
                px={2}
                fontSize="sm"
                bg={useColorModeValue('#fafafa', '#262626')}
              >
                <AddParticipant />
                <LeaveRoom />
              </MenuList>
            </Menu>
          </Box>
        </Stack>
      </Stack>
      <Stack
        mt={6}
        position="relative"
        minH={{ base: 400, sm: 600 }}
        direction={{ base: 'column', sm: 'row' }}
      >
        <Participants adminPart={adminPart} />
        <Messages />
      </Stack>
      <ChatInput />
    </Stack>
  )
}
