import { ActiveChatContainer } from '@/components/active-chat/active-chat-container'

export async function generateMetadata(props: { searchParams: Promise<{ name: string }> }) {
  const searchParams = await props.searchParams
  const chatName = searchParams.name || 'Chat'

  return {
    title: {
      default: chatName,
      template: `%s · ${chatName}`,
    },
  }
}

export default async function ChatPage(props: { params: Promise<{ sid: string }> }) {
  const params = await props.params

  return <ActiveChatContainer chatId={params.sid} />
}
