import { prisma } from '@prisma/client'
import { sectionSchema } from '../joi/schemas'

export const prismaGetSections = async (where) => {
  try {
    const validWhere = await sectionSchema.validateAsync(where)
    return await prisma.sections.findMany({
      where: validWhere,
      orderBy: {
        position: 'asc',
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaGetSection = async (where) => {
  try {
    const validWhere = await sectionSchema.validateAsync(where)
    return await prisma.sections.findUnique({
      where: validWhere,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPostSection = async (payload) => {
  try {
    const validPayload = await sectionSchema.validateAsync(payload)
    return await prisma.sections.create({
      data: validPayload,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPutSection = async (where, payload) => {
  const validPayload = await sectionSchema.validateAsync(payload)
  const validWhere = await sectionSchema.validateAsync(where)
  try {
    return await prisma.user.update({
      data: validPayload,
      where: validWhere,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}
