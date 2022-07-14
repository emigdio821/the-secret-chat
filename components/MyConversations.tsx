import {
  Box,
  Icon,
  Grid,
  Stack,
  Input,
  Button,
  chakra,
  VStack,
  Heading,
  GridItem,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from '@chakra-ui/react'
import { useGlobalContext } from 'context/global'
import { BiGhost, BiRightArrowAlt, BiSearch } from 'react-icons/bi'
import { useEffect, useState } from 'react'
import { Conversation } from '@twilio/conversations'
import actions from 'context/globalActions'
import { useRouter } from 'next/router'
import { AnimatePresence } from 'framer-motion'
import { sortArray } from 'utils'
import MotionDiv from './MotionDiv'
import Spinner from './Spinner'

export default function MyConversations() {
  const router = useRouter()
  const bg = useColorModeValue('#EDEDED', '#2d2d2d')
  const btnBg = useColorModeValue('#333', '#262626')
  const [searchValue, setSearchValue] = useState<string>('')
  const [filtered, setFiltered] = useState<Conversation[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const { client, dispatch, isLoading, conversation } = useGlobalContext()

  async function getConversation(sid: string) {
    if (client && sid) {
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
          const sortedConvers = sortArray(convers.items as [], 'friendlyName')
          setConversations(sortedConvers)
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

  useEffect(() => {
    if (searchValue) {
      const filteredConversations = conversations.filter((conver) =>
        conver.friendlyName?.toLowerCase().includes(searchValue),
      )
      setFiltered(filteredConversations)
    } else {
      setFiltered(conversations)
    }
  }, [conversations, searchValue])

  return (
    <Box>
      <Stack
        mb={2}
        direction="row"
        align="center"
        justifyContent="space-between"
      >
        <Heading as="h2" size={{ base: 'md', sm: 'lg' }}>
          My chats
          {isLoading && (
            <chakra.span ml={2}>
              <Spinner />
            </chakra.span>
          )}
        </Heading>
        <InputGroup w={{ base: '50%', sm: 'auto' }}>
          <InputLeftElement pointerEvents="none">
            <BiSearch color="gray.300" />
          </InputLeftElement>
          <Input
            size="md"
            value={searchValue}
            disabled={isLoading}
            placeholder="Search"
            focusBorderColor="#B2ABCC"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </InputGroup>
      </Stack>
      <Box
        minH={{ base: 280, md: 400 }}
        maxH={{ base: 'calc(100vh - 400px)' }}
        overflowY="auto"
      >
        {filtered.length ? (
          <Grid
            gap={6}
            templateColumns={{
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              base: 'repeat(1, 1fr)',
            }}
          >
            {filtered.map(({ friendlyName, sid }) => (
              <AnimatePresence key={sid}>
                <MotionDiv>
                  <GridItem>
                    <Box p={6} bg={bg} rounded="lg">
                      <Stack spacing={6}>
                        <Heading as="h5" size="sm" noOfLines={1}>
                          {friendlyName}
                        </Heading>
                        <Button
                          onClick={() => getConversation(sid)}
                          boxShadow="xl"
                          rightIcon={<BiRightArrowAlt />}
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
                      </Stack>
                    </Box>
                  </GridItem>
                </MotionDiv>
              </AnimatePresence>
            ))}
          </Grid>
        ) : (
          <VStack justify="center">
            <Box w="100%" rounded="xl" py={{ base: 10, sm: 20 }} bg={bg}>
              <Box textAlign="center" w="100%">
                <Icon as={BiGhost} fontSize="5rem" />
                <AnimatePresence>
                  <MotionDiv>
                    <Heading fontSize="3xl">
                      {isLoading ? <Spinner /> : 'No chats found'}
                    </Heading>
                  </MotionDiv>
                </AnimatePresence>
              </Box>
            </Box>
          </VStack>
        )}
      </Box>
    </Box>
  )
}
