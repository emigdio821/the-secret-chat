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
import Logo from 'components/Logo'
import { signIn } from 'next-auth/react'
import { FaGithub } from 'react-icons/fa'
import { BiMoon, BiSun } from 'react-icons/bi'

export default function Login() {
  const btnBg = useColorModeValue('gray.900', 'gray.100')
  const btnColor = useColorModeValue('white', 'black')
  const btnHoverColor = useColorModeValue('gray.700', 'gray.200')
  const btnActiveColor = useColorModeValue('gray.900', 'gray.100')
  const { toggleColorMode } = useColorMode()
  const SwitchIcon = useColorModeValue(BiMoon, BiSun)

  return (
    <Center p={6} minH="100vh">
      <Box
        w="md"
        rounded="md"
        boxShadow="xl"
        overflow="hidden"
        bg={useColorModeValue('#E8E8E8', '#141414')}
      >
        <Box p={6}>
          <Stack spacing={0} align="center" mb={5}>
            <Logo bigSize />
            <Text fontSize="xl" fontWeight={600}>
              Start chatting now
            </Text>
          </Stack>
          <Stack justifyContent="center" direction="row">
            <Button
              bg={btnBg}
              color={btnColor}
              borderRadius="md"
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
              color={useColorModeValue('yellow.400', 'purple.800')}
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
            />
          </Stack>
        </Box>
      </Box>
    </Center>
  )
}
