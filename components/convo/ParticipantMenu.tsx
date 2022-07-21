import {
  Box,
  Menu,
  Text,
  Stack,
  Button,
  Avatar,
  MenuList,
  MenuButton,
  useColorModeValue,
  MenuGroup,
  MenuDivider,
  Badge,
} from '@chakra-ui/react'
import { Conversation, Participant } from '@twilio/conversations'
import { BiCheckShield, BiChevronDown, BiInfoCircle } from 'react-icons/bi'
import DeleteParticipant from './DeleteParticipant'

interface ParticipantProps {
  avatar: string
  userImg: string
  adminId: string
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
  adminId,
  identity,
  isAuthor,
  participant,
  conversation,
  friendlyName,
}: ParticipantProps) {
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
          <Stack align="center" direction="row">
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
          <Stack mx={4} mt={2} align="flex-start">
            <Avatar
              size="lg"
              shadow="xl"
              bg="gray.700"
              name={identity || 'Unknown'}
              src={isAuthor ? userImg : avatar}
            />
            {adminId === identity && (
              <Badge
                px={2}
                fontSize="xs"
                rounded="full"
                colorScheme="purple"
                textTransform="capitalize"
              >
                <Stack direction="row" align="center" spacing={1}>
                  <Text>Admin</Text>
                  <BiCheckShield />
                </Stack>
              </Badge>
            )}
          </Stack>
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
                <DeleteParticipant
                  convo={conversation}
                  participant={participant}
                  friendlyName={friendlyName}
                />
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
