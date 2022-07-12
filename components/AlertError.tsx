import { motion } from 'framer-motion'
import { Alert, AlertIcon, Box, AlertDescription } from '@chakra-ui/react'

export default function AlertError({ error }: { error: string }) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      initial={{ opacity: 0, y: -10 }}
    >
      <Alert p={2} size="sm" rounded="md" status="error" variant="left-accent">
        <AlertIcon boxSize={4} />
        <Box>
          <AlertDescription fontSize="xs">{error}</AlertDescription>
        </Box>
      </Alert>
    </motion.div>
  )
}
