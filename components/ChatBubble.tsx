import formatDate from 'utils'
import { useSession } from 'next-auth/react'
import { Message } from '@twilio/conversations'
import { Avatar, Stack, useColorModeValue, Text, Box } from '@chakra-ui/react'

interface ChatBubbleProps {
  message: Message
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const { author, body, dateCreated } = message
  const mainMsgBg = useColorModeValue('gray.300', '#141414')
  const secondaryMsgBg = useColorModeValue('gray.100', '#202020')
  const { data: session } = useSession()
  const currentUser = session?.user?.email || ''
  const userImg = session?.user?.image || ''
  const isAuthor = author === currentUser

  return (
    <Stack
      py={2}
      alignItems="center"
      direction={isAuthor ? 'row-reverse' : 'row'}
    >
      <Avatar
        size="xs"
        name={author || ''}
        src={isAuthor ? userImg : ''}
        bg={isAuthor ? 'gray.800' : 'gray.700'}
      />
      <Stack
        p={2}
        px={4}
        minW={100}
        maxW={400}
        spacing={4}
        boxShadow="xl"
        borderRadius="md"
        bg={isAuthor ? mainMsgBg : secondaryMsgBg}
      >
        <Text>{body}</Text>
        <Box>
          {dateCreated && (
            <Text fontSize={10} opacity={0.35}>
              {formatDate(dateCreated)}
            </Text>
          )}
          {!isAuthor && (
            <Text fontSize={10} opacity={0.4}>
              {author}
            </Text>
          )}
        </Box>
      </Stack>
    </Stack>
  )
}
