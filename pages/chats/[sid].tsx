import {
  Box,
  Icon,
  Text,
  Button,
  VStack,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react'
import { Session } from 'types'
import NextLink from 'next/link'
import useStore from 'store/global'
import Helmet from 'components/Helmet'
import Chat from 'components/convo/Chat'
import AppWrapper from 'components/AppWrapper'
import { useGlobalContext } from 'context/global'
import { BiArrowBack, BiGhost } from 'react-icons/bi'
import { getSession, GetSessionParams } from 'next-auth/react'

export default function ChatPage({ session }: { session: Session }) {
  const { client } = useStore()
  const { conversation } = useGlobalContext()
  const bg = useColorModeValue('#EDEDED', '#2d2d2d')
  const btnBg = useColorModeValue('#333', '#262626')

  return (
    <AppWrapper>
      <Helmet title={conversation?.friendlyName || undefined} />
      {conversation && client ? (
        <Chat session={session} />
      ) : (
        <VStack justify="center">
          <Box px={6} bg={bg} w="100%" rounded="xl" py={{ base: 6, sm: 20 }}>
            <Box textAlign="center" w="100%">
              <Icon as={BiGhost} fontSize="5rem" />
              <Heading fontSize="3xl">Chat not found</Heading>
              <Text fontSize="lg">
                Seems like you don&apos;t have an active chat, try again.
              </Text>
              <NextLink href="/">
                <Button
                  mt={10}
                  bg={btnBg}
                  shadow="xl"
                  color="#fafafa"
                  leftIcon={<BiArrowBack />}
                  _hover={{
                    bg: '#444',
                  }}
                  _active={{
                    bg: '#262626',
                  }}
                >
                  Back to home
                </Button>
              </NextLink>
            </Box>
          </Box>
        </VStack>
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
