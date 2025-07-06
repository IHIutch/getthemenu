import process from 'node:process'

import { PrismaClient } from './generated/prisma/client'

export function getDb() {
  // const pool = new PrismaPg({ connectionString })
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

  return prisma
}
