import type { Emoji } from 'frimousse'
import {
  EmojiPickerContent,
  EmojiPickerSearch,
  EmojiPicker as PrimitiveEmojiPicker,
} from '@/components/ui/emoji-picker'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface EmojiPickerProps {
  callback: (value: Emoji) => void
  trigger: React.ReactNode
}

export function EmojiPicker({ callback, trigger }: EmojiPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <PrimitiveEmojiPicker
          className="h-80"
          onEmojiSelect={(value) => {
            callback(value)
          }}
        >
          <EmojiPickerSearch />
          <EmojiPickerContent />
        </PrimitiveEmojiPicker>
      </PopoverContent>
    </Popover>
  )
}
