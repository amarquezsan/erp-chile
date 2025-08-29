
import { prisma } from '@/lib/prisma'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new prisma()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
