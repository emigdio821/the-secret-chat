import { SmilePlus } from 'lucide-react'
import { useTheme } from 'next-themes'
import '@/styles/emoji-picker.css'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface Emoji {
  id: string
  keywords: string[]
  name: string
  native: string
  shortcodes: string
  unified: string
}

interface EmojiPickerProps {
  callback: (emoji: Emoji) => void
  trigger?: React.ReactNode
}

export function EmojiPicker({ callback, trigger }: EmojiPickerProps) {
  const { resolvedTheme } = useTheme()

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger ?? (
          <Button size="icon" variant="ghost" className="h-6 w-6">
            <SmilePlus className="h-4 w-4" />
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="border-none p-0">
        {/* <Picker
          data={data}
          onEmojiSelect={(emoji: Emoji) => {
            callback(emoji)
          }}
          theme={resolvedTheme}
        /> */}
        WIP...
      </PopoverContent>
    </Popover>
  )
}
