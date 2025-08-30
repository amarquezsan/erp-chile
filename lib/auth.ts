
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { findUser, validatePassword } from '@/lib/mock-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

      const user = findUser(credentials.email)

        if (!user || !user.password) {
          return null
        }

const isValid = validatePassword(credentials.password, user.password)
        
if (!isValid) {
  return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          firstName: user.firstName,
          lastName: user.lastName,
          
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.companyId = user.companyId
        token.companyName = user.companyName
        token.firstName = user.firstName
        token.lastName = user.lastName
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub || ''
        session.user.companyId = (token.companyId as string) || ''
        session.user.companyName = (token.companyName as string) || ''
        session.user.firstName = (token.firstName as string) || ''
        session.user.lastName = (token.lastName as string) || ''
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin'
  }
}
