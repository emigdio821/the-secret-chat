import { useColorModeValue, Box, Text, Button } from '@chakra-ui/react'
import { BiRefresh } from 'react-icons/bi'

interface ReconnectProps {
  error: string
  initClient: () => void
}

export default function Reconnect({ error, initClient }: ReconnectProps) {
  return (
    <Box mt={6}>
      <Text size="md">{error}</Text>
      <Button
        color="#fafafa"
        bg={useColorModeValue('#333', '#262626')}
        _hover={{
          bg: '#444',
        }}
        _active={{
          bg: '#333',
        }}
        mt={2}
        leftIcon={<BiRefresh />}
        onClick={() => initClient()}
      >
        Reconnect
      </Button>
    </Box>
  )
}
