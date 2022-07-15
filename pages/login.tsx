import {
  Box,
  Text,
  Stack,
  Button,
  Center,
  IconButton,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import LoginLogo from 'components/LoginLogo'
import { signIn } from 'next-auth/react'
import { FaGithub } from 'react-icons/fa'
import { BiMoon, BiSun } from 'react-icons/bi'
import useBgGradient from 'hooks/useBgGradient'

export default function Login() {
  const btnColor = '#fafafa'
  const btnHoverColor = '#444'
  const btnActiveColor = '#333'
  const bgGradient = useBgGradient()
  const { toggleColorMode } = useColorMode()
  const btnBg = useColorModeValue('#333', '#262626')
  const SwitchIcon = useColorModeValue(BiMoon, BiSun)

  return (
    <Center p={6} minH="100vh" bgImage={bgGradient}>
      <Box
        w="md"
        shadow="xl"
        rounded="lg"
        overflow="hidden"
        bg={useColorModeValue('#EDEDED', '#202020')}
      >
        <Box p={6}>
          <Stack spacing={0} align="center" mb={5}>
            <LoginLogo />
            <Text fontSize="xl" fontWeight={600}>
              Start chatting now
            </Text>
          </Stack>
          <Stack justifyContent="center" direction="row">
            <Button
              bg={btnBg}
              rounded="md"
              color={btnColor}
              leftIcon={<FaGithub size={20} />}
              onClick={() =>
                signIn('github', {
                  callbackUrl: '/',
                })
              }
              _hover={{
                bg: btnHoverColor,
              }}
              _active={{
                bg: btnActiveColor,
              }}
            >
              Log in with Github
            </Button>
            <IconButton
              bg={btnBg}
              p={[0, 4]}
              rounded="full"
              onClick={toggleColorMode}
              aria-label="Switch theme"
              icon={<SwitchIcon size={20} />}
              color={useColorModeValue('yellow.400', 'purple.200')}
              _hover={{
                bg: btnHoverColor,
              }}
              _active={{
                bg: btnActiveColor,
              }}
            />
          </Stack>
        </Box>
      </Box>
    </Center>
  )
}
