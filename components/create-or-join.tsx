import { MessageSquarePlus, MessagesSquare } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function CreateOrJoinChat() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" type="button">
        Create chat <MessageSquarePlus className="ml-2 h-4 w-4" />
      </Button>
      <Button variant="secondary" type="button">
        Join chat <MessagesSquare className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
