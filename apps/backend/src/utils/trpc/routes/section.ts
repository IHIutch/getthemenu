import { prisma } from '@repo/db'
import * as z from 'zod/v4'

import { authedProcedure, router } from '../server'

export const sectionRouter = router({
  getByMenuPublicId: authedProcedure.input(
    z.object({
      menuPublicId: z.string(),
    }),
  ).query(async ({ input }) => {
    const { menuPublicId } = input

    return await prisma.sections.findMany({
      where: {
        menus: {
          publicId: menuPublicId,
        }
      },
      orderBy: {
        position: 'asc',
      },
    })
  }),
  update: authedProcedure.input(
    z.object({
      id: z.number(),
      data: z.object({
        title: z.string(),
        description: z.string(),
      }).partial(),
    }),
  ).mutation(async ({ input }) => {
    const { id, data } = input
    return await prisma.sections.update({
      where: {
        id,
      },
      data,
    })
  }),
})
