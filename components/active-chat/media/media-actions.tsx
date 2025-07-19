import { useId } from 'react'
import type { Conversation } from '@twilio/conversations'
import { ImageIcon, MicIcon, PaperclipIcon, Pause, SendHorizonal, Trash2, Upload } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
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
        description: `Only ${validExt.join(', ')} formats are supported`,
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
      console.error('[send_gif]', errMessage)
    }
  }

  async function handleSendAudio() {
    const audioBlob = await audioRecorder.stopRecording()
    if (!audioBlob || audioBlob.size === 0) return

    const audioToast = toast.loading('Processing audio...')

    try {
      const file = new File([audioBlob], 'audio-blob.webm', { type: audioBlob.type })
      const formData = new FormData()
      formData.append('file', file)

      await chat.sendMessage(formData)
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : err
      console.error('[send_audio]', errMessage)
    } finally {
      toast.dismiss(audioToast)
    }
  }

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="unstyled"
            aria-label="Media actions"
            className="text-muted-foreground hover:text-foreground data-[state=open]:text-foreground"
          >
            <PaperclipIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="max-w-52 min-w-40 overflow-hidden" // Add overflow hidden to help with height animation
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
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -5 }}
              key={audioRecorder.isRecording ? 'recording' : 'media'}
            >
              <DropdownMenuLabel>
                {audioRecorder.isRecording ? (
                  audioRecorder.isPaused ? (
                    <span>Paused</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Recording <MicIcon className="size-4 animate-pulse text-red-400" />
                    </span>
                  )
                ) : (
                  <span>Media</span>
                )}
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {audioRecorder.isRecording ? (
                <>
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={(e) => {
                      e.preventDefault()
                      audioRecorder.stopRecording()
                    }}
                  >
                    <Trash2 className="size-4" />
                    Cancel audio
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={(e) => {
                      e.preventDefault()
                      audioRecorder.togglePauseRecording()
                    }}
                  >
                    {audioRecorder.isPaused ? (
                      <>
                        <MicIcon className="size-4" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="size-4" />
                        Pause
                      </>
                    )}{' '}
                    audio
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={handleSendAudio}>
                    <SendHorizonal className="size-4" />
                    Send audio
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <GifPicker
                    trigger={
                      <DropdownMenuItem disabled={audioRecorder.isRecording} onSelect={(e) => e.preventDefault()}>
                        <ImageIcon className="size-4" />
                        GIF
                      </DropdownMenuItem>
                    }
                    callback={handleSendGif}
                  />
                  <DropdownMenuItem onSelect={handleUploadImage} disabled={audioRecorder.isRecording}>
                    <Upload className="size-4" />
                    Upload image
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={async (e) => {
                      e.preventDefault()
                      await audioRecorder.startRecording()
                    }}
                    disabled={audioRecorder.isRecording}
                  >
                    <MicIcon className="size-4" />
                    Record audio
                  </DropdownMenuItem>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </DropdownMenuContent>
      </DropdownMenu>
      <input type="file" id={fileInputId} accept="image/*" className="hidden" onChange={handleUploadImg} />
    </>
  )
}
