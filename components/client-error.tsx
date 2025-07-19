import { BugIcon, RotateCwIcon } from 'lucide-react'
import { useTwilioClientStore } from '@/lib/stores/twilio-client.store'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { TypographyH4 } from './ui/typography'

export function ClientError({ errorMsg }: { errorMsg?: string }) {
  const refreshClient = useTwilioClientStore((state) => state.refreshToken)

  return (
    <Card>
      <CardHeader className="flex flex-col items-center justify-center">
        <CardTitle className="mb-4">
          <BugIcon className="size-6" />
        </CardTitle>
        <TypographyH4>Error</TypographyH4>
        <CardDescription className="text-center">
          {errorMsg ?? 'Something went wrong while initializing the client.'}
        </CardDescription>
      </CardHeader>
      <CardFooter className="justify-center">
        <Button type="button" variant="outline" onClick={refreshClient}>
          <RotateCwIcon className="size-4" />
          Reload client
        </Button>
      </CardFooter>
    </Card>
  )
}
