import { Conversation } from '@twilio/conversations'

interface SendMessageProps {
  message: string
  conversation: Conversation
}

export async function sendMessage({ message, conversation }: SendMessageProps) {
  if (conversation.status === 'joined') {
    await conversation.sendMessage(message)
  } else {
    await conversation.join()
    await conversation.sendMessage(message)
  }
}

export async function leaveRoom(conversation: Conversation) {
  await conversation.leave()
}

export async function addParticipant(
  conversation: Conversation,
  participant: string,
) {
  try {
    const result = await conversation.add(participant)
    return result
  } catch (e) {
    return Promise.reject(e)
  }
}

export async function getMessages(conversation: Conversation) {
  const messages = await conversation.getMessages()
  return messages
}
