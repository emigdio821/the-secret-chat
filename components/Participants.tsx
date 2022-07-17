import { useEffect, useState } from 'react'
import { sortArray, isAdmin, getFriendlyName } from 'utils'
import { useSession } from 'next-auth/react'
import { useGlobalContext } from 'context/global'
import { Participant as Part } from '@twilio/conversations'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Box,
  Stack,
  Heading,
  useColorModeValue,
  Text,
  Badge,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import MotionDiv from './MotionDiv'
import Participant from './Participant'

export default function Participants() {
  const notifBg = useColorModeValue('gray.300', '#141414')
  const { conversation, client } = useGlobalContext()
  const mainBg = useColorModeValue('#EDEDED', '#272727')
  const [partiJoined, setPartiJoined] = useState<Part>()
  const [partiLeft, setPartiLeft] = useState<Part>()
  const [adminPart, setAdminPart] = useState<Part>()
  const [participants, setParticipants] = useState<Part[]>([])
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    async function getParticipants() {
      try {
        const parts = await conversation.getParticipants()
        sortArray(parts as [], 'identity', session?.user?.email || '')
        const admin = parts.find((p) => isAdmin(p))
        setAdminPart(admin)
        setParticipants(parts)
      } catch (err) {
        console.error('Failed to get participants ->', err)
      }
    }

    conversation.on('participantJoined', (participant) => {
      getParticipants()
      setPartiJoined(participant)
    })

    conversation.on('participantLeft', (participant) => {
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
  }, [client, router, session, partiLeft, partiJoined, conversation])

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
          <Heading size={{ base: 'xs', sm: 'sm' }}>Participants</Heading>
          {participants.length > 1 && (
            <Badge colorScheme="purple">{participants.length}</Badge>
          )}
        </Stack>
        <AnimatePresence initial={false} exitBeforeEnter>
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
                wordBreak="break-all"
                px={{ base: 2, sm: 4 }}
                py={{ base: 1, sm: 2 }}
              >
                {getFriendlyName(partiJoined)} added
              </Text>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence initial={false} exitBeforeEnter>
          {partiLeft && (
            <motion.div
              exit={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0, y: -10 }}
              key={partiLeft ? 'animate' : 'exit'}
            >
              <Text
                rounded="lg"
                bg={notifBg}
                fontSize="xs"
                wordBreak="break-all"
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
