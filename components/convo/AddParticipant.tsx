import { MenuItem, useDisclosure } from '@chakra-ui/react'
import { useGlobalContext } from 'context/global'
import actions from 'context/globalActions'
import { BiUserPlus } from 'react-icons/bi'
import { ModalCallbackProps } from 'types'
import ActionModal from 'components/ActionModal'

export default function AddParticipant() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { dispatch, conversation, client } = useGlobalContext()
  const handleAddParticipant = async ({
    inputVal: inVal,
    closeModal,
  }: ModalCallbackProps) => {
    dispatch({
      type: actions.setLoading,
    })
    const inputVal = inVal.trim()
    if (inputVal && client) {
      try {
        const user = await client.getUser(inputVal)
        await conversation.add(inputVal, {
          friendlyName: user.friendlyName,
        })
        closeModal()
      } catch {
        dispatch({
          type: actions.addError,
          payload: 'Doesn\'t exist or user is already here',
        })
      }
    }
    dispatch({
      type: actions.removeLoading,
    })
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
      <MenuItem rounded="md" icon={<BiUserPlus size={16} />} onClick={onOpen}>
        Add participant
      </MenuItem>
    </>
  )
}
