import prisma from '@/utils/prisma'
import { feedbackSchema } from '../joi/schemas'

export const prismaPostFeedback = async (payload) => {
  try {
    const validPayload = await feedbackSchema.validateAsync(payload)
    return await prisma.feedback.create({
      data: validPayload,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}
