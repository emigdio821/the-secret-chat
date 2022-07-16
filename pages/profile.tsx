import {
  Box,
  Text,
  Flex,
  Stack,
  Input,
  Image,
  chakra,
  Button,
  VStack,
  Heading,
  FormControl,
  useColorModeValue,
} from '@chakra-ui/react'
import { Session } from 'types'
import Helmet from 'components/Helmet'
import { initClient } from 'lib/client'
import actions from 'context/globalActions'
import { useCallback, useEffect, useState } from 'react'
import AppWrapper from 'components/AppWrapper'
import { AnimatePresence } from 'framer-motion'
import useBgGradient from 'hooks/useBgGradient'
import { useGlobalContext } from 'context/global'
import { BiEraser, BiGhost } from 'react-icons/bi'
import { getSession, GetSessionParams } from 'next-auth/react'
import MotionDiv from 'components/MotionDiv'
import Spinner from 'components/Spinner'
import { Client } from '@twilio/conversations'
import ProfilePopInfo from 'components/ProfilePopInfo'

interface CallbackProps {
  inputName: string
  setInputName: (val: string) => void
}

interface ProfileFormProps {
  client: Client
  session: Session
  isLoading: boolean
  callback: ({ setInputName, inputName }: CallbackProps) => void
}

function ProfileForm({
  client,
  session,
  callback,
  isLoading,
}: ProfileFormProps) {
  const { user } = session
  const [inputName, setInputName] = useState<string>('')
  const sameName =
    client?.user.friendlyName === inputName || user.email === inputName

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    callback({ setInputName, inputName })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Stack direction={{ base: 'column', sm: 'row' }}>
        <FormControl isRequired>
          <Input
            value={inputName}
            disabled={isLoading}
            focusBorderColor="#B2ABCC"
            placeholder="Friendly name"
            isRequired
            // w={{ base: 'full', sm: 60 }}
            bg={useColorModeValue('#fafafa', '#272727')}
            onChange={(e) => setInputName(e.target.value)}
          />
        </FormControl>
        <Button
          type="submit"
          color="#fafafa"
          // w={{ base: 'full', sm: 40 }}
          disabled={
            !client || sameName || isLoading || !inputName || !inputName.trim()
          }
          bg="#222222"
          _hover={{
            bg: '#333',
          }}
          _active={{
            bg: '#222222',
          }}
          rightIcon={!isLoading ? <BiEraser /> : <Spinner />}
        >
          {isLoading ? <BiGhost size={18} /> : 'Update'}
        </Button>
      </Stack>
    </form>
  )
}

export default function Profile({ session }: { session: Session }) {
  const bgGradient = useBgGradient()
  const { client, dispatch, isLoading } = useGlobalContext()
  const [friendlyName, setFriendlyName] = useState<string>('')
  const { user } = session

  const newClient = useCallback(async () => {
    dispatch({
      type: actions.setLoading,
    })
    try {
      const twilioClient = await initClient()
      dispatch({
        type: actions.addClient,
        payload: twilioClient,
      })
    } catch (err) {
      console.error('Could not create Client ->', err)
    }
    dispatch({
      type: actions.removeLoading,
    })
  }, [dispatch])

  useEffect(() => {
    if (!client) {
      newClient()
    }

    if (client) {
      if (client.user.friendlyName) setFriendlyName(client.user.friendlyName)
      client.on('stateChanged', async (state) => {
        if (state === 'initialized') {
          if (client.user.friendlyName) {
            setFriendlyName(client.user.friendlyName)
          }
        }
      })
    }

    return () => {
      client?.removeAllListeners()
    }
  }, [client, newClient])

  const handleFormSubmit = useCallback(
    async ({ setInputName, inputName }: CallbackProps) => {
      dispatch({
        type: actions.setLoading,
      })
      try {
        await client.user.updateFriendlyName(inputName)
        await client.user.updateAttributes({
          avatar: user.image,
          friendlyName: inputName,
        })
        setInputName('')
        setFriendlyName(inputName)
      } catch (err) {
        console.error('Something went wrong ->', err)
      }
      dispatch({
        type: actions.removeLoading,
      })
    },
    [client, dispatch, user.image],
  )

  return (
    <AppWrapper>
      <Helmet title={user.name || 'Profile'} />
      <Stack align="center">
        <Box
          w="full"
          maxW="4xl"
          rounded="lg"
          overflow="hidden"
          bg={useColorModeValue('#EDEDED', '#272727')}
        >
          <Box w="full" h="160px" bgImage={bgGradient} />
          <Flex align="center" mt={-24} direction="column">
            <Image
              shadow="xl"
              alt="profile"
              bg="gray.700"
              rounded="full"
              src={user.image}
              h={{ base: 32, sm: 40 }}
              w={{ base: 32, sm: 40 }}
              fallback={
                <VStack
                  h={40}
                  w={40}
                  bg="#333"
                  rounded="full"
                  shadow="xl"
                  color="#EDEDED"
                  justify="center"
                >
                  <BiGhost size={40} />
                </VStack>
              }
            />
            <Box mt={-4}>
              <ProfilePopInfo />
            </Box>
          </Flex>
          <Stack p={6} maxW="lg" justify="center" m="0 auto">
            <Stack spacing={0} align="center" mb={5} justify="center">
              <Heading
                mb={2}
                textAlign="center"
                fontSize={{ base: '2xl', sm: '2xl', md: '3xl' }}
              >
                {session.user.name}
              </Heading>
              <Stack direction={{ base: 'column', sm: 'row' }}>
                <Text fontSize={{ base: 'sm', sm: 'md' }} textAlign="center">
                  <chakra.span fontWeight={600}>Username:</chakra.span>{' '}
                  {session.user.email}
                </Text>
              </Stack>
              <Stack direction={{ base: 'column', sm: 'row' }}>
                <AnimatePresence key={friendlyName}>
                  <MotionDiv>
                    <Text
                      textAlign="center"
                      fontSize={{ base: 'sm', sm: 'md' }}
                    >
                      <chakra.span fontWeight={600}>Friendly name:</chakra.span>{' '}
                      {friendlyName || user.email}
                    </Text>
                  </MotionDiv>
                </AnimatePresence>
              </Stack>
            </Stack>
            <ProfileForm
              client={client}
              session={session}
              isLoading={isLoading}
              callback={handleFormSubmit}
            />
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
