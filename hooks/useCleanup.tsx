import actions from 'context/globalActions'
import { useGlobalContext } from 'context/global'

export default function useCleanup() {
  const { dispatch, conversation } = useGlobalContext()

  function cleanUp() {
    if (conversation) {
      conversation.removeAllListeners()
    }
    dispatch({
      type: actions.removeConversation,
    })
    dispatch({
      type: actions.removeMessages,
    })
  }

  return cleanUp
}
