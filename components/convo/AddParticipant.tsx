import useStore from 'store/global'
import { ModalCallbackProps } from 'types'
import MenuItem from 'components/MenuItem'
import { BiUserPlus } from 'react-icons/bi'
import { useGlobalContext } from 'context/global'
import { useDisclosure } from '@chakra-ui/react'
import ActionModal from 'components/ActionModal'

export default function AddParticipant() {
  const { conversation } = useGlobalContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { addLoading, addError, removeLoading, client } = useStore()
  const handleAddParticipant = async ({
    inputVal: inVal,
    closeModal,
  }: ModalCallbackProps) => {
    addLoading()
    const inputVal = inVal.trim()
    if (inputVal && client) {
      try {
        const user = await client.getUser(inputVal)
        await conversation.add(inputVal, {
          friendlyName: user.friendlyName,
        })
        closeModal()
      } catch {
        addError('Doesn\'t exist or user is already here')
      }
    }
    removeLoading()
  }

  return (
    <>
      <ActionModal
        btnLabel="Add"
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        inputLabel="Username"
        action={handleAddParticipant}
        headerTitle="Add participant"
      />
      <MenuItem icon={<BiUserPlus size={16} />} onClick={onOpen}>
        Add participant
      </MenuItem>
    </>
  )
}
