import { useCallback, useState } from 'react'
import { useGlobalContext } from 'context/global'
import {
  Box,
  Input,
  Stack,
  FormControl,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react'
import { BiSend } from 'react-icons/bi'

export default function ChatInput() {
  const [message, setMessage] = useState('')
  const { conversation } = useGlobalContext()

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    try {
      await conversation.sendMessage(message)
    } catch (err) {
      console.error('Something went wrong ->', err)
    }
  }

  const handleTypingState = useCallback(
    async (e: React.KeyboardEvent) => {
      if (e.code === 'Enter') {
        return
      }

      try {
        await conversation.typing()
      } catch (err) {
        console.error('Something went wrong ->', err)
      }
    },
    [conversation],
  )

  return (
    <Box my={2}>
      <form onSubmit={handleSendMessage}>
        <Stack direction="row">
          <FormControl isRequired>
            <Input
              value={message}
              bg={useColorModeValue('#fafafa', '#272727')}
              placeholder="Message"
              focusBorderColor="#B2ABCC"
              onKeyDown={(e) => handleTypingState(e)}
              onChange={(e) => setMessage(e.target.value)}
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
