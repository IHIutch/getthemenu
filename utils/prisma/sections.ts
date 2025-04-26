import type { Prisma } from '@/prisma/generated'

import prisma from '@/utils/prisma'

import { getErrorMessage } from '../functions'

export async function prismaGetSections({ where }: { where: Prisma.sectionsWhereInput }) {
  try {
    return await prisma.sections.findMany({
      where,
      orderBy: {
        position: 'asc',
      },
    })
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function prismaGetSection({ where }: { where: Prisma.sectionsWhereUniqueInput }) {
  try {
    return await prisma.sections.findUnique({
      where,
    })
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function prismaCreateSection({ payload }: { payload: Prisma.sectionsCreateInput }) {
  try {
    return await prisma.sections.create({
      data: payload,
    })
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function prismaUpdateSection({ where, payload }: { where: Prisma.sectionsWhereUniqueInput, payload: Prisma.sectionsUpdateInput }) {
  try {
    return await prisma.sections.update({
      where,
      data: payload,
    })
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

type SectionsUpdatePositionType = Pick<Prisma.Payload<typeof prisma.sections, 'update'>['scalars'], 'id' | 'position'>

export async function prismaUpdateSections({ payload }: { payload: SectionsUpdatePositionType[] }) {
  try {
    return await prisma.$transaction(
      payload.map(p =>
        prisma.sections.update({
          data: p,
          where: {
            id: p.id,
          },
        }),
      ),
    )
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}

export async function prismaDeleteSection({ where }: { where: Prisma.sectionsWhereUniqueInput }) {
  try {
    return await prisma.sections.delete({
      where,
    })
  }
  catch (error) {
    throw new Error(getErrorMessage(error))
  }
}
