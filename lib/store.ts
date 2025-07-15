import type { InitialState } from '@/types'
import { create } from 'zustand'

export const useStore = create<InitialState>((set) => ({
  usersTyping: [],
  client: undefined,
  addClient: (client) => {
    set((state) => ({
      ...state,
      client,
    }))
  },
  removeClient: () => {
    set((state) => ({
      ...state,
      client: undefined,
    }))
  },
  addUsersTyping: (participant) => {
    set((state) => {
      if (state.usersTyping.some((p) => p.sid === participant.sid)) {
        return state
      }

      return {
        ...state,
        usersTyping: [...state.usersTyping, participant],
      }
    })
  },
  removeUsersTyping: ({ participant, removeAll = false }) => {
    set((state) => ({
      ...state,
      usersTyping: removeAll || !participant ? [] : state.usersTyping.filter((p) => p.sid !== participant.sid),
    }))
  },
}))
