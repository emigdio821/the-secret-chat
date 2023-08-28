'use client'

import { Search } from 'lucide-react'

import { useStore } from '@/lib/store'
import { useTwilioClient } from '@/hooks/useTwilioClient'
import { Input } from '@/components/ui/input'

import { ChatList } from './chat-list'

export function UserChats() {
  const { error } = useTwilioClient()
  const client = useStore((state) => state.client)

  if (client?.connectionState === 'error') {
    return <p>Client error, refresh</p>
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">My chats</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input className="w-40 pl-9" placeholder="Search chats" />
        </div>
      </div>
      {client && <ChatList client={client} />}
      {error && <p>{error}</p>}
    </div>
  )
}
