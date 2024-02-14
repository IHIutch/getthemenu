import prisma from '@/utils/prisma'
import { userSchema } from '../joi/schemas'
import { getErrorMessage } from '../functions'
import { UserSchema } from '../zod'
import { UserPostType } from '../axios/users'
import { Prisma } from '@prisma/client'

export const prismaGetUsers = async (where: { id: string }) => {
  try {
    UserSchema.parse(where)
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

export const prismaGetUser = async (where: Prisma.usersWhereUniqueInput) => {
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

interface UserPostWithIdType extends UserPostType {
  id: string
}

export const prismaPostUser = async (payload: UserPostWithIdType) => {
  try {
    UserSchema.parse(payload)
    return await prisma.users.create({
      data: payload,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaPutUser = async (where: { id: string }, payload: UserPostType) => {
  try {
    UserSchema.parse(where)
    UserSchema.parse(payload)
    return await prisma.users.update({
      data: payload,
      where,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaDeleteUser = async (where: { id: string }) => {
  try {
    UserSchema.parse(where)
    return await prisma.users.delete({
      where,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
