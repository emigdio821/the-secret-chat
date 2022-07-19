import { Stack, Avatar, Text, useColorModeValue } from '@chakra-ui/react'
import { Participant } from '@twilio/conversations'
import { useGlobalContext } from 'context/global'
import { useCallback, useEffect, useState } from 'react'
import { BiGhost } from 'react-icons/bi'
import { getAvatar } from 'utils'

interface TypingBubbleProps {
  participants: Participant[]
}

export default function TypingBubble({ participants }: TypingBubbleProps) {
  const idCondition = participants.length > 0 && participants.length < 2
  const identity = idCondition ? participants[0].identity : ''
  const [friendlyName, setFriendlyName] = useState<string>(identity || '')
  const [avatar, setAvatar] = useState<string>('')
  const text =
    participants.length > 1
      ? `${participants.length} participants are typing...`
      : `${friendlyName} is typing...`
  const { client } = useGlobalContext()

  const getFriendlyName = useCallback(async () => {
    if (identity) {
      const user = await client.getUser(identity)
      const avatarUrl = getAvatar(user)
      if (user.friendlyName) setFriendlyName(user.friendlyName)
      if (avatarUrl) setAvatar(avatarUrl)
    }
  }, [client, identity])

  useEffect(() => {
    getFriendlyName()
  }, [getFriendlyName, identity])

  return (
    <Stack py={2} alignItems="center" direction="row" opacity={0.9}>
      <Avatar
        size="xs"
        bg="gray.700"
        color="#fafafa"
        src={participants.length > 1 ? '' : avatar}
        icon={<BiGhost size={16} color="#fafafa" />}
        name={participants.length > 1 ? '' : friendlyName.charAt(0)}
      />
      <Stack
        p={2}
        px={4}
        minW={100}
        maxW={400}
        shadow="lg"
        rounded="md"
        bg={useColorModeValue('gray.100', '#202020')}
      >
        <Text fontSize={10}>{text}</Text>
      </Stack>
    </Stack>
  )
}
