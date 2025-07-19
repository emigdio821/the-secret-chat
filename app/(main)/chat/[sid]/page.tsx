import { ActiveChatContainer } from '@/components/active-chat/active-chat-container'

interface ChatPageProps {
  params: Promise<{ sid: string }>
}

export default async function ChatPage(props: ChatPageProps) {
  const params = await props.params

  return <ActiveChatContainer chatId={params.sid} />
}
