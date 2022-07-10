import { Stack, Avatar, Text, useColorModeValue } from '@chakra-ui/react'
import { Participant } from '@twilio/conversations'
import { BiGhost } from 'react-icons/bi'

interface TypingBubbleProps {
  participants: Participant[]
}

export default function TypingBubble({ participants }: TypingBubbleProps) {
  const idCondition = participants.length > 0 && participants.length < 2
  const identity = idCondition ? participants[0].identity : ''
  const text =
    participants.length > 1
      ? `${participants.length} participants are typing...`
      : `${participants[0].identity} is typing...`

  return (
    <Stack py={2} alignItems="center" direction="row" opacity={0.9}>
      <Avatar
        size="xs"
        bg="gray.700"
        name={identity || ''}
        icon={<BiGhost size={16} color="#fafafa" />}
      />
      <Stack
        p={2}
        px={4}
        minW={100}
        maxW={400}
        boxShadow="lg"
        borderRadius="md"
        bg={useColorModeValue('gray.100', '#202020')}
      >
        <Text fontSize={10}>{text}</Text>
      </Stack>
    </Stack>
  )
}
