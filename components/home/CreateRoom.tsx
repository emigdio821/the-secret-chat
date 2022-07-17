import { useDisclosure } from '@chakra-ui/react'
import { BiMessageAltAdd } from 'react-icons/bi'
import { ModalCallbackProps } from 'types'
import ActionModal from 'components/ActionModal'
import CommonBtn from 'components/CommonBtn'

interface CreateRoomProps {
  action: ({ inputVal, closeModal }: ModalCallbackProps) => void
}

export default function CreateRoom({ action }: CreateRoomProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <ActionModal
        btnLabel="Add"
        isOpen={isOpen}
        onOpen={onOpen}
        action={action}
        additionalInput
        onClose={onClose}
        headerTitle="Create room"
        additionalInputLabel="Description"
      />
      <CommonBtn
        btnLabel="Create room"
        onClick={() => onOpen()}
        rightIcon={<BiMessageAltAdd />}
      />
    </>
  )
}
