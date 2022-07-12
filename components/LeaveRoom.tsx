import { useRef } from 'react'
import { leaveRoom } from 'lib/chat'
import { BiLogOut } from 'react-icons/bi'
import actions from 'context/globalActions'
import { useGlobalContext } from 'context/global'
import {
  Box,
  Button,
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
import AlertError from './AlertError'

export default function LeaveRoom() {
  const router = useRouter()
  const cleanUp = useCleanup()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { dispatch, conversation, error } = useGlobalContext()

  async function handleLeaveRoom() {
    try {
      await leaveRoom(conversation)
      cleanUp()
      onClose()
      router.push('/')
    } catch (e) {
      dispatch({
        type: actions.addError,
        payload: 'Something went wrong while leaving the room, try again',
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
              <Box mb={2}>Are you sure you want to leave?</Box>
              {error && <AlertError error={error} />}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => handleCloseModal()}>
                Cancel
              </Button>
              <Button
                ml={3}
                colorScheme="red"
                leftIcon={<BiLogOut />}
                onClick={() => handleLeaveRoom()}
              >
                Leave
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Button
        bg={useColorModeValue('#333', '#262626')}
        color="#fafafa"
        _hover={{
          bg: '#444',
        }}
        _active={{
          bg: '#262626',
        }}
        leftIcon={<BiLogOut />}
        onClick={() => handleOpenModal()}
      >
        Leave
      </Button>
    </>
  )
}
