const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Setting up database...')
  // Esto forzará la creación de tablas
  await prisma.$connect()
  console.log('Database connected successfully!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
