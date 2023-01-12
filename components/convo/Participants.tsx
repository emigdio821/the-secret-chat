import {
  Box,
  Text,
  Stack,
  Badge,
  Heading,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react'
import useStore from 'store/global'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import MotionDiv from 'components/MotionDiv'
import { sortArray, getFriendlyName } from 'utils'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState, useCallback } from 'react'
import { Participant as Part } from '@twilio/conversations'
import Participant from './Participant'

interface ParticipantsProps {
  adminPart: Part | undefined
}

export default function Participants({ adminPart }: ParticipantsProps) {
  const { client, conversation } = useStore()
  const notifBg = useColorModeValue('gray.300', '#141414')
  const mainBg = useColorModeValue('#EDEDED', '#272727')
  const [partiJoined, setPartiJoined] = useState<Part>()
  const [partiLeft, setPartiLeft] = useState<Part>()
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
    conversation?.on('participantJoined', (participant) => {
      getParticipants()
      setPartiJoined(participant)
    })

    conversation?.on('participantLeft', (participant) => {
      if (participant.identity === session?.user?.email) {
        router.push('/')
      }
      getParticipants()
      setPartiLeft(participant)
    })

    if (conversation) {
      getParticipants()
    }

    let timeOut: any
    if (partiJoined || partiLeft) {
      timeOut = setTimeout(() => {
        setPartiJoined(undefined)
        setPartiLeft(undefined)
      }, 3000)
    }

    return () => {
      if (timeOut) {
        clearTimeout(timeOut)
      }
      if (conversation) {
        conversation.removeListener('participantLeft', () => {})
        conversation.removeListener('participantJoined', () => {})
      }
      if (client) {
        client.removeAllListeners()
      }
    }
  }, [
    client,
    router,
    session,
    partiLeft,
    partiJoined,
    conversation,
    getParticipants,
  ])

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
        <AnimatePresence initial={false} mode="wait">
          {partiJoined && (
            <motion.div
              exit={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0, y: -5 }}
              key={partiJoined ? 'animate' : 'exit'}
            >
              <Text
                bg={notifBg}
                rounded="lg"
                fontSize="xs"
                px={{ base: 2, sm: 4 }}
                py={{ base: 1, sm: 2 }}
              >
                {getFriendlyName(partiJoined)} was added
              </Text>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence initial={false} mode="wait">
          {partiLeft && (
            <motion.div
              exit={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0, y: -10 }}
              key={partiLeft ? 'animate' : 'exit'}
            >
              <Text
                bg={notifBg}
                rounded="lg"
                fontSize="xs"
                px={{ base: 2, sm: 4 }}
                py={{ base: 1, sm: 2 }}
              >
                {getFriendlyName(partiLeft)} left
              </Text>
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>
      <Box
        px={4}
        bg={mainBg}
        overflowY="auto"
        py={{ base: 3, sm: 6 }}
        borderBottomEndRadius="md"
        borderBottomLeftRadius="md"
        display={{ base: 'flex', sm: 'inherit' }}
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
