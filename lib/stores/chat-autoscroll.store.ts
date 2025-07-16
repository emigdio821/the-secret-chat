import { create } from 'zustand'

interface ChatAutoScrollStore {
  autoScroll: boolean
  setAutoScroll: (option: boolean) => void
}

export const useChatAutoScrollStore = create<ChatAutoScrollStore>((set) => ({
  autoScroll: true,
  setAutoScroll: (option) => set({ autoScroll: option }),
}))
