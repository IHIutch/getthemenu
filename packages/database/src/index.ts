import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from './generated/prisma/client'

export interface GetDbParams {
  connectionString: string
}

export function getDb({ connectionString }: GetDbParams) {
  const pool = new PrismaPg({ connectionString })
  const prisma = new PrismaClient({ adapter: pool })

  return prisma
}
