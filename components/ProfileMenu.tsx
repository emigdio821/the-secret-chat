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
  BiUser,
} from 'react-icons/bi'
import NextLink from 'next/link'
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
          rounded="full"
          color="#fafafa"
          disabled={!user}
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
                rounded="md"
                fontSize="sm"
                onClick={() => handleHomeClick()}
                icon={<BiHomeSmile size={16} />}
              >
                <Text>Home</Text>
              </MenuItem>
            )}
            {router.pathname !== '/profile' && (
              <NextLink href="/profile" passHref>
                <MenuItem
                  rounded="md"
                  fontSize="sm"
                  icon={<BiUser size={16} />}
                >
                  My profile
                </MenuItem>
              </NextLink>
            )}
          </MenuGroup>
          <MenuItem
            rounded="md"
            fontSize="sm"
            onClick={toggleColorMode}
            icon={<SwitchIcon size={16} />}
          >
            <Text>{themeMode} theme</Text>
          </MenuItem>
          <MenuDivider />
          <MenuItem
            rounded="md"
            fontSize="sm"
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
