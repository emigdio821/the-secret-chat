import {
  Box,
  Icon,
  Text,
  Button,
  VStack,
  Heading,
  useColorModeValue,
} from '@chakra-ui/react'
import Chat from 'components/Chat'
import Helmet from 'components/Helmet'
import { BiArrowBack, BiGhost } from 'react-icons/bi'
import AppWrapper from 'components/AppWrapper'
import { useGlobalContext } from 'context/global'
import NextLink from 'next/link'

export default function ChatPage() {
  const bg = useColorModeValue('#EDEDED', '#2d2d2d')
  const { client, conversation } = useGlobalContext()

  return (
    <AppWrapper>
      <Helmet title={conversation?.friendlyName || undefined} />
      {conversation && client ? (
        <Chat />
      ) : (
        <VStack justify="center">
          <Box
            px={6}
            bg={bg}
            w="100%"
            rounded="xl"
            py={{ base: 6, sm: 20 }}
          >
            <Box textAlign="center" w="100%">
              <Icon as={BiGhost} fontSize="5rem" />
              <Heading fontSize="3xl">Chat not found</Heading>
              <Text fontSize="lg">
                Seems like you don&apos;t have an active chat, try again.
              </Text>
              <NextLink href="/">
                <Button mt={10} leftIcon={<BiArrowBack />}>
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
