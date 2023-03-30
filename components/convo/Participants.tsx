import {
  Box,
  Stack,
  Badge,
  Heading,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react'
import { sortArray } from 'utils'
import useStore from 'store/global'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import MotionDiv from 'components/MotionDiv'
import { useEffect, useState, useCallback } from 'react'
import { Participant as Part } from '@twilio/conversations'
import Participant from './Participant'

interface ParticipantsProps {
  adminPart: Part | undefined
}

export default function Participants({ adminPart }: ParticipantsProps) {
  const { client, conversation } = useStore()
  const mainBg = useColorModeValue('#EDEDED', '#272727')
  const [participants, setParticipants] = useState<Part[]>([])
  const { data: session } = useSession()
  const router = useRouter()

  const getParticipants = useCallback(async () => {
    try {
      setParticipants([])
      const parts = await conversation?.getParticipants()
      sortArray(parts as [], 'identity', session?.user?.email || '')
      if (parts) setParticipants(parts)
    } catch (err) {
      console.error('Failed to get participants ->', err)
    }
  }, [conversation, session])

  useEffect(() => {
    conversation?.on('participantJoined', () => {
      getParticipants()
    })

    conversation?.on('participantLeft', () => {
      getParticipants()
    })

    if (conversation) {
      getParticipants()
    }

    return () => {
      if (conversation) {
        conversation.removeListener('participantLeft', () => {})
        conversation.removeListener('participantJoined', () => {})
      }
      if (client) {
        client.removeAllListeners()
      }
    }
  }, [client, router, session, conversation, getParticipants])

  return (
    <Stack spacing={0} w={{ base: '100%', sm: 200 }}>
      <Stack
        py={2}
        bg={mainBg}
        borderTopEndRadius="md"
        borderTopLeftRadius="md"
        direction={{ base: 'row', sm: 'column' }}
        alignItems={{ base: 'center', sm: 'flex-start' }}
      >
        <Stack direction="row" align="center" pt={{ base: 0, sm: 2 }} px={4}>
          <Tooltip label="Click to refresh" fontSize="xs" rounded="lg">
            <Heading
              cursor="pointer"
              size={{ base: 'xs', sm: 'sm' }}
              onClick={() => getParticipants()}
            >
              Participants
            </Heading>
          </Tooltip>
          {participants.length > 1 && (
            <Badge colorScheme="purple">{participants.length}</Badge>
          )}
        </Stack>
      </Stack>
      <Box
        px={4}
        bg={mainBg}
        overflowY="auto"
        py={{ base: 3, sm: 6 }}
        borderBottomEndRadius="md"
        borderBottomLeftRadius="md"
        // display={{ base: 'flex', sm: 'inherit' }}
        height={{ base: undefined, sm: 'calc(100% - 40px)' }}
      >
        {participants.length > 0 && (
          <MotionDiv>
            <Stack
              direction={{ base: 'row', sm: 'column' }}
              align={{ base: 'center', sm: 'flex-start' }}
            >
              {participants.map((part: Part) => (
                <Participant
                  key={part.sid}
                  admin={adminPart}
                  participant={part}
                />
              ))}
            </Stack>
          </MotionDiv>
        )}
      </Box>
    </Stack>
  )
}
