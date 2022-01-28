import prisma from '.'
import { menuSchema } from '../joi/schemas'

export const prismaGetMenus = async (where) => {
  try {
    const validWhere = await menuSchema.validateAsync(where)
    return await prisma.menus.findMany({
      where: validWhere,
      orderBy: {
        position: 'asc',
      },
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaGetMenu = async (where) => {
  try {
    const validWhere = await menuSchema.validateAsync(where)
    return await prisma.menus.findUnique({
      where: validWhere,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPostMenu = async (payload) => {
  try {
    const validPayload = await menuSchema.validateAsync(payload)
    return await prisma.menus.create({
      data: validPayload,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}

export const prismaPutMenu = async (where, payload) => {
  const validPayload = await menuSchema.validateAsync(payload)
  const validWhere = await menuSchema.validateAsync(where)
  try {
    return await prisma.user.update({
      data: validPayload,
      where: validWhere,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}
