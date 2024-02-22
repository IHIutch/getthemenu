import prisma from '@/utils/prisma'
import { Prisma } from '@prisma/client'
import { getErrorMessage } from '../functions'

export const prismaCreateFeedback = async ({ payload }: { payload: Prisma.feedbackCreateInput }) => {
  try {
    return await prisma.feedback.create({
      data: payload,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
