import { prismaCreateFeedback } from '@/utils/prisma/feedback'
import { FeedbackSchema } from '@/utils/zod'
import { z } from 'zod'

import { authedProcedure, router } from '../init'

export const feedbackRouter = router({
  create: authedProcedure.input(
    z.object({
      payload: FeedbackSchema.omit({
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      }),
    }),
  ).mutation(async ({ input }) => {
    const { payload } = input
    const data = await prismaCreateFeedback({
      payload: {
        ...payload,
        users: {
          connect: {
            id: payload.userId,
          },
        },
      },
    })
    return data
  }),
})
