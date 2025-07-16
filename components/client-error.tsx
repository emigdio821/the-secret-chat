import { useQueryClient } from '@tanstack/react-query'
import { BugIcon, RotateCwIcon } from 'lucide-react'
import { GET_CLIENT_QUERY } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { TypographyH4 } from './ui/typography'

export function ClientError({ errorMsg }: { errorMsg?: string }) {
  const queryClient = useQueryClient()

  return (
    <Card>
      <CardHeader className="flex flex-col items-center justify-center">
        <CardTitle className="mb-4">
          <BugIcon className="size-6" />
        </CardTitle>
        <TypographyH4>Error</TypographyH4>
        <CardDescription>{errorMsg ?? 'Something went wrong while initializing the client.'}</CardDescription>
      </CardHeader>
      <CardFooter className="justify-center">
        <Button
          variant="outline"
          onClick={async () => {
            await queryClient.fetchQuery({
              queryKey: [GET_CLIENT_QUERY],
            })
          }}
        >
          <RotateCwIcon className="size-4" />
          Reload client
        </Button>
      </CardFooter>
    </Card>
  )
}
