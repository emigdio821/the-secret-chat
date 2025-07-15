import { useId } from 'react'
import type { Conversation } from '@twilio/conversations'
import { ImageIcon, Mic, Paperclip, Pause, SendHorizonal, Trash2, Upload } from 'lucide-react'
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
import { GifPicker } from '@/components/gif-picker'

export function MediaActions({ chat }: { chat: Conversation }) {
  const fileInputId = useId()
  const audioRecorder = useAudioRecorder()
  function handleUploadImage() {
    const fileInput = document.getElementById(fileInputId)
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
        description: 'Only jpg, jpeg, png, and gif formats are supported',
      })
    }
  }

  async function handleSendGif(url: string) {
    try {
      await chat.sendMessage(url, {
        gif: true,
      })
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.log('[SEND_GIF]', errMessage)
    }
  }

  async function handleSendAudio(blob: Blob) {
    if (blob.size === 0) return
    const audioToast = toast.loading('Processing audio...')
    try {
      const formData = new FormData()
      formData.append('file', blob, 'audio-blob.mp3')
      await chat.sendMessage(formData)
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.log('[SEND_AUDIO]', errMessage)
    } finally {
      toast.dismiss(audioToast)
    }
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-6">
            <span className="sr-only">Media actions</span>
            <Paperclip className="size-4" />
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
              audioRecorder.isPaused ? (
                'Paused'
              ) : (
                <span className="flex items-center gap-2">
                  Recording <Mic className="size-4 animate-pulse text-red-400" />
                </span>
              )
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
                    }}
                  >
                    <ImageIcon className="mr-2 size-4" />
                    GIF
                  </DropdownMenuItem>
                }
                callback={handleSendGif}
              />
              <DropdownMenuItem onSelect={handleUploadImage} disabled={audioRecorder.isRecording}>
                <Upload className="mr-2 size-4" />
                Upload image
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={async (e) => {
                  e.preventDefault()
                  await audioRecorder.startRecording()
                }}
                disabled={audioRecorder.isRecording}
              >
                <Mic className="mr-2 size-4" />
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
                {audioRecorder.isPaused ? (
                  <>
                    <Mic className="mr-2 size-4" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="mr-2 size-4" />
                    Pause
                  </>
                )}{' '}
                audio
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  audioRecorder.stopRecording()
                }}
              >
                <Trash2 className="mr-2 size-4" />
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
                <SendHorizonal className="mr-2 size-4" />
                Send audio
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <input type="file" id={fileInputId} accept="image/*" className="hidden" onChange={handleUploadImg} />
    </>
  )
}
