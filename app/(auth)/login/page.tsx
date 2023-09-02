import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/components/login/form'
import { SignInOptions } from '@/components/login/signin-options'

const isProd = process.env.NODE_ENV === 'production'

export default function LoginPage() {
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Start chatting now</CardDescription>
      </CardHeader>
      <CardContent>{isProd ? <SignInOptions /> : <LoginForm />}</CardContent>
    </Card>
  )
}
