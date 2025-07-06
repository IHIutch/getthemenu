import prisma from '~/utils/db'
import { z } from 'zod'

import { authedProcedure, router } from '../server'

export const menuRouter = router({
  getByPublicId: authedProcedure.input(
    z.string(),
  ).query(async ({
    input: publicId,
  }) => {
    return await prisma.menus.findUnique({
      where: {
        publicId,
      },
    })
  }),
  getAll: authedProcedure.input(
    z.object({
      publicId: z.string(),
    }),
  ).query(async ({
    input: { publicId },
  }) => {
    const menus = await prisma.restaurants.findUnique({
      where: {
        publicId,
      },
      select: {
        menus: true,
      },
    })
    return menus?.menus || []
  }),
})
