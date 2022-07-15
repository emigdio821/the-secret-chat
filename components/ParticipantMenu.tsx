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
import { BiChevronDown, BiHash, BiUserX } from 'react-icons/bi'

interface ParticipantProps {
  avatar: string
  userImg: string
  isAdmin: boolean
  isAuthor: boolean
  friendlyName: string
  identity: string | null
  participant: Participant
  conversation: Conversation
}

export default function ParticipantMenu({
  avatar,
  userImg,
  isAdmin,
  identity,
  isAuthor,
  participant,
  conversation,
  friendlyName,
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
          rounded="full"
          color="#fafafa"
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
              src={isAuthor ? userImg : avatar}
            />
            <Text fontSize="xs" noOfLines={1} display="block">
              {isAuthor ? 'You' : friendlyName}
            </Text>
          </Stack>
        </MenuButton>
        <MenuList
          px={2}
          shadow="xl"
          bg={useColorModeValue('#fafafa', '#262626')}
        >
          <MenuGroup title={friendlyName} fontSize="xs" noOfLines={1}>
            <MenuItem rounded="md" fontSize="xs" icon={<BiHash size={16} />}>
              {identity}
            </MenuItem>
            {/* <MenuItem
              rounded="md"
              fontSize="xs"
              icon={<BiCheckShield size={16} />}
            >
              Promote to admin
            </MenuItem> */}
          </MenuGroup>
          {isAdmin && (
            <MenuGroup title="Actions" fontSize="xs" noOfLines={1}>
              <MenuItem
                rounded="md"
                fontSize="xs"
                onClick={() => handleKickParticipant()}
                icon={<BiUserX size={16} />}
              >
                Kick
              </MenuItem>
            </MenuGroup>
          )}
        </MenuList>
      </Menu>
    </Box>
  )
}
