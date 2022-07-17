import { useGlobalContext } from 'context/global'
import actions from 'context/globalActions'
import { BiUserPlus } from 'react-icons/bi'
import { ModalCallbackProps } from 'types'
import ActionModal from './ActionModal'

export default function AddParticipant() {
  const { dispatch, conversation, client } = useGlobalContext()
  const handleAddParticipant = async ({
    onClose,
    inputVal: inVal,
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
        onClose()
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
    <ActionModal
      btnLabel="Add"
      mainBtnLbl="Add"
      BtnIcon={BiUserPlus}
      inputLabel="Username"
      action={handleAddParticipant}
      headerTitle="Add participant"
    />
  )
}
