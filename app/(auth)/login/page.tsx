// import {
//   Box,
//   Text,
//   Stack,
//   Center,
//   IconButton,
//   useColorMode,
//   useColorModeValue,
// } from '@chakra-ui/react'
// import { useState } from 'react'
// import LoginLogo from 'components/LoginLogo'
// import { signIn } from 'next-auth/react'
// import { BiMoon, BiSun } from 'react-icons/bi'
// import { FaGithub } from 'react-icons/fa'

// import useBgGradient from 'hooks/useBgGradient'
// import Helmet from 'components/Helmet'
// import CommonBtn from 'components/CommonBtn'

export default function LoginPage() {
  // const bgGradient = useBgGradient()
  // const { toggleColorMode } = useColorMode()
  // const [isLoading, setLoading] = useState<boolean>(false)
  // const btnBg = useColorModeValue('#444', '#262626')
  // const btnHover = useColorModeValue('#333', '#222')
  // const SwitchIcon = useColorModeValue(BiMoon, BiSun)

  // async function handleSignIn() {
  //   setLoading(true)
  //   try {
  //     await signIn('github', {
  //       callbackUrl: '/',
  //     })
  //   } catch (error) {
  //     console.log(error)
  //     setLoading(false)
  //   }
  // }

  return (
    <div>
      <div className="p-4 pt-2 sm:text-left" />
      Login
    </div>
    // <Center p={6} minH="100vh" bgImage={bgGradient}>
    //   <Helmet title="Login" />
    //   <Box
    //     w="md"
    //     shadow="xl"
    //     rounded="lg"
    //     overflow="hidden"
    //     bg={useColorModeValue('#EDEDED', '#202020')}
    //   >
    //     <Box p={6}>
    //       <Stack spacing={0} align="center" mb={5}>
    //         <LoginLogo />
    //         <Text fontSize="xl" fontWeight={600}>
    //           Start chatting now
    //         </Text>
    //       </Stack>
    //       <Stack justifyContent="center" direction="row">
    //         <CommonBtn
    //           isLoading={isLoading}
    //           onClick={() => handleSignIn()}
    //           btnLabel="Log in with Github"
    //           leftIcon={<FaGithub size={20} />}
    //         />
    //         <IconButton
    //           bg={btnBg}
    //           p={[0, 4]}
    //           rounded="full"
    //           onClick={toggleColorMode}
    //           aria-label="Switch theme"
    //           icon={<SwitchIcon size={20} />}
    //           color={useColorModeValue('yellow.400', 'purple.200')}
    //           _hover={{
    //             bg: btnHover,
    //           }}
    //           _active={{
    //             bg: btnHover,
    //           }}
    //         />
    //         <button className="text-white px-4 sm:px-8 py-2 sm:py-3 bg-sky-700 hover:bg-sky-800">
    //           ...
    //         </button>
    //       </Stack>
    //     </Box>
    //   </Box>
    // </Center>
  )
}
