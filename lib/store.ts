import { type InitialState } from '@/types'
import { create } from 'zustand'

export const useStore = create<InitialState>((set) => ({
  error: '',
  messages: [],
  usersTyping: [],
  isLoading: false,
  client: undefined,
  conversation: undefined,
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
  addError: (error) => {
    set((state) => ({
      ...state,
      error,
    }))
  },
  removeError: () => {
    set((state) => ({
      ...state,
      error: '',
    }))
  },
  addLoading: () => {
    set((state) => ({
      ...state,
      isLoading: true,
    }))
  },
  removeLoading: () => {
    set((state) => ({
      ...state,
      isLoading: false,
    }))
  },
  addConversation: (convo) => {
    set((state) => ({
      ...state,
      conversation: convo,
    }))
  },
  removeConversation: () => {
    set((state) => ({
      ...state,
      conversation: undefined,
    }))
  },
  removeMessages: () => {
    set((state) => ({
      ...state,
      messages: [],
    }))
  },
  addMessage: (message) => {
    set((state) => ({
      ...state,
      messages: [...state.messages, message],
    }))
  },
  removeMessage: (message) => {
    set((state) => ({
      ...state,
      messages: state.messages.filter((m) => m.sid !== message.sid),
    }))
  },
  addMessages: (messages) => {
    set((state) => ({
      ...state,
      messages,
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
  removeUsersTyping: (participant) => {
    set((state) => ({
      ...state,
      usersTyping: state.usersTyping.filter((p) => p.sid !== participant.sid),
    }))
  },
}))
