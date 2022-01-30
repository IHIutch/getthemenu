import prisma from '@/utils/prisma'
import { userSchema } from '../joi/schemas'

export const prismaGetUsers = async (where) => {
  try {
    const validWhere = await userSchema.validateAsync(where)
    return await prisma.users.findMany({
      where: validWhere,
      include: {
        restaurants: {
          select: {
            id: true,
          },
        },
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaGetUser = async (where) => {
  try {
    const validWhere = await userSchema.validateAsync(where)
    return await prisma.users.findUnique({
      where: validWhere,
      include: {
        restaurants: {
          select: {
            id: true,
          },
        },
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPostUser = async (payload) => {
  try {
    const validPayload = await userSchema.validateAsync(payload)
    return await prisma.users.create({
      data: validPayload,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPutUser = async (where, payload) => {
  try {
    const validPayload = await userSchema.validateAsync(payload)
    const validWhere = await userSchema.validateAsync(where)
    return await prisma.users.update({
      data: validPayload,
      where: validWhere,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaDeleteUser = async (where) => {
  try {
    const validWhere = await userSchema.validateAsync(where)
    return await prisma.users.delete({
      where: validWhere,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}
