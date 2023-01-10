import create from 'zustand'
import { InitialState } from 'types'

const useStore = create<InitialState>((set) => ({
  error: '',
  messages: [],
  usersTyping: [],
  isLoading: false,
  client: undefined,
  conversation: undefined,
  addClient: (payload) =>
    set((state) => ({
      ...state,
      client: payload,
    })),
  removeClient: () =>
    set((state) => ({
      ...state,
      client: undefined,
    })),
  addError: (payload) =>
    set((state) => ({
      ...state,
      error: payload,
    })),
  removeError: () =>
    set((state) => ({
      ...state,
      error: '',
    })),
  addLoading: () =>
    set((state) => ({
      ...state,
      isLoading: true,
    })),
  removeLoading: () =>
    set((state) => ({
      ...state,
      isLoading: false,
    })),
  addConversation: (payload) =>
    set((state) => ({
      ...state,
      conversation: payload,
    })),
  removeConversation: () =>
    set((state) => ({
      ...state,
      conversation: undefined,
    })),
  removeMessages: () =>
    set((state) => ({
      ...state,
      messages: [],
    })),
}))

export default useStore
