import { useGlobalContext } from 'context/global'
import actions from 'context/globalActions'
import { BiUserPlus } from 'react-icons/bi'
import { ModalCallbackProps } from 'types'
import ActionModal from './ActionModal'

export default function AddParticipant() {
  const { dispatch, conversation, client } = useGlobalContext()
  const handleAddParticipant = async ({
    onClose,
    setInputVal,
    inputVal: inVal,
  }: ModalCallbackProps) => {
    dispatch({
      type: actions.setLoading,
    })
    const inputVal = inVal.trim()
    if (inputVal && client) {
      try {
        await conversation.add(inputVal.trim())
        onClose()
      } catch {
        dispatch({
          type: actions.addError,
          payload: 'Failed to add participant',
        })
      }
    }
    setInputVal('')
    dispatch({
      type: actions.removeLoading,
    })
  }

  return (
    <ActionModal
      btnLabel="Add"
      mainBtnLbl="Add"
      BtnIcon={BiUserPlus}
      inputLabel="Participant name"
      action={handleAddParticipant}
      headerTitle="Add participant"
    />
  )
}
