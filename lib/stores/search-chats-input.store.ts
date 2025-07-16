import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SearchChatsInputStore {
  search: string
  setSearch: (value: string) => void
}

export const useSearchChatsInputStore = create<SearchChatsInputStore>()(
  persist(
    (set) => ({
      search: '',
      setSearch: (value) => set({ search: value }),
    }),
    {
      name: 'search-chats-value',
    },
  ),
)
