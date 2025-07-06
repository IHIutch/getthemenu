import { getDb } from '@repo/db'

import { env } from './env'

const prisma = getDb({ connectionString: env.POSTGRES_URL_NON_POOLING })
export default prisma
