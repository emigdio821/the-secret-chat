import { type Conversation } from '@twilio/conversations'
import { useToggle } from '@uidotdev/usehooks'
import { ImageIcon, Mic, Paperclip, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { GifPicker } from './gif-picker'

export function MediaActions({ chat }: { chat: Conversation }) {
  const [openedGifDialog, setOpenedGifDialog] = useToggle(false)

  function handleUploadImage() {
    const fileInput = document.getElementById('file-input')
    fileInput?.click()
  }

  async function handleUploadImg(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault()
    const file = e.target.files?.[0]
    const formData = new FormData()
    const ext = file?.name.split('.').pop()
    const validExt = ['jpg', 'jpeg', 'png', 'gif']
    if (file && ext && validExt.includes(ext)) {
      const fileToast = toast.loading('Processing image...')
      formData.append('file', file)
      await chat.sendMessage(formData)
      toast.dismiss(fileToast)
      e.target.value = ''
    } else {
      toast.error('Invalid file type', {
        description: 'Only jpg, jpeg, png, and gif are supported',
      })
    }
  }

  async function handleSendGif(url: string) {
    try {
      await chat.sendMessage(url, {
        gif: true,
      })
      setOpenedGifDialog(false)
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.log('[SEND_GIF]', errMessage)
      return null
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <span className="sr-only">Media actions</span>
            <Paperclip className=" h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="max-w-[180px]">
          <DropdownMenuLabel>Media</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <GifPicker
            trigger={
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setOpenedGifDialog(true)
                }}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                GIF
              </DropdownMenuItem>
            }
            action={handleSendGif}
            isOpen={openedGifDialog}
            setOpen={setOpenedGifDialog}
          />
          <DropdownMenuItem onSelect={handleUploadImage}>
            <Upload className="mr-2 h-4 w-4" />
            Upload image
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Mic className="mr-2 h-4 w-4" />
            Record audio (WIP)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <input
        type="file"
        id="file-input"
        accept="image/*"
        className="hidden"
        onChange={handleUploadImg}
      />
    </>
  )
}
