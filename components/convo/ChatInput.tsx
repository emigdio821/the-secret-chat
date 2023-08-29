import { useCallback, useState } from 'react'
import {
  Box,
  Input,
  Stack,
  InputGroup,
  IconButton,
  FormControl,
  useColorModeValue,
  InputRightElement,
} from '@chakra-ui/react'
import { BiSend } from 'react-icons/bi'
import useStore from 'store/global'
import Media from './Media'

export default function ChatInput() {
  const [message, setMessage] = useState('')
  const { conversation } = useStore()

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')
    try {
      await conversation?.sendMessage(message)
    } catch (err) {
      console.error('The message could not be sent ->', err)
    }
  }

  const handleTypingState = useCallback(
    async (e: React.KeyboardEvent) => {
      if (e.code === 'Enter') {
        return
      }

      try {
        await conversation?.typing()
      } catch (err) {
        console.error('Typing error ->', err)
      }
    },
    [conversation],
  )

  return (
    <Box my={2}>
      <form onSubmit={handleSendMessage}>
        <Stack direction="row">
          <FormControl isRequired>
            <InputGroup>
              <Input
                value={message}
                placeholder="Message"
                focusBorderColor="#B2ABCC"
                onKeyDown={async (e) => { await handleTypingState(e); }}
                bg={useColorModeValue('#fafafa', '#272727')}
                onChange={(e) => { setMessage(e.target.value); }}
              />
              <InputRightElement>
                <Media />
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <IconButton
            type="submit"
            icon={<BiSend />}
            aria-label="Send"
            colorScheme="purple"
            disabled={!message.trim()}
          />
        </Stack>
      </form>
    </Box>
  )
}
