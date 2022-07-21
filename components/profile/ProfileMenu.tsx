import {
  Box,
  Menu,
  Text,
  Stack,
  Avatar,
  VStack,
  Button,
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
import useCleanup from 'hooks/useCleanup'
import { FaGithub } from 'react-icons/fa'
import Spinner from 'components/Spinner'

export default function ProfileMenu() {
  const router = useRouter()
  const { data } = useSession()
  const { user } = data || {}
  const { toggleColorMode } = useColorMode()
  const SwitchIcon = useColorModeValue(BiMoon, BiSun)
  const themeMode = useColorModeValue('Dark', 'Light')
  const cleanUp = useCleanup()
  const btnHover = useColorModeValue('#fff', '#222')
  const btnBg = useColorModeValue('#fafafa', '#262626')
  const btnColor = useColorModeValue('#333', '#fafafa')

  function handleHomeClick() {
    cleanUp()
    router.push('/')
  }

  return (
    <Box>
      <Menu>
        <MenuButton
          px={2}
          bg={btnBg}
          as={Button}
          rounded="full"
          color={btnColor}
          disabled={!user}
          _hover={{
            bg: btnHover,
          }}
          _active={{
            bg: btnHover,
          }}
          rightIcon={<BiChevronDown size={20} />}
        >
          {!user ? (
            <VStack w="100%" h="100%" bg="#333" justify="center">
              <Spinner />
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
          shadow="xl"
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
            as="a"
            rounded="md"
            fontSize="sm"
            target="_blank"
            rel="noopener noreferrer"
            icon={<FaGithub size={16} />}
            href="https://github.com/emigdio821/the-secret-chat"
          >
            <Text>Source</Text>
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
            icon={<BiLogOut size={16} color="#ff6961" />}
          >
            <Text color="#ff6961">Log out</Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  )
}
