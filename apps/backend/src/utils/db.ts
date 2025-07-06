import { getDb } from '@repo/db'

import { env } from './env'

const prisma = getDb()
export default prisma
