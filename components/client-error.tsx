import { useQueryClient } from '@tanstack/react-query'
import { RefreshCcwIcon } from 'lucide-react'
import { GET_CLIENT_QUERY } from '@/lib/constants'
import { Button } from '@/components/ui/button'

export function ClientError({ errorMsg }: { errorMsg?: string }) {
  const queryClient = useQueryClient()

  return (
    <div className="flex flex-col gap-2 text-sm">
      {errorMsg ?? 'Something went wrong while initializing the client.'}
      <Button
        className="self-start"
        variant="outline"
        onClick={async () => {
          await queryClient.fetchQuery({
            queryKey: [GET_CLIENT_QUERY],
          })
        }}
      >
        Reload client
        <RefreshCcwIcon className="ml-2 size-4" />
      </Button>
    </div>
  )
}
