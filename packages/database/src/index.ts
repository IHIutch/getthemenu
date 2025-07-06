import { PrismaClient } from '@prisma/client'
import process from 'node:process'

export interface GetDbParams {
  connectionString: string
}

export function getDb() {
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

  return prisma
}
