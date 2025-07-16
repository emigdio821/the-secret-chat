import type { Participant } from '@twilio/conversations'
import { create } from 'zustand'

interface TypingParticipantsStore {
  typingParticipants: Participant[]
  setTypingParticipant: (participant: Participant) => void
  removeTypingParticipant: (participant: Participant) => void
  removeAllTypingParticipants: () => void
}

export const useTypingParticipantsStore = create<TypingParticipantsStore>((set) => ({
  typingParticipants: [],
  setTypingParticipant: (participant) =>
    set((state) => {
      if (state.typingParticipants.some((part) => part.sid === participant.sid)) {
        return state
      }
      return { typingParticipants: [...state.typingParticipants, participant] }
    }),
  removeTypingParticipant: (participant) => {
    set((state) => ({ typingParticipants: state.typingParticipants.filter((part) => part.sid === participant.sid) }))
  },
  removeAllTypingParticipants: () => set({ typingParticipants: [] }),
}))
