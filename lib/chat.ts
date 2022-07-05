import { Conversation, Paginator, Message } from '@twilio/conversations'

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
  let status
  try {
    status = await conversation.leave()
  } catch (error) {
    status = error
  }

  return status

  // if (conversation.status === 'joined') {
  //   await conversation.leave()
  // }
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

export async function getMessages(
  conversation: Conversation,
): Promise<Paginator<Message>> {
  const messages = await conversation.getMessages(30)
  return messages
}
