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
  MenuDivider,
} from '@chakra-ui/react'
import { Conversation, Participant } from '@twilio/conversations'
import { BiChevronDown, BiInfoCircle, BiUserX } from 'react-icons/bi'

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
          maxW={{ base: 140, sm: 126 }}
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
          bg={useColorModeValue('rgba(250, 250, 250, 0.1)', '#262626')}
        >
          <Stack
            mx={4}
            mt={2}
            mb={3}
            fontSize="md"
            align="center"
            direction="row"
          >
            <Text fontWeight={700}>User info</Text>
            <BiInfoCircle />
          </Stack>
          <Stack fontSize="xs" mx={4} spacing={1}>
            <Text fontWeight={600}>Friendly name</Text>
            <Text m={4} fontSize="xs">
              {friendlyName}
            </Text>
          </Stack>
          <Stack fontSize="xs" mx={4} my={2} spacing={1}>
            <Text fontWeight={600}>Username</Text>
            <Text m={4} fontSize="xs">
              {identity}
            </Text>
          </Stack>
          {isAdmin && (
            <>
              <MenuDivider />
              <MenuGroup title="Actions" fontSize="xs" noOfLines={1}>
                <MenuItem
                  rounded="md"
                  fontSize="xs"
                  icon={<BiUserX size={16} />}
                  onClick={() => handleKickParticipant()}
                >
                  Kick
                </MenuItem>
                {/* WIP */}
                {/* <MenuItem
                  rounded="md"
                  fontSize="xs"
                  icon={<BiCheckShield size={16} />}
                >
                  Promote to admin
                </MenuItem> */}
              </MenuGroup>
            </>
          )}
        </MenuList>
      </Menu>
    </Box>
  )
}
