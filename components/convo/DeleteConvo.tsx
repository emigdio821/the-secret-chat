import { useRef } from 'react'
import { deleteConvo } from 'lib/chat'
import { BiTrash } from 'react-icons/bi'
import actions from 'context/globalActions'
import { useGlobalContext } from 'context/global'
import {
  Box,
  Text,
  Button,
  MenuItem,
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
import useCleanup from 'hooks/useCleanup'
import { useRouter } from 'next/router'
import AlertError from 'components/AlertError'

export default function DeleteConvo() {
  const router = useRouter()
  const cleanUp = useCleanup()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { dispatch, conversation, error } = useGlobalContext()

  async function handleDeleteRoom() {
    try {
      await deleteConvo(conversation)
      cleanUp()
      onClose()
      router.push('/')
    } catch (e) {
      dispatch({
        type: actions.addError,
        payload: 'Something went wrong while deleting the room, try again',
      })
    }
  }

  function handleOpenModal() {
    if (error) {
      dispatch({
        type: actions.removeError,
      })
    }
    onOpen()
  }

  function handleCloseModal() {
    if (error) {
      dispatch({
        type: actions.removeError,
      })
    }
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
              {conversation.friendlyName || conversation.uniqueName}
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
        rounded="md"
        icon={<BiTrash size={16} color="#ff6961" />}
        onClick={() => handleOpenModal()}
      >
        <Text color="#ff6961">Delete room</Text>
      </MenuItem>
    </>
  )
}
