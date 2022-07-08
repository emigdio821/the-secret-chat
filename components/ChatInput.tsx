import { useState } from 'react'
import { sendMessage } from 'lib/chat'
import { useGlobalContext } from 'context/global'
import { Box, Input, Stack, FormControl, IconButton } from '@chakra-ui/react'
import { BiSend } from 'react-icons/bi'

export default function ChatInput() {
  const [message, setMessage] = useState('')
  const { conversation } = useGlobalContext()

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    await sendMessage({ conversation, message })
  }

  return (
    <Box mt={2}>
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
          <IconButton
            type="submit"
            colorScheme="purple"
            icon={<BiSend />}
            disabled={!message.trim()}
            aria-label="Send"
          >
            Send
          </IconButton>
        </Stack>
      </form>
    </Box>
  )
}
