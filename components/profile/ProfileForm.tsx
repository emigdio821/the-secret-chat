import {
  Box,
  Input,
  Stack,
  Button,
  Popover,
  IconButton,
  FormControl,
  PopoverBody,
  PopoverArrow,
  PopoverHeader,
  useDisclosure,
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
  PopoverCloseButton,
} from '@chakra-ui/react'
import { useState } from 'react'
import { BiEditAlt, BiGhost, BiCheck } from 'react-icons/bi'
import AlertError from 'components/AlertError'
import Spinner from 'components/Spinner'
import { Client } from '@twilio/conversations'
import { Session } from 'types'

interface CallbackProps {
  inputName: string
  onClose: () => void
  setInputName: (val: string) => void
}

interface ProfileFormProps {
  error: string
  client: Client
  session: Session
  isLoading: boolean
  setError: (val: string) => void
  callback: ({ setInputName, inputName, onClose }: CallbackProps) => void
}

export default function ProfileForm({
  error,
  client,
  session,
  callback,
  setError,
  isLoading,
}: ProfileFormProps) {
  const { user } = session
  const bg = useColorModeValue('#fafafa', '#262626')
  const { onOpen, onClose, isOpen } = useDisclosure()
  const btnHover = useColorModeValue('#fff', '#202020')
  const btnBg = useColorModeValue('#fafafa', '#222')
  const btnColor = useColorModeValue('#333', '#fafafa')
  const [inputName, setInputName] = useState<string>('')
  const sameName =
    client?.user.friendlyName === inputName || user.email === inputName
  const submitDisabled = isLoading || sameName || !inputName.trim()

  function formCleanup() {
    setError('')
    setInputName('')
  }

  function openPopover() {
    if (inputName || error) {
      formCleanup()
    }
    onOpen()
  }

  async function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault()
    callback({ setInputName, inputName, onClose })
  }

  return (
    <Box>
      <Popover
        isLazy
        isOpen={isOpen}
        onClose={onClose}
        autoFocus={false}
        onOpen={() => openPopover()}
      >
        <PopoverTrigger>
          <IconButton
            bg={btnBg}
            shadow="xl"
            color={btnColor}
            _hover={{
              bg: btnHover,
            }}
            _active={{
              bg: btnHover,
            }}
            icon={<BiEditAlt />}
            disabled={isLoading}
            aria-label="Edit profile"
          />
        </PopoverTrigger>
        <PopoverContent bg={bg} shadow="xl" maxW={280}>
          <PopoverArrow bg={bg} />
          <PopoverCloseButton />
          <PopoverHeader fontWeight={600}>Update profile</PopoverHeader>
          <PopoverBody>
            <form onSubmit={(e) => handleSubmitForm(e)}>
              <FormControl>
                <Input
                  mb={2}
                  size="sm"
                  rounded="md"
                  maxLength={30}
                  value={inputName}
                  disabled={isLoading}
                  focusBorderColor="#B2ABCC"
                  placeholder="Friendly name"
                  onChange={(e) => setInputName(e.target.value)}
                />
                {error && <AlertError error={error} />}
              </FormControl>
              <Stack align="flex-end">
                <Button
                  size="sm"
                  type="submit"
                  disabled={submitDisabled}
                  rightIcon={!isLoading ? <BiCheck /> : <Spinner />}
                >
                  {!isLoading ? 'Save' : <BiGhost size={16} />}
                </Button>
              </Stack>
            </form>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  )
}
