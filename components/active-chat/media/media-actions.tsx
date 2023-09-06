import { type Conversation } from '@twilio/conversations'
import { useToggle } from '@uidotdev/usehooks'
import { Dot, ImageIcon, Mic, Paperclip, Pause, SendHorizonal, Trash2, Upload } from 'lucide-react'
import { toast } from 'sonner'

import { useAudioRecorder } from '@/hooks/use-audio-recorder'
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
  const audioRecorder = useAudioRecorder()
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
    }
  }

  async function handleSendAudio(blob: Blob) {
    try {
      const formData = new FormData()
      const audioToast = toast.loading('Processing audio...')
      formData.append('file', blob, 'audio-blob')
      formData.append('contentType', 'audio/wav')
      await chat.sendMessage(formData)
      toast.dismiss(audioToast)
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.log('[SEND_AUDIO]', errMessage)
    }
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <span className="sr-only">Media actions</span>
            <Paperclip className=" h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="max-w-[180px]"
          onEscapeKeyDown={(e) => {
            if (audioRecorder.isRecording) {
              e.preventDefault()
            }
          }}
          onInteractOutside={(e) => {
            if (audioRecorder.isRecording) {
              e.preventDefault()
            }
          }}
        >
          <DropdownMenuLabel>
            {audioRecorder.isRecording ? (
              <>
                {audioRecorder.isPaused ? (
                  'Paused'
                ) : (
                  <span className="flex animate-pulse items-center gap-1">
                    Recording <Dot className="h-5 w-5 text-red-400" />
                  </span>
                )}
              </>
            ) : (
              'Media'
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {!audioRecorder.isRecording && (
            <>
              <GifPicker
                trigger={
                  <DropdownMenuItem
                    disabled={audioRecorder.isRecording}
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
              <DropdownMenuItem onSelect={handleUploadImage} disabled={audioRecorder.isRecording}>
                <Upload className="mr-2 h-4 w-4" />
                Upload image
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={async (e) => {
                  e.preventDefault()
                  await audioRecorder.startRecording()
                }}
                disabled={audioRecorder.isRecording}
              >
                <Mic className="mr-2 h-4 w-4" />
                Record audio
              </DropdownMenuItem>
            </>
          )}
          {audioRecorder.isRecording && (
            <>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  audioRecorder.togglePauseResume()
                }}
              >
                <Pause className="mr-2 h-4 w-4" />
                {audioRecorder.isPaused ? 'Resume' : 'Pause'} audio
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  audioRecorder.stopRecording()
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Cancel audio
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={async () => {
                  const blob = audioRecorder.stopRecording()
                  if (blob) {
                    await handleSendAudio(blob)
                  }
                }}
              >
                <SendHorizonal className="mr-2 h-4 w-4" />
                Send audio
              </DropdownMenuItem>
            </>
          )}
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
