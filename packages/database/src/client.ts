import { PrismaPg } from '@prisma/adapter-pg'
import process from 'node:process'

import { PrismaClient } from './generated/prisma/client'

// import { withAccelerate } from '@prisma/extension-accelerate'

function prismaClientSingleton() {
  const adapter = new PrismaPg({
    connectionString: process.env.POSTGRES_PRISMA_URL,
  })
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    adapter,
  })
  // .$extends(withAccelerate())
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
