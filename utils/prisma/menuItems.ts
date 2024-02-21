import { Prisma } from '@prisma/client'
import prisma from '@/utils/prisma'
import { getErrorMessage } from '../functions'

export const prismaGetMenuItems = async ({ where }: { where: Prisma.menuItemsWhereInput }) => {
  try {
    return await prisma.menuItems.findMany({
      where,
      orderBy: {
        position: 'asc',
      },
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaGetMenuItem = async ({ where }: { where: Prisma.menuItemsWhereUniqueInput }) => {
  try {
    return await prisma.menuItems.findUnique({
      where,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaCreateMenuItem = async ({ payload }: { payload: Prisma.menuItemsCreateInput }) => {
  try {
    return await prisma.menuItems.create({
      data: payload,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaUpdateMenuItem = async ({ where, payload }: { where: Prisma.menuItemsWhereUniqueInput, payload: Prisma.menuItemsUpdateInput }) => {
  try {
    return await prisma.menuItems.update({
      where,
      data: payload
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

type MenuItemsUpdatePositionType = Pick<Prisma.Payload<typeof prisma.menuItems, 'update'>['scalars'], 'id' | 'position'>

export const prismaUpdateMenuItems = async ({ payload }: { payload: MenuItemsUpdatePositionType[] }) => {
  try {
    return await prisma.$transaction(
      payload.map((p) =>
        prisma.menuItems.update({
          data: {
            position: p.position
          },
          where: {
            id: p.id,
          },
        })
      )
    )
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaDeleteMenuItem = async ({ where }: { where: Prisma.menuItemsWhereUniqueInput }) => {
  try {
    return await prisma.menuItems.delete({
      where,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
