import {
  Box,
  Text,
  Stack,
  Button,
  Center,
  useColorModeValue,
  // useColorMode,
  // IconButton,
} from '@chakra-ui/react'
import Logo from 'components/Logo'
import { signIn } from 'next-auth/react'
import { FaGithub } from 'react-icons/fa'
import darkBg from 'assets/images/dark-bg.svg'
import lighBg from 'assets/images/light-bg.svg'
// import { BiMoon, BiSun } from 'react-icons/bi'

export default function Login() {
  const loginBg = useColorModeValue(lighBg, darkBg)
  const btnBg = useColorModeValue('gray.900', 'gray.100')
  const btnColor = useColorModeValue('white', 'black')
  const btnHoverColor = useColorModeValue('gray.700', 'gray.200')
  const btnActiveColor = useColorModeValue('gray.900', 'gray.100')
  // const { toggleColorMode } = useColorMode()
  // const SwitchIcon = useColorModeValue(BiMoon, BiSun)

  return (
    <Center p={6} minH="100vh" bgImage={loginBg}>
      <Box
        w="md"
        rounded="md"
        boxShadow="2xl"
        overflow="hidden"
        bg={useColorModeValue('#fafafa', '#333')}
      >
        <Box p={6}>
          <Stack spacing={0} align="center" mb={5}>
            <Logo bigSize />
            <Text fontSize="xl" fontWeight={600}>
              Start chatting now
            </Text>
          </Stack>
          <Stack align="center">
            <Button
              bg={btnBg}
              color={btnColor}
              borderRadius="md"
              leftIcon={<FaGithub size={20} />}
              onClick={() =>
                signIn('github', {
                  callbackUrl: 'http://192.168.0.224:3000/',
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
            {/* <IconButton
              bg={btnBg}
              p="0 20px"
              color={btnColor}
              borderRadius="full"
              onClick={toggleColorMode}
              aria-label="Switch theme"
              icon={<SwitchIcon size={20} />}
              _hover={{
                bg: btnHoverColor,
              }}
              _active={{
                bg: btnActiveColor,
              }}
            /> */}
          </Stack>
        </Box>
      </Box>
    </Center>
  )
}
