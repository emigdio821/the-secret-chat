import { useDisclosure } from '@chakra-ui/react'
import { BiMessageAltDots } from 'react-icons/bi'
import { ModalCallbackProps } from 'types'
import ActionModal from 'components/ActionModal'
import CommonBtn from 'components/CommonBtn'

interface CreateRoomProps {
  action: ({ inputVal, closeModal }: ModalCallbackProps) => void
}

export default function JoinRoom({ action }: CreateRoomProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <ActionModal
        btnLabel="Join"
        isOpen={isOpen}
        onOpen={onOpen}
        action={action}
        onClose={onClose}
        headerTitle="Join room"
      />
      <CommonBtn
        btnLabel="Join room"
        onClick={() => onOpen()}
        rightIcon={<BiMessageAltDots />}
      />
    </>
  )
}
