import {
  Box,
  Text,
  Button,
  MenuDivider,
  AlertDialog,
  useDisclosure,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  useColorModeValue,
  AlertDialogOverlay,
  AlertDialogContent,
} from '@chakra-ui/react'
import { useRef } from 'react'
import useStore from 'store/global'
import { deleteConvo } from 'lib/chat'
import { useRouter } from 'next/router'
import { BiTrash } from 'react-icons/bi'
import useCleanup from 'hooks/useCleanup'
import MenuItem from 'components/MenuItem'
import AlertError from 'components/AlertError'

export default function DeleteConvo() {
  const router = useRouter()
  const cleanUp = useCleanup()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { addError, conversation, error, removeError } = useStore()

  async function handleDeleteRoom() {
    try {
      if (conversation) await deleteConvo(conversation)
      cleanUp()
      onClose()
      router.push('/')
    } catch (e) {
      addError('Something went wrong while deleting the room, try again')
    }
  }

  function handleOpenModal() {
    if (error) removeError()
    onOpen()
  }

  function handleCloseModal() {
    if (error) removeError()
    onClose()
  }

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={() => handleCloseModal()}
      >
        <AlertDialogOverlay backdropFilter="blur(10px)">
          <AlertDialogContent bg={useColorModeValue('#fafafa', '#333')}>
            <AlertDialogHeader>
              {conversation?.friendlyName || conversation?.uniqueName}
            </AlertDialogHeader>
            <AlertDialogBody>
              <Box mb={2}>Are you sure you want to delete this room?</Box>
              {error && <AlertError error={error} />}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => handleCloseModal()}>
                Cancel
              </Button>
              <Button
                ml={3}
                colorScheme="red"
                leftIcon={<BiTrash />}
                onClick={() => handleDeleteRoom()}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <MenuDivider />
      <MenuItem
        icon={<BiTrash size={16} color="#ff6961" />}
        onClick={() => handleOpenModal()}
      >
        <Text color="#ff6961">Delete room</Text>
      </MenuItem>
    </>
  )
}
