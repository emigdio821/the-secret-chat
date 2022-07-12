import {
  Box,
  Flex,
  Text,
  Stack,
  Input,
  Image,
  chakra,
  Button,
  VStack,
  Heading,
  Spinner,
  FormControl,
  useColorModeValue,
} from '@chakra-ui/react'
import { Session } from 'types'
import Helmet from 'components/Helmet'
import { initClient } from 'lib/client'
import actions from 'context/globalActions'
import { useEffect, useState } from 'react'
import AppWrapper from 'components/AppWrapper'
import { AnimatePresence } from 'framer-motion'
import useBgGradient from 'hooks/useBgGradient'
import MotionDiv from '../components/MotionDiv'
import { useGlobalContext } from 'context/global'
import { BiEraser, BiGhost } from 'react-icons/bi'
import { getSession, GetSessionParams } from 'next-auth/react'

export default function Profile({ session }: { session: Session }) {
  const bgGradient = useBgGradient()
  const { client, dispatch, isLoading } = useGlobalContext()
  const [inputName, setInputName] = useState<string>('')
  const [fName, setFName] = useState<string>('')
  const { user } = session
  const sameName =
    client?.user.friendlyName === inputName || user.email === inputName

  async function newClient() {
    dispatch({
      type: actions.setLoading,
    })
    try {
      const client = await initClient()
      dispatch({
        type: actions.addClient,
        payload: client,
      })
    } catch (err) {
      console.error('Could not create Client ->', err)
    }
    dispatch({
      type: actions.removeLoading,
    })
  }

  useEffect(() => {
    if (!client) {
      newClient()
    }

    if (client) {
      if (client.user.friendlyName) setFName(client.user.friendlyName)
      client.on('stateChanged', async (state) => {
        console.log('test')
        if (state === 'initialized') {
          if (client.user.friendlyName) {
            setFName(client.user.friendlyName)
          }
        }
      })
    }

    return () => {
      client?.removeAllListeners()
    }
  }, [client])

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    dispatch({
      type: actions.setLoading,
    })
    try {
      await client.user.updateFriendlyName(inputName)
      setInputName('')
      setFName(inputName)
    } catch (err) {
      console.error('Something went wrong ->', err)
    }
    dispatch({
      type: actions.removeLoading,
    })
  }

  return (
    <AppWrapper>
      <Helmet title={user.name || 'Profile'} />
      <Stack align="center">
        <Box
          w="full"
          maxW="4xl"
          rounded="lg"
          boxShadow="xl"
          overflow="hidden"
          bg={useColorModeValue('#EDEDED', '#272727')}
        >
          <Box w="full" h="160px" bgImage={bgGradient} />
          <Flex justify="center" mt={-24}>
            <Image
              h={40}
              w={40}
              bg="gray.700"
              rounded="full"
              boxShadow="xl"
              src={user.image}
              fallback={
                <VStack
                  h={40}
                  w={40}
                  bg="#333"
                  rounded="full"
                  boxShadow="xl"
                  color="#EDEDED"
                  justify="center"
                >
                  <BiGhost size={40} />
                </VStack>
              }
            />
          </Flex>
          <Stack p={6} maxW="lg" justify="center" m="0 auto">
            <Stack spacing={0} align="center" mb={5} justify="center">
              <Heading fontSize="3xl" mb={2} textAlign="center">
                {session.user.name}
              </Heading>
              <Stack direction={{ base: 'column', sm: 'row' }}>
                <Text fontSize="md" textAlign="center">
                  <chakra.span fontWeight={600}>Username:</chakra.span>{' '}
                  {session.user.email}
                </Text>
              </Stack>
              <Stack direction={{ base: 'column', sm: 'row' }}>
                <AnimatePresence key={fName}>
                  <MotionDiv>
                    <Text fontSize="md" textAlign="center">
                      <chakra.span fontWeight={600}>Friendly name:</chakra.span>{' '}
                      {fName || 'Not set'}
                    </Text>
                  </MotionDiv>
                </AnimatePresence>
              </Stack>
            </Stack>
            <form onSubmit={handleFormSubmit}>
              <Stack direction={{ base: 'column', sm: 'row' }}>
                <FormControl isRequired>
                  <Input
                    value={inputName}
                    disabled={isLoading}
                    placeholder="Friendly name"
                    focusBorderColor="#B2ABCC"
                    bg={useColorModeValue('#fafafa', '#272727')}
                    onChange={(e) => setInputName(e.target.value)}
                  />
                </FormControl>
                <Button
                  type="submit"
                  color="#fafafa"
                  w={{ base: 'full', sm: 40 }}
                  disabled={
                    !client ||
                    sameName ||
                    isLoading ||
                    !inputName ||
                    !inputName.trim()
                  }
                  bg="#222222"
                  _hover={{
                    bg: '#333',
                  }}
                  _active={{
                    bg: '#222222',
                  }}
                  rightIcon={
                    !isLoading ? (
                      <BiEraser />
                    ) : (
                      <Spinner
                        size="sm"
                        speed="0.6s"
                        color="#B2ABCC"
                        thickness="4px"
                      />
                    )
                  }
                >
                  {isLoading ? <BiGhost size={18} /> : 'Update'}
                </Button>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Stack>
    </AppWrapper>
  )
}

export async function getServerSideProps(ctx: GetSessionParams) {
  const session = await getSession(ctx)

  return {
    props: {
      session,
    },
  }
}
