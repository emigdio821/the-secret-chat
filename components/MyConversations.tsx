import {
  Box,
  Grid,
  Heading,
  GridItem,
  useColorModeValue,
  Stack,
  Button,
  VStack,
  Spinner,
  Icon,
  Text,
} from '@chakra-ui/react'
import { useGlobalContext } from 'context/global'
// import NextLink from 'next/link'
import { BiChat, BiGhost } from 'react-icons/bi'
import { useEffect, useState } from 'react'
import { Conversation } from '@twilio/conversations'
import actions from 'context/globalActions'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion'
import MotionDiv from './MotionDiv'

export default function MyConversations() {
  const router = useRouter()
  const bg = useColorModeValue('#EDEDED', '#2d2d2d')
  const btnBg = useColorModeValue('#333', '#262626')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const { client, dispatch, isLoading, conversation } = useGlobalContext()

  async function getConversation(sid: string) {
    if (client) {
      try {
        const conver = await client.getConversationBySid(sid)
        dispatch({
          type: actions.addConversation,
          payload: conver,
        })
        router.push(`/chats/${conver.sid}`)
      } catch (err) {
        console.error('Something went wrong ->', err)
      }
    }
  }

  useEffect(() => {
    async function getConversations() {
      if (client) {
        dispatch({
          type: actions.setLoading,
        })
        try {
          const convers = await client.getSubscribedConversations()
          setConversations(convers.items)
        } catch (err) {
          console.error('Failed to retreive conversations ->', err)
        }
        dispatch({
          type: actions.removeLoading,
        })
      }
    }
    if (client) {
      getConversations()
    }
  }, [client, dispatch, conversation])

  return (
    <Box>
      <Stack direction="row" align="center" mb={6}>
        <Heading as="h2" size={{ base: 'md', sm: 'lg' }}>
          My chats
        </Heading>
        {isLoading && (
          <Spinner size="sm" speed="0.6s" color="#B2ABCC" thickness="4px" />
        )}
      </Stack>
      {conversations.length ? (
        <Grid
          gap={6}
          templateColumns={{
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            base: 'repeat(1, 1fr)',
          }}
        >
          {conversations.map(({ friendlyName, sid }) => (
            <AnimatePresence key={sid}>
              <MotionDiv>
                <GridItem>
                  <Box p={6} bg={bg} borderRadius="lg">
                    <Stack spacing={6}>
                      <Stack direction="row" align="center">
                        <Heading as="h5" size="sm" noOfLines={1}>
                          {friendlyName}
                        </Heading>
                        <BiChat size={18} />
                      </Stack>
                      {/* <NextLink href={`/chats/${sid}`}> */}
                      <Button
                        onClick={() => getConversation(sid)}
                        boxShadow="xl"
                        disabled={isLoading}
                        bg={btnBg}
                        color="#fafafa"
                        _hover={{
                          bg: '#444',
                        }}
                        _active={{
                          bg: '#262626',
                        }}
                      >
                        Join
                      </Button>
                      {/* </NextLink> */}
                    </Stack>
                  </Box>
                </GridItem>
              </MotionDiv>
            </AnimatePresence>
          ))}
        </Grid>
      ) : (
        <VStack justify="center">
          <Box w="100%" borderRadius="xl" py={{ base: 10, sm: 20 }} bg={bg}>
            <Box textAlign="center" w="100%">
              <Icon as={BiGhost} fontSize="5rem" />
              <Heading fontSize="3xl">No chats yet...</Heading>
              <Text fontSize="xl">Join or start creating one</Text>
            </Box>
          </Box>
        </VStack>
      )}
    </Box>
  )
}
