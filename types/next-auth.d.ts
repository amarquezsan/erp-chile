
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      firstName: string
      lastName: string
      companyId: string
      companyName: string
    }
  }

  interface User {
    companyId?: string | null
    companyName?: string | null
    firstName?: string | null
    lastName?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    companyId?: string | null
    companyName?: string | null
    firstName?: string | null
    lastName?: string | null
  }
}
