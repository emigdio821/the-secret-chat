import { useRef } from 'react'
import { BiUserX } from 'react-icons/bi'
import actions from 'context/globalActions'
import { useGlobalContext } from 'context/global'
import {
  Box,
  Text,
  chakra,
  Button,
  MenuItem,
  AlertDialog,
  useDisclosure,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  useColorModeValue,
  AlertDialogOverlay,
  AlertDialogContent,
} from '@chakra-ui/react'
import AlertError from 'components/AlertError'
import { Conversation, Participant } from '@twilio/conversations'

interface DeleteParticipantProps {
  convo: Conversation
  participant: Participant
  friendlyName: string
}

export default function DeleteParticipant({
  convo,
  participant,
  friendlyName,
}: DeleteParticipantProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { dispatch, error } = useGlobalContext()

  async function handleKickParticipant() {
    try {
      await convo.removeParticipant(participant)
    } catch {
      dispatch({
        type: actions.addError,
        payload: 'Failed to kick participant, try again',
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
            <AlertDialogHeader>Kick participant</AlertDialogHeader>
            <AlertDialogBody>
              <Box mb={2}>
                Are you sure you want to kick{' '}
                <chakra.span fontWeight={600}>
                  {friendlyName || participant.identity}
                </chakra.span>
                ?
              </Box>
              {error && <AlertError error={error} />}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => handleCloseModal()}>
                Cancel
              </Button>
              <Button
                ml={3}
                colorScheme="red"
                leftIcon={<BiUserX />}
                onClick={() => handleKickParticipant()}
              >
                Kick!
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <MenuItem
        rounded="md"
        fontSize="xs"
        icon={<BiUserX size={16} color="#ff6961" />}
        onClick={() => handleOpenModal()}
      >
        <Text color="#ff6961">Kick</Text>
      </MenuItem>
    </>
  )
}
