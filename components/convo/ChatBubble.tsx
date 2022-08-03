import { formatDate, getAvatar } from 'utils'
import { useSession } from 'next-auth/react'
import { Message } from '@twilio/conversations'
import {
  Box,
  Text,
  Stack,
  Avatar,
  useColorModeValue,
  Image,
  Center,
} from '@chakra-ui/react'
import { useGlobalContext } from 'context/global'
import { useCallback, useEffect, useState } from 'react'
import Spinner from 'components/Spinner'
import DeleteMsgMenu from './DeleteMsgMenu'

interface ChatBubbleProps {
  message: Message
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const { author, body, dateCreated, attributes } = message
  const mainMsgBg = useColorModeValue('#fafafa', '#141414')
  const secondaryMsgBg = useColorModeValue('gray.100', '#202020')
  const { data: session } = useSession()
  const currentUser = session?.user?.email || ''
  const userImg = session?.user?.image || ''
  const isAuthor = author === currentUser
  const { client } = useGlobalContext()
  const [friendlyName, setFriendlyName] = useState<string>(author || '')
  const [avatar, setAvatar] = useState<string>('')
  // @ts-ignore
  const isGif = attributes?.gif

  const getFriendlyName = useCallback(async () => {
    if (author) {
      const user = await client.getUser(author)
      if (user.friendlyName) setFriendlyName(user.friendlyName)
      const av = getAvatar(user)
      if (av) setAvatar(av)
    }
  }, [client, author])

  useEffect(() => {
    getFriendlyName()
  }, [getFriendlyName, author])

  return (
    <Stack
      py={2}
      alignItems="center"
      direction={isAuthor ? 'row-reverse' : 'row'}
    >
      <Avatar
        size="sm"
        shadow="xl"
        color="#fafafa"
        src={isAuthor ? userImg : avatar}
        name={friendlyName.charAt(0) || ''}
        bg={isAuthor ? 'gray.800' : 'gray.700'}
      />
      <Stack
        p={2}
        px={4}
        minW={100}
        maxW={400}
        shadow="xl"
        rounded="lg"
        bg={isAuthor ? mainMsgBg : secondaryMsgBg}
      >
        <Stack direction="row" justifyContent="space-between">
          {isGif ? (
            <Image
              h={130}
              w="100%"
              alt="gif"
              rounded="lg"
              src={body || ''}
              fallback={
                <Center w={120} h={130} rounded="lg" bg="#242424">
                  <Spinner />
                </Center>
              }
            />
          ) : (
            <Text wordBreak="break-word">{body}</Text>
          )}

          {isAuthor && <DeleteMsgMenu message={message} />}
        </Stack>
        <Box>
          {dateCreated && (
            <Text fontSize={10} opacity={0.35}>
              {formatDate(dateCreated)}
              {isGif && ' (via GIPHY)'}
            </Text>
          )}
          {!isAuthor && (
            <Text fontSize={10} opacity={0.4}>
              {friendlyName}
            </Text>
          )}
        </Box>
      </Stack>
    </Stack>
  )
}
