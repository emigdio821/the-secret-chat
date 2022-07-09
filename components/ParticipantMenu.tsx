import {
  Box,
  Menu,
  Text,
  Stack,
  Button,
  Avatar,
  MenuList,
  MenuItem,
  MenuButton,
  useColorModeValue,
  MenuGroup,
} from '@chakra-ui/react'
import { Conversation, Participant } from '@twilio/conversations'
import { BiCheckShield, BiChevronDown, BiUserX } from 'react-icons/bi'

interface ParticipantProps {
  userImg: string
  isAuthor: boolean
  identity: string | null
  participant: Participant
  conversation: Conversation
}

export default function ParticipantMenu({
  userImg,
  identity,
  isAuthor,
  participant,
  conversation,
}: ParticipantProps) {
  async function handleKickParticipant() {
    try {
      await conversation.removeParticipant(participant)
    } catch (err) {
      console.error('Failed to kick participant ->', err)
    }
  }

  return (
    <Box>
      <Menu>
        <MenuButton
          bg="#333"
          size={{ base: 'sm', sm: 'xs' }}
          maxW={{ base: 140, sm: 120 }}
          as={Button}
          color="#fafafa"
          borderRadius="full"
          _hover={{
            bg: '#444',
          }}
          _active={{
            bg: '#333',
          }}
          rightIcon={<BiChevronDown />}
        >
          <Stack alignItems="center" direction="row">
            <Avatar
              h={4}
              w={4}
              size="xs"
              bg="gray.700"
              name={identity || 'Unknown'}
              src={isAuthor ? userImg : ''}
            />
            <Text fontSize="xs" noOfLines={1} display="block">
              {isAuthor ? 'You' : identity}
            </Text>
          </Stack>
        </MenuButton>
        <MenuList
          px={2}
          boxShadow="xl"
          bg={useColorModeValue('#fafafa', '#262626')}
        >
          <MenuGroup title={identity || undefined} fontSize="xs" noOfLines={1}>
            <MenuItem
              fontSize="xs"
              borderRadius="md"
              onClick={() => handleKickParticipant()}
              icon={<BiUserX size={16} />}
            >
              Kick
            </MenuItem>
            <MenuItem
              fontSize="xs"
              borderRadius="md"
              icon={<BiCheckShield size={16} />}
            >
              Promote to admin
            </MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    </Box>
  )
}
