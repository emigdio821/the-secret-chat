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
  } catch (err) {
    return Promise.reject(err)
  }
}

export async function getMessages(conversation: Conversation) {
  try {
    const messages = await conversation.getMessages()
    return messages
  } catch (err) {
    return Promise.reject(err)
  }
}
