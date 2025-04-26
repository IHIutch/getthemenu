import type { Prisma } from '@prisma/client'

import prisma from '@/utils/prisma'

import { getErrorMessage } from '../functions'

export async function prismaCreateFeedback({ payload }: { payload: Prisma.feedbackCreateInput }) {
  try {
    return await prisma.feedback.create({
      data: payload,
    })
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
