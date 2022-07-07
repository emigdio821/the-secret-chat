import { useSession } from 'next-auth/react'
import { Participant as Part } from '@twilio/conversations'
import { Avatar, Stack, Text } from '@chakra-ui/react'

interface ChatBubbleProps {
  participant: Part
}

interface UserProps {
  p: string | null
}

function User({ p }: UserProps) {
  return (
    <Text fontWeight={600} fontSize="xs" noOfLines={1}>
      {p}
    </Text>
  )
}

export default function Participant({ participant }: ChatBubbleProps) {
  const { identity } = participant
  const { data: session } = useSession()
  const currentUser = session?.user?.email || ''
  const userImg = session?.user?.image || ''
  const isAuthor = identity === currentUser

  return (
    <Stack
      spacing={2}
      py={{ base: 0, sm: 1 }}
      px={{ base: 2, sm: 0 }}
      alignItems="center"
      direction={{ base: 'column', sm: 'row' }}
    >
      <Avatar
        h={4}
        w={4}
        size="xs"
        bg="gray.700"
        name={identity || 'Unknown'}
        src={isAuthor ? userImg : ''}
      />
      <Stack maxW={20} borderRadius="md">
        {isAuthor ? <User p="You" /> : <User p={identity} />}
      </Stack>
    </Stack>
  )
}
