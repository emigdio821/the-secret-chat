import { Box, Text } from '@chakra-ui/react'
import CommonBtn from 'components/CommonBtn'
import { BiRefresh } from 'react-icons/bi'

interface ReconnectProps {
  error: string
  initClient: () => void
}

export default function Reconnect({ error, initClient }: ReconnectProps) {
  return (
    <Box>
      <Text size="md">{error}</Text>
      <CommonBtn
        btnLabel="Reconnect"
        onClick={() => initClient()}
        leftIcon={<BiRefresh />}
      />
    </Box>
  )
}
