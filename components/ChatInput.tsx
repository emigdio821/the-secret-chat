import { useState } from 'react'
import { useGlobalContext } from 'context/global'
import { Box, Input, Stack, FormControl, IconButton } from '@chakra-ui/react'
import { BiSend } from 'react-icons/bi'

export default function ChatInput() {
  const [message, setMessage] = useState('')
  const { conversation } = useGlobalContext()

  async function handleTyping(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      setMessage(e.target.value)
      await conversation.typing()
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to send typing', err)
    }
  }

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    try {
      await conversation.sendMessage(message)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Something went wrong', err)
    }
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
              onChange={(e) => handleTyping(e)}
            />
          </FormControl>
          <IconButton
            type="submit"
            icon={<BiSend />}
            aria-label="Send"
            colorScheme="purple"
            disabled={!message.trim()}
          >
            Send
          </IconButton>
        </Stack>
      </form>
    </Box>
  )
}
