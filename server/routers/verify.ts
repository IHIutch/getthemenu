import prisma from '@/utils/prisma'
import { CustomHostSchema } from '@/utils/zod'
import GithubSlugger from 'github-slugger'
import { z } from 'zod'

import { authedProcedure, router } from '../init'

export const verifyRouter = router({
  checkCustomHost: authedProcedure.input(
    z.object({
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

    return {
      isAvailable: data.length === 0,
      suggestion: data.length > 0 ? suggestion : null,
    }
  }),
  checkCustomDomain: authedProcedure.input(
    z.object({
      customDomain: z.string(),
    }),
  ).mutation(async ({ input }) => {
    const { customDomain } = input
    const data = await prisma.restaurants.findFirst({
      where: {
        customDomain,
        // NOT: {
        //   customDomain: 'getthemenu.io',
        // },
      },
      select: {
        customDomain: true,
      },
    })
    console.log({ data })
    return {
      isAvailable: !data?.customDomain,
    }
  }),
})
