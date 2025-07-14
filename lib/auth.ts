import NextAuth from 'next-auth'
import type { Provider } from 'next-auth/providers'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'

const providers: Provider[] = [GitHub]

if (process.env.NODE_ENV !== 'production') {
  providers.push(
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize(credentials) {
        const testUser = {
          id: '1',
          name: 'Emigdio Torres',
          email: 'emigdio@dev.com',
        }

        if (credentials?.username === 'admin' && credentials.password === 'admin') {
          return testUser
        }

        return null
      },
    }),
  )
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers,
})
