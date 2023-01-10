import {
  Box,
  Text,
  Flex,
  Stack,
  Image,
  chakra,
  VStack,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react'
import { Session } from 'types'
import useStore from 'store/global'
import Helmet from 'components/Helmet'
import { BiGhost } from 'react-icons/bi'
import Reconnect from 'components/Reconnect'
import MotionDiv from 'components/MotionDiv'
import AppWrapper from 'components/AppWrapper'
import useInitClient from 'hooks/useInitClient'
import { AnimatePresence } from 'framer-motion'
import useBgGradient from 'hooks/useBgGradient'
import ProfileForm from 'components/profile/ProfileForm'
import { useCallback, useEffect, useState } from 'react'
import { getSession, GetSessionParams } from 'next-auth/react'
import ProfilePopInfo from 'components/profile/ProfilePopInfo'

interface CallbackProps {
  inputName: string
  onClose: () => void
  setInputName: (val: string) => void
}

export default function Profile({ session }: { session: Session }) {
  const { user } = session
  const bgGradient = useBgGradient()
  const [error, setError] = useState<string>('')
  const cardBg = useColorModeValue('#EDEDED', '#272727')
  const { newClient, error: clientErr } = useInitClient()
  const { removeLoading, addLoading, isLoading, client } = useStore()
  const [friendlyName, setFriendlyName] = useState<string>('')

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
      client.on('tokenExpired', () => {
        if (session) {
          newClient()
        }
      })
    }

    return () => {
      client?.removeAllListeners()
    }
  }, [client, newClient, session])

  const handleFormSubmit = useCallback(
    async ({ setInputName, inputName, onClose }: CallbackProps) => {
      addLoading()
      try {
        await client?.user.updateFriendlyName(inputName)
        await client?.user.updateAttributes({
          avatar: user.image,
          friendlyName: inputName,
        })
        setInputName('')
        setFriendlyName(inputName)
        onClose()
      } catch (err) {
        setError('Failed to update friendly name')
        console.error('Failed to update profile ->', err)
      }
      removeLoading()
    },
    [addLoading, client?.user, removeLoading, user.image],
  )

  return (
    <AppWrapper>
      <Helmet title={user.name || 'Profile'} />
      {clientErr ? (
        <Reconnect error={clientErr} initClient={newClient} />
      ) : (
        <Stack align="center">
          <Box w="full" maxW="4xl" rounded="lg" overflow="hidden" bg={cardBg}>
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
            <Stack p={6} maxW="lg" justify="center" m="0 auto" align="center">
              <Stack spacing={0} align="center" mb={2} justify="center">
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
                        <chakra.span fontWeight={600}>
                          Friendly name:
                        </chakra.span>{' '}
                        {friendlyName || user.email}
                      </Text>
                    </MotionDiv>
                  </AnimatePresence>
                </Stack>
              </Stack>
              {client && (
                <ProfileForm
                  error={error}
                  client={client}
                  session={session}
                  setError={setError}
                  isLoading={isLoading}
                  callback={handleFormSubmit}
                />
              )}
            </Stack>
          </Box>
        </Stack>
      )}
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
