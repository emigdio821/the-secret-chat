import { useState } from 'react'
import { sendMessage } from 'lib/chat'
import { useGlobalContext } from 'context/global'
import { Box, Input, Stack, Button, FormControl } from '@chakra-ui/react'

export default function ChatInput() {
  const [message, setMessage] = useState('')
  const { conversation } = useGlobalContext()

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    await sendMessage({ conversation, message })
  }

  return (
    <Box mt={6}>
      <form onSubmit={handleSendMessage}>
        <Stack direction="row">
          <FormControl isRequired>
            <Input
              value={message}
              placeholder="Message"
              focusBorderColor="#B2ABCC"
              onChange={(e) => setMessage(e.target.value)}
            />
          </FormControl>
          <Button disabled={!message.trim()} type="submit">
            Send
          </Button>
        </Stack>
      </form>
    </Box>
  )
}
