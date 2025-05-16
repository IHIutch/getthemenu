import { updateCustomDomain } from '@/utils/customDomain'
import { authedProcedure, router } from '@/utils/trpc'
import { checkVercelDomain, createVercelDomain, deleteVercelDomain } from '@/utils/vercel'
import { z } from 'zod'

export const domainRouter = router({
  create: authedProcedure.input(
    z.object({
      domain: z.string().url(),
    }),
  ).mutation(async ({ input }) => {
    const { domain } = input
    return await createVercelDomain(domain)
  }),

  delete: authedProcedure.input(
    z.object({
      domain: z.string().url(),
    }),
  ).mutation(async ({ input }) => {
    const { domain } = input
    return await deleteVercelDomain(domain)
  }),

  update: authedProcedure.input(
    z.object({
      domain: z.string().url(),
    }),
  ).mutation(async ({ input }) => {
    const { domain } = input
    return await updateCustomDomain(domain)
  }),

  check: authedProcedure.input(
    z.object({
      domain: z.string().url(),
    }),
  ).mutation(async ({ input }) => {
    const { domain } = input
    return await checkVercelDomain(domain)
  }),
})
