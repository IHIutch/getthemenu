import { appRouter } from '@/server'
import { createCallerFactory } from '@/utils/trpc'

export const createCaller = createCallerFactory(appRouter)

