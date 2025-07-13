import { type AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
      authorization: {
        params: {
          scope: 'user:email',
        },
      },
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const user = {
          id: '1',
          name: 'Emigdio Torres',
          email: 'emigdio@dev.com',
        }
        const user2 = {
          id: '2',
          name: 'Lorenzo Rodríguez',
          email: 'lorenzo@dev.com',
        }
        const user3 = {
          id: '3',
          name: 'Lu Rodríguez',
          email: 'lupencia@test.com',
        }
        const isDevUser = credentials?.username === 'admin' && credentials.password === 'admin'
        const isDevUser2 = credentials?.username === 'admin2' && credentials.password === 'admin2'
        const isDevUser3 = credentials?.username === 'admin3' && credentials.password === 'admin3'

        if (isDevUser) {
          return user
        }
        if (isDevUser2) {
          return user2
        }
        if (isDevUser3) {
          return user3
        }
        return null
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token }) {
      return token
    },
  },
}
