import prisma from '~/utils/db'
import { z } from 'zod'

import { authedProcedure, router } from '../server'

export const restaurantRouter = router({
  getByPublicId: authedProcedure.input(
    z.string(),
  ).query(async ({
    input: publicId,
  }) => {
    const user = await prisma.restaurants.findUnique({
      where: {
        publicId,
      },
    })

    return user
  }),
})
