import useStore from 'store/global'

export default function useCleanup() {
  const { conversation, removeConversation, removeMessages } = useStore()

  function cleanUp() {
    if (conversation) {
      conversation.removeAllListeners()
    }
    removeMessages()
    removeConversation()
  }

  return cleanUp
}
