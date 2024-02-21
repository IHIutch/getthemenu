import prisma from '@/utils/prisma'
import { Prisma } from '@prisma/client'
import { getErrorMessage } from '../functions'

export const prismaGetSections = async ({ where }: { where: Prisma.sectionsWhereInput }) => {
  try {
    return await prisma.sections.findMany({
      where,
      orderBy: {
        position: 'asc',
      },
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaGetSection = async ({ where }: { where: Prisma.sectionsWhereUniqueInput }) => {
  try {
    return await prisma.sections.findUnique({
      where,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaCreateSection = async ({ payload }: { payload: Prisma.sectionsCreateInput }) => {
  try {
    return await prisma.sections.create({
      data: payload,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export const prismaUpdateSection = async ({ where, payload }: { where: Prisma.sectionsWhereUniqueInput, payload: Prisma.sectionsUpdateInput }) => {
  try {
    return await prisma.sections.update({
      where,
      data: payload,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

type SectionsUpdatePositionType = Pick<Prisma.Payload<typeof prisma.sections, 'update'>['scalars'], 'id' | 'position'>

export const prismaUpdateSections = async ({ payload }: { payload: SectionsUpdatePositionType[] }) => {
  try {
    return await prisma.$transaction(
      payload.map((p) =>
        prisma.sections.update({
          data: p,
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

export const prismaDeleteSection = async ({ where }: { where: Prisma.sectionsWhereUniqueInput }) => {
  try {
    return await prisma.sections.delete({
      where,
    })
  } catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
