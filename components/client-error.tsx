import { useQueryClient } from '@tanstack/react-query'
import { RefreshCcw } from 'lucide-react'
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
        <RefreshCcw className="ml-2 h-4 w-4" />
      </Button>
    </div>
  )
}
