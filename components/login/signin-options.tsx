'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Icons } from '@/components/icons'

export function SignInOptions() {
  const [isLoading, setLoading] = useState(false)

  async function handleSignIn() {
    try {
      setLoading(true)
      await signIn('github', {
        redirectTo: '/',
      })
    } catch (err) {
      setLoading(false)
      const errMessage = err instanceof Error ? err.message : err
      console.error('[signin]', errMessage)

      toast.error('Error', {
        description: 'Unable to signin at this time, try again.',
      })
    }
  }

  return (
    <Button variant="outline" className="w-full" disabled={isLoading} onClick={handleSignIn}>
      {isLoading ? <Icons.Spinner className="size-4" /> : <Icons.Github className="size-4" />}
      Continue with Github
    </Button>
  )
}
