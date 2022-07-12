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
import { getFirstName } from 'utils'
import { signOut, useSession } from 'next-auth/react'
import {
  BiSun,
  BiMoon,
  BiLogOut,
  BiHomeSmile,
  BiChevronDown,
} from 'react-icons/bi'
import { useRouter } from 'next/router'
import actions from 'context/globalActions'
import { useGlobalContext } from 'context/global'
import useCleanup from 'hooks/useCleanup'

export default function ProfileMenu() {
  const router = useRouter()
  const { data } = useSession()
  const { user } = data || {}
  const { toggleColorMode } = useColorMode()
  const { dispatch } = useGlobalContext()
  const SwitchIcon = useColorModeValue(BiMoon, BiSun)
  const themeMode = useColorModeValue('Dark', 'Light')
  const cleanUp = useCleanup()

  function handleHomeClick() {
    cleanUp()
    dispatch({
      type: actions.removeConversation,
    })
    router.push('/')
  }

  return (
    <Box>
      <Menu>
        <MenuButton
          px={2}
          bg="#333"
          as={Button}
          color="#fafafa"
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
              <Avatar
                size="xs"
                bg="gray.900"
                src={user.image || ''}
                name={user.name || ''}
              />
              {user.name && (
                <Text noOfLines={1} display={{ base: 'none ', sm: 'inherit' }}>
                  {getFirstName(user.name)}
                </Text>
              )}
            </Stack>
          )}
        </MenuButton>
        <MenuList
          px={2}
          boxShadow="xl"
          bg={useColorModeValue('#fafafa', '#262626')}
        >
          <MenuGroup title={user?.name || undefined}>
            {router.pathname !== '/' && (
              <MenuItem
                fontSize="sm"
                onClick={() => handleHomeClick()}
                borderRadius="md"
                icon={<BiHomeSmile size={16} />}
              >
                <Text>Home</Text>
              </MenuItem>
            )}
            {/* <MenuItem
              fontSize="sm"
              borderRadius="md"
              icon={<BiChat size={16} />}
            >
              My chat rooms
            </MenuItem> */}
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
            <Text color="#ff6961">Log out</Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  )
}
