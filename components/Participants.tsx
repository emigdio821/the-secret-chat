import { Participant as Part } from '@twilio/conversations'
import { Box, Stack, Heading, useColorModeValue, Text } from '@chakra-ui/react'
import { useGlobalContext } from 'context/global'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Participant from './Participant'
import MotionDiv from './MotionDiv'

export default function Participants() {
  const notifBg = useColorModeValue('gray.300', '#141414')
  const { conversation, client } = useGlobalContext()
  const mainBg = useColorModeValue('#E8E8E8', '#272727')
  const [partiJoined, setPartiJoined] = useState<Part>()
  const [partiLeft, setPartiLeft] = useState<Part>()
  const [participants, setParticipants] = useState<Part[]>([])

  useEffect(() => {
    async function getParticipants() {
      const parts = await conversation.getParticipants()
      setParticipants(parts)
    }

    client.on('participantJoined', (participant) => {
      getParticipants()
      setPartiJoined(participant)
    })

    client.on('participantLeft', (participant) => {
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
      if (client) {
        client.removeAllListeners()
      }
    }
  }, [conversation, client, partiJoined, partiLeft])

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
        <Heading px={4} pt={2} size={{ base: 'xs', sm: 'sm' }}>
          Participants
        </Heading>
        <AnimatePresence initial={false} exitBeforeEnter>
          {partiJoined && (
            <motion.div
              key={partiJoined ? 'animate' : 'exit'}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0, y: -5 }}
              exit={{ opacity: 0, y: -5 }}
            >
              <Text
                bg={notifBg}
                fontSize="xs"
                borderRadius="lg"
                wordBreak="break-all"
                px={{ base: 2, sm: 4 }}
                py={{ base: 1, sm: 2 }}
              >
                {partiJoined.identity} joined
              </Text>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence initial={false} exitBeforeEnter>
          {partiLeft && (
            <motion.div
              key={partiJoined ? 'animate' : 'exit'}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0, y: -10 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Text
                bg={notifBg}
                fontSize="xs"
                borderRadius="lg"
                wordBreak="break-all"
                px={{ base: 2, sm: 4 }}
                py={{ base: 1, sm: 2 }}
              >
                {partiLeft.identity} left
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
            <Stack direction={{ base: 'row', sm: 'column' }}>
              {participants.map((part: Part) => (
                <Participant key={part.sid} participant={part} />
              ))}
            </Stack>
          </MotionDiv>
        )}
      </Box>
    </Stack>
  )
}
