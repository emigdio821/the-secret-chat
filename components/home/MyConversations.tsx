import {
  Box,
  Icon,
  Grid,
  Text,
  Stack,
  Input,
  chakra,
  VStack,
  Heading,
  GridItem,
  IconButton,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from '@chakra-ui/react'
import { useGlobalContext } from 'context/global'
import { BiGhost, BiRefresh, BiRightArrowAlt, BiSearch } from 'react-icons/bi'
import { useEffect, useState, useCallback } from 'react'
import { Conversation } from '@twilio/conversations'
import actions from 'context/globalActions'
import { useRouter } from 'next/router'
import { sortArray } from 'utils'
import MotionDiv from 'components/MotionDiv'
import Spinner from 'components/Spinner'
import CommonBtn from 'components/CommonBtn'

export default function MyConversations() {
  const router = useRouter()
  const bg = useColorModeValue('#EDEDED', '#2d2d2d')
  const btnBg = useColorModeValue('#444', '#262626')
  const btnHover = useColorModeValue('#333', '#222')
  const [searchValue, setSearchValue] = useState<string>('')
  const [filtered, setFiltered] = useState<Conversation[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const { client, dispatch, isLoading, conversation } = useGlobalContext()

  const getConversations = useCallback(async () => {
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
  }, [client, dispatch])

  async function getConversation(uniqueName: string) {
    if (client && uniqueName) {
      try {
        const conver = await client.getConversationByUniqueName(uniqueName)
        dispatch({
          type: actions.addConversation,
          payload: conver,
        })
        router.push(`/chats/${conver.sid}`)
      } catch (err) {
        getConversations()
        console.error('Failed to get convo ->', err)
      }
    }
  }

  useEffect(() => {
    if (client) {
      getConversations()
    }
  }, [client, dispatch, conversation, getConversations])

  useEffect(() => {
    if (searchValue) {
      const filteredConversations = conversations.filter((conver) =>
        conver.friendlyName
          ?.toLowerCase()
          .includes(searchValue.toLocaleLowerCase()),
      )
      setFiltered(filteredConversations)
    } else {
      setFiltered(conversations)
    }
  }, [conversations, searchValue])

  return (
    <Box>
      <Stack
        mb={6}
        align="center"
        direction="row"
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
        <Stack direction="row" w={{ base: '50%', sm: 'auto' }}>
          <IconButton
            size="sm"
            bg={btnBg}
            color="#fafafa"
            disabled={isLoading}
            icon={<BiRefresh size={20} />}
            aria-label="Refresh conversations"
            onClick={() => getConversations()}
            _hover={{
              bg: btnHover,
            }}
            _active={{
              bg: btnBg,
            }}
          />
          <InputGroup size="sm">
            <InputLeftElement pointerEvents="none">
              <BiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              borderRadius="md"
              value={searchValue}
              disabled={isLoading}
              placeholder="Search"
              focusBorderColor="#B2ABCC"
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </InputGroup>
        </Stack>
      </Stack>
      <Box
        rounded="lg"
        overflowY="auto"
        minH={{ base: 'calc(100vh - 428px)', sm: 500 }}
        maxH={{ base: 'calc(100vh - 340px)', sm: 'calc(100vh - 300px)' }}
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
            {filtered.map(({ friendlyName, uniqueName, attributes }) => {
              // @ts-ignore
              const { description } = attributes

              return (
                <MotionDiv key={uniqueName}>
                  <GridItem>
                    <Box p={6} bg={bg} rounded="lg">
                      <Stack spacing={6}>
                        <Stack spacing={1}>
                          <Heading as="h5" size="sm" noOfLines={1}>
                            {friendlyName}
                          </Heading>
                          <Text fontSize="sm">
                            {description || 'No chat description'}
                          </Text>
                        </Stack>
                        <CommonBtn
                          btnLabel="Join"
                          isDisabled={isLoading}
                          rightIcon={<BiRightArrowAlt />}
                          onClick={() => getConversation(uniqueName as string)}
                        />
                      </Stack>
                    </Box>
                  </GridItem>
                </MotionDiv>
              )
            })}
          </Grid>
        ) : (
          <VStack justify="center">
            <Box w="100%" rounded="lg" py={{ base: 10, sm: 20 }} bg={bg}>
              <Box textAlign="center" w="100%">
                <Icon as={BiGhost} fontSize="5rem" />
                <MotionDiv>
                  <Heading fontSize="3xl">
                    {isLoading ? <Spinner /> : 'No chats found'}
                  </Heading>
                </MotionDiv>
              </Box>
            </Box>
          </VStack>
        )}
      </Box>
    </Box>
  )
}