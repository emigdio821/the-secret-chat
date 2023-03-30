import {
  Box,
  Icon,
  Grid,
  Stack,
  Input,
  chakra,
  VStack,
  Spinner,
  Heading,
  IconButton,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from '@chakra-ui/react'
import useStore from 'store/global'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import MotionDiv from 'components/MotionDiv'
import { Conversation } from '@twilio/conversations'
import { BiGhost, BiRefresh, BiSearch } from 'react-icons/bi'
import ConvoCard from './ConvoCard'

interface MyChatsProps {
  convos: Conversation[]
  getConvos: () => void
}

export default function MyChats({ convos, getConvos }: MyChatsProps) {
  const router = useRouter()
  const client = useStore((state) => state.client)
  const isLoading = useStore((state) => state.isLoading)
  const addLoading = useStore((state) => state.addLoading)
  const bg = useColorModeValue('#EDEDED', '#2d2d2d')
  const btnBg = useColorModeValue('#444', '#262626')
  const btnHover = useColorModeValue('#333', '#222')
  const [searchValue, setSearchValue] = useState<string>('')
  const [filtered, setFiltered] = useState<Conversation[]>([])

  useEffect(() => {
    if (client) {
      getConvos()
    }
  }, [client, getConvos])

  useEffect(() => {
    if (searchValue) {
      const filteredConversations = convos.filter((convo: any) =>
        convo.friendlyName
          ?.toLowerCase()
          .includes(searchValue.toLocaleLowerCase()),
      )
      setFiltered(filteredConversations)
    } else {
      setFiltered(convos)
    }
  }, [convos, searchValue])

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
            isDisabled={isLoading}
            onClick={() => getConvos()}
            icon={<BiRefresh size={20} />}
            aria-label="Refresh conversations"
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
              placeholder="Search"
              focusBorderColor="#B2ABCC"
              disabled={isLoading || !convos.length}
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
        {filtered.length > 0 ? (
          <Grid
            gap={6}
            templateColumns={{
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              base: 'repeat(1, 1fr)',
            }}
          >
            {filtered.map((convo) => (
              <ConvoCard
                convo={convo}
                key={convo.sid}
                isLoading={isLoading}
                btnCallback={() => {
                  addLoading()
                  router.push(`/chats/${convo.sid}`)
                }}
              />
            ))}
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
