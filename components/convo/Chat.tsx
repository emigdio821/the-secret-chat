import { useEffect } from 'react'
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
import { getMessages } from 'lib/chat'
import actions from 'context/globalActions'
import { BiChevronDown } from 'react-icons/bi'
import Messages from './Messages'
import Participants from './Participants'
import LeaveRoom from './LeaveRoom'
import ChatInput from './ChatInput'
import AddParticipant from './AddParticipant'
import EditConvo from './EditConvo'

export default function Chat() {
  const { dispatch, conversation, messages } = useGlobalContext()
  const btnHover = useColorModeValue('#fff', '#222')
  const btnBg = useColorModeValue('#fafafa', '#262626')
  // @ts-ignore
  const convoDescription = conversation.attributes.description

  useEffect(() => {
    async function getMsgs() {
      try {
        const msgs = await getMessages(conversation)
        if (msgs.items.length > 0) {
          dispatch({
            type: actions.addMessages,
            payload: msgs.items,
          })
        }
      } catch {
        dispatch({
          type: actions.addError,
          payload: 'Failed to get messages',
        })
      }
    }

    if (conversation.status === 'joined') {
      getMsgs()
    }
  }, [conversation, dispatch])

  return (
    <Stack maxH={{ base: 'calc(100vh - 100px )', sm: '2xl' }}>
      <Stack align="center" direction="row" justifyContent="space-between">
        <Stack direction="row" align="center">
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
        </Stack>
        <Stack
          alignItems="flex-end"
          spacing={{ base: 1, sm: 2 }}
          direction={{ base: 'row', sm: 'row' }}
        >
          <EditConvo convo={conversation} />
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
        <Participants />
        <Messages messages={messages} />
      </Stack>
      <ChatInput />
    </Stack>
  )
}
