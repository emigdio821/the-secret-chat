import { Participant as Part } from '@twilio/conversations'
import { Box, Stack, Heading, useColorModeValue } from '@chakra-ui/react'
import { useGlobalContext } from 'context/global'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Participant from './Participant'

export default function Participants() {
  const mainBg = useColorModeValue('#E8E8E8', '#272727')
  const { conversation } = useGlobalContext()
  const [participants, setParticipants] = useState<Part[]>([])

  useEffect(() => {
    async function getParticipants() {
      const parts = await conversation.getParticipants()
      setParticipants(parts)
    }

    if (conversation) {
      getParticipants()
    }
  }, [conversation])

  return (
    <Stack spacing={0} w={{ base: '100%', sm: 200 }}>
      <Stack
        py={2}
        zIndex={1}
        bg={mainBg}
        borderTopEndRadius="md"
        borderTopLeftRadius="md"
        height={{ base: undefined, sm: '40px' }}
      >
        <Heading px={4} size="md">
          Participants
        </Heading>
      </Stack>
      <Box
        px={4}
        bg={mainBg}
        overflowY="auto"
        py={{ base: 4, sm: 6 }}
        borderBottomEndRadius="md"
        borderBottomLeftRadius="md"
        display={{ base: 'flex', sm: 'inherit' }}
        height={{ base: undefined, sm: 'calc(100% - 40px)' }}
      >
        {participants.length > 0 && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            initial={{ opacity: 0, y: -10 }}
          >
            <Stack direction={{ base: 'row', sm: 'column' }}>
              {participants.map((part: Part) => (
                <Participant key={part.sid} participant={part} />
              ))}
            </Stack>
          </motion.div>
        )}
      </Box>
    </Stack>
  )
}
