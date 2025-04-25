import prisma from '@/utils/prisma'
import { authedProcedure, router } from '@/utils/trpc'
import { CustomHostSchema } from '@/utils/zod'
import GithubSlugger from 'github-slugger'
import { z } from 'zod'

export const verifyRouter = router({
  checkCustomHost: authedProcedure.input(z.object({
    customHost: CustomHostSchema,
  }),
  ).mutation(async ({ input }) => {
    const { customHost } = input
    const data = await prisma.restaurants.findMany({
      where: {
        customHost: {
          startsWith: customHost,
        },
        NOT: {
          customHost: 'www',
        },
      },
      select: {
        customHost: true,
      },
    })

    const slugger = new GithubSlugger()

    data.forEach((d) => {
      if (!d.customHost)
        return
      return slugger.slug(d.customHost)
    })

    const suggestion = slugger.slug(customHost)

    return suggestion === customHost ? '' : suggestion
  }),
  checkCustomDomain: authedProcedure.input(z.object({
    customDomain: z.string().url(),
  })).mutation(async ({ input }) => {
    const { customDomain } = input
    const data = await prisma.restaurants.findMany({
      where: {
        customDomain: {
          startsWith: customDomain,
        },
        NOT: {
          customDomain: 'getthemenu.io',
        },
      },
      select: {
        customDomain: true,
      },
    })
    return data
  }),
})
