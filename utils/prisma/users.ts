import prisma from '@/utils/prisma'
import { getErrorMessage } from '../functions'
import { Prisma } from '@prisma/client'

export const prismaGetUsers = async ({ where }: { where: Prisma.usersWhereInput }) => {
  try {
    return await prisma.users.findMany({
      where,
      include: {
        restaurants: {
          select: {
            id: true,
          },
        },
      },
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaGetUser = async ({ where }: { where: Prisma.usersWhereUniqueInput }) => {
  try {
    return await prisma.users.findUnique({
      where,
      include: {
        restaurants: {
          select: {
            id: true,
          },
        },
      },
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaCreateUser = async ({ payload }: { payload: Prisma.usersCreateInput }) => {
  try {
    return await prisma.users.create({
      data: payload,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaUpdateUser = async ({ where, payload }: { where: Prisma.usersWhereUniqueInput, payload: Prisma.usersUpdateInput }) => {
  try {
    return await prisma.users.update({
      data: payload,
      where,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaDeleteUser = async ({ where }: { where: Prisma.usersWhereUniqueInput }) => {
  try {
    return await prisma.users.delete({
      where,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
