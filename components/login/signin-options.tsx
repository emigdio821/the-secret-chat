'use client'

import { useToggle } from '@mantine/hooks'
import { Github } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Loader } from '@/components/icons'

export function SignInOptions() {
  const [isLoading, setLoading] = useToggle()

  async function handleSignIn() {
    try {
      setLoading(true)
      await signIn('github', {
        callbackUrl: '/',
      })
    } catch (err) {
      setLoading(false)
      const errMessage = err instanceof Error ? err.message : err
      console.log('[LOGIN]', errMessage)
      toast.error('Uh oh!', {
        description: 'Something went wrong while signing in, try again',
      })
    }
  }

  return (
    <Button variant="outline" disabled={isLoading} onClick={handleSignIn}>
      Continue with Github
      {isLoading ? (
        <Loader className="ml-2" barsClassName="bg-primary" />
      ) : (
        <Github className="ml-2 h-4 w-4" />
      )}
    </Button>
  )
}
