import { useState } from 'react'
import { type Client, type Conversation } from '@twilio/conversations'
import { useDebounce } from '@uidotdev/usehooks'
import { RefreshCcw, Search } from 'lucide-react'
import { type Session } from 'next-auth'
import { useQuery } from 'react-query'

import { CHATS_QUERY } from '@/lib/constants'
import { sortArray } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { ChatCardItem } from './chat-card-item'
import { ChatsSkeleton } from './chats-skeleton'

interface ChatListProps {
  client: Client
  session: Session
}

export function ChatList({ client, session }: ChatListProps) {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  async function getChats() {
    try {
      const chats = await client.getSubscribedConversations()
      sortArray({ items: chats.items, sortBy: 'friendlyName' })

      return chats.items
    } catch (err) {
      console.error('[GET_CHATS]', err)
    }
  }

  function filterBySearch(chats: Conversation[] | undefined) {
    const searchText = debouncedSearch.trim()
    if (!searchText || !search) return chats

    return chats?.filter(
      (chat) => chat.uniqueName?.toLowerCase().includes(searchText.toLocaleLowerCase()),
    )
  }

  const { data, error, isLoading, refetch } = useQuery([CHATS_QUERY], getChats, {
    select: filterBySearch,
  })

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
            <p>{search ? 'No chats found' : 'No chats yet'}</p>
          )}
        </>
      )}
    </div>
  )
}
