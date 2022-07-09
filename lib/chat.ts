import { Conversation } from '@twilio/conversations'

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
