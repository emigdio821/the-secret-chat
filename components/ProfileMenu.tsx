import {
  Box,
  Menu,
  Text,
  Stack,
  Avatar,
  VStack,
  Button,
  Spinner,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuButton,
  MenuDivider,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import { BiLogOut, BiChat, BiChevronDown, BiMoon, BiSun } from 'react-icons/bi'
import { signOut, useSession } from 'next-auth/react'

export default function ProfileMenu() {
  const { data } = useSession()
  const { user } = data || {}
  const { toggleColorMode } = useColorMode()
  const SwitchIcon = useColorModeValue(BiMoon, BiSun)
  const themeMode = useColorModeValue('Dark', 'Light')

  return (
    <Box>
      <Menu>
        <MenuButton
          bg="#333"
          as={Button}
          color="#fff"
          disabled={!user}
          borderRadius="full"
          _hover={{
            bg: '#444',
          }}
          _active={{
            bg: '#333',
          }}
          rightIcon={<BiChevronDown size={20} />}
        >
          {!user ? (
            <VStack w="100%" h="100%" bg="#333" justify="center">
              <Spinner size="sm" speed="0.6s" color="#B2ABCC" thickness="4px" />
            </VStack>
          ) : (
            <Stack alignItems="center" direction="row">
              <Avatar w={6} h={6} src={user.image || ''} />
              {user.name && (
                <Text display={{ base: 'none', sm: 'inherit' }}>
                  {user?.name?.split(' ')[0]}
                </Text>
              )}
            </Stack>
          )}
        </MenuButton>
        <MenuList
          px={2}
          boxShadow="xl"
          bg={useColorModeValue('#fafafa', '#141414')}
        >
          <MenuGroup title={user?.name || undefined}>
            <MenuItem
              fontSize="sm"
              borderRadius="md"
              icon={<BiChat size={16} />}
            >
              My chat rooms
            </MenuItem>
          </MenuGroup>
          <MenuItem
            fontSize="sm"
            borderRadius="md"
            onClick={toggleColorMode}
            icon={<SwitchIcon size={16} />}
          >
            <Text>{themeMode} theme</Text>
          </MenuItem>
          <MenuDivider />
          <MenuItem
            fontSize="sm"
            borderRadius="md"
            onClick={() =>
              signOut({
                callbackUrl: '/login',
              })
            }
            icon={<BiLogOut size={16} color="#ff6961 " />}
          >
            <Text color="#ff6961">Logout</Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  )
}
