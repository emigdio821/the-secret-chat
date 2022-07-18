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
  PopoverContent,
  PopoverTrigger,
  useColorModeValue,
  PopoverCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { Conversation } from '@twilio/conversations'
import { useGlobalContext } from 'context/global'
import { useState } from 'react'
import { BiEditAlt, BiGhost, BiCheck } from 'react-icons/bi'
import actions from 'context/globalActions'
import AlertError from 'components/AlertError'
import Spinner from 'components/Spinner'

interface EditComboProps {
  convo: Conversation
}

export default function EditConvo({ convo }: EditComboProps) {
  const { uniqueName, attributes } = convo
  const [error, setError] = useState<string>('')
  const bg = useColorModeValue('#fafafa', '#262626')
  const [nameVal, setNameVal] = useState<string>('')
  const [descVal, setDescVal] = useState<string>('')
  const { isLoading, dispatch } = useGlobalContext()
  const { onOpen, onClose, isOpen } = useDisclosure()
  // @ts-ignore
  const description = attributes.description || 'Description'
  const isSubmitDisabled = isLoading
  const btnHover = useColorModeValue('#fff', '#222')
  const btnBg = useColorModeValue('#fafafa', '#262626')
  const btnColor = useColorModeValue('#333', '#fafafa')

  function formCleanup() {
    setError('')
    setNameVal('')
    setDescVal('')
  }

  function openPopover() {
    if (nameVal || descVal) {
      formCleanup()
    }
    onOpen()
  }

  async function handleSubmitForm(e: React.FormEvent) {
    e.preventDefault()
    dispatch({ type: actions.setLoading })
    if (!isLoading) {
      try {
        await convo.updateUniqueName(nameVal.trim() || uniqueName)
        await convo.updateFriendlyName(nameVal.trim() || uniqueName || '')
        await convo.updateAttributes({ description: descVal || description })
        onClose()
        formCleanup()
      } catch (err) {
        console.error('The convo could not be updated ->', err)
        setError('Name already exists')
      }
    }
    dispatch({ type: actions.removeLoading })
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
            size="sm"
            shadow="sm"
            bg={btnBg}
            color={btnColor}
            _hover={{
              bg: btnHover,
            }}
            _active={{
              bg: btnHover,
            }}
            icon={<BiEditAlt />}
            aria-label="Edit Convo"
          />
        </PopoverTrigger>
        <PopoverContent bg={bg} shadow="xl" maxW={{ base: 220, sm: 380 }}>
          <PopoverArrow bg={bg} />
          <PopoverCloseButton />
          <PopoverHeader fontWeight={600}>Edit room</PopoverHeader>
          <PopoverBody>
            <form onSubmit={(e) => handleSubmitForm(e)}>
              <FormControl my={2}>
                <Input
                  mb={2}
                  size="sm"
                  rounded="md"
                  maxLength={30}
                  value={nameVal}
                  disabled={isLoading}
                  focusBorderColor="#B2ABCC"
                  placeholder={uniqueName || 'Unique name'}
                  onChange={(e) => setNameVal(e.target.value)}
                />
                <Input
                  size="sm"
                  rounded="md"
                  maxLength={50}
                  value={descVal}
                  mb={error ? 2 : 0}
                  disabled={isLoading}
                  placeholder={description}
                  focusBorderColor="#B2ABCC"
                  onChange={(e) => setDescVal(e.target.value)}
                />
                {error && <AlertError error={error} />}
              </FormControl>
              <Stack align="flex-end">
                <Button
                  size="sm"
                  type="submit"
                  disabled={isSubmitDisabled}
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
