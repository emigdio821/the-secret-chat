export interface Session {
  user: {
    name: string
    email: string
    image: string
  }
}

export interface ModalCallbackProps {
  inputVal: string
  onClose: () => void
  setInputVal: (val: string) => void
}
