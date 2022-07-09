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
  const btnColor = '#fafafa'
  const btnHoverColor = '#444'
  const btnActiveColor = '#333'
  const { toggleColorMode } = useColorMode()
  const btnBg = useColorModeValue('#333', '#262626')
  const SwitchIcon = useColorModeValue(BiMoon, BiSun)
  const mainGradient = useColorModeValue(
    'rgba(255, 255, 255, 0.1)',
    'rgba(51, 51, 51, 0.6)',
  )
  const secondGradient = useColorModeValue(
    'rgba(255, 255, 255, 1)',
    'rgba(51, 51, 51, 1)',
  )
  const mainBg = `linear-gradient(180deg, ${mainGradient}, ${secondGradient} 85%),radial-gradient(ellipse at top left, rgba(13, 110, 253, 0.5), transparent 50%),radial-gradient(ellipse at top right, rgba(255, 228, 132, 0.5), transparent 50%),radial-gradient(ellipse at center right, rgba(112, 44, 249, 0.5), transparent 50%),radial-gradient(ellipse at center left, rgba(214, 51, 132, 0.5), transparent 50%)`

  return (
    <Center className="lupi" p={6} minH="100vh" bgImage={mainBg}>
      <Box
        w="md"
        rounded="md"
        boxShadow="xl"
        overflow="hidden"
        bg={useColorModeValue('#E8E8E8', '#222222')}
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
              borderRadius="full"
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
