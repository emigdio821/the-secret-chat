import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { type Client, type Conversation } from '@twilio/conversations'
import { useDebounce } from '@uidotdev/usehooks'
import { MessageSquareDashed, RefreshCcw, Search } from 'lucide-react'
import { type Session } from 'next-auth'

import { USER_CHATS_QUERY } from '@/lib/constants'
import { sortArray } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChatsSkeleton } from '@/components/skeletons'

import { ChatCardItem } from './chat-card-item'

interface ChatListProps {
  client: Client
  session: Session
}

export function MyChats({ client, session }: ChatListProps) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const { data, error, isLoading, refetch } = useQuery([USER_CHATS_QUERY], getChats, {
    select: filterBySearch,
  })

  async function getChats() {
    try {
      const chats = await client.getSubscribedConversations()
      sortArray({ items: chats.items, key: 'friendlyName' })

      return chats.items
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.log('[GET_CHATS]', errMessage)
      return []
    }
  }

  function filterBySearch(chats: Conversation[] | undefined) {
    const searchText = debouncedSearch.trim()
    if (!searchText || !search) return chats

    return chats?.filter(
      (chat) => chat.uniqueName?.toLowerCase().includes(searchText.toLocaleLowerCase()),
    )
  }

  if (error) {
    return (
      <div className="mt-4 flex flex-col gap-2 text-sm">
        Something went wrong while fetching your chats.
        <Button
          className="self-start"
          variant="outline"
          onClick={async () => {
            await refetch()
          }}
        >
          Re-fetch chats
          <RefreshCcw className="ml-2 h-4 w-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="mt-4">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold">My chats</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={async () => {
              await refetch()
            }}
          >
            <span className="hidden sm:block">Refresh</span>
            <RefreshCcw className="h-4 w-4 sm:ml-2" />
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              disabled={isLoading}
              className="w-40 pl-9"
              onChange={(e) => {
                setSearch(e.target.value)
              }}
              name="search-chats"
              placeholder="Search chats"
            />
          </div>
        </div>
      </div>
      {isLoading ? (
        <ChatsSkeleton />
      ) : (
        <>
          {data && data.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {data.map((chat) => (
                <ChatCardItem key={chat.sid} chat={chat} session={session} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 rounded-lg border p-4 text-sm">
              <MessageSquareDashed className="h-4 w-4" />
              <span>{search ? 'No chats found' : 'No chats yet'}</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
