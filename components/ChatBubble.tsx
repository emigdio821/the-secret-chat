import { useSession } from 'next-auth/react'
import { Message } from '@twilio/conversations'
import { Avatar, Stack, useColorModeValue, Text } from '@chakra-ui/react'

interface ChatBubbleProps {
  message: Message
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const { author, body } = message
  const mainMsgBg = useColorModeValue('gray.300', '#141414')
  const secondaryMsgBg = useColorModeValue('gray.100', '#202020')

  const { data: session } = useSession()

  if (author === session?.user?.email) {
    return (
      <Stack py={1} spacing={2} alignItems="center" direction="row-reverse">
        <Avatar
          size="xs"
          bg="gray.700"
          name={author || ''}
          src={session?.user?.image || ''}
        />
        <Stack
          p={2}
          minW={100}
          maxW={350}
          spacing={2}
          bg={mainMsgBg}
          borderRadius="md"
        >
          <Text>{body}</Text>
        </Stack>
      </Stack>
    )
  }
  return (
    <Stack py={1} spacing={2} direction="row" alignItems="center">
      <Avatar size="xs" bg="gray.700" name={author || ''} />
      <Stack
        p={2}
        minW={100}
        maxW={350}
        spacing={2}
        borderRadius="md"
        bg={secondaryMsgBg}
      >
        <Text>{body}</Text>
        <Text fontSize={10} opacity={0.5}>
          {author}
        </Text>
      </Stack>
    </Stack>
  )
}
