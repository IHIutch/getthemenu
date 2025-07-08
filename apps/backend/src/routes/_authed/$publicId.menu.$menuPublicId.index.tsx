import { Box } from '@chakra-ui/react'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import prisma from '../../utils/db'

const fetchMenuData = createServerFn({ method: 'GET' })
  .validator((publicId: unknown) => {
    return {
      publicId: z.string().parse(publicId),
    }
  })
  .handler(async ({ data }) => {
    const menu = await prisma.menus.findUnique({
      where: {
        publicId: data.publicId,
      },
    })
    return { menu }
  })

export const Route = createFileRoute('/_authed/$publicId/menu/$menuPublicId/')({
  loader: async ({
    // context: { trpc, queryClient },
    params: { menuPublicId },
  }) => {
    const { menu } = await fetchMenuData({ data: menuPublicId })

    if (!menu) {
      throw notFound()
    }

    return { menu }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { menu } = Route.useLoaderData()

  return (
    <Box>
      <pre>{JSON.stringify({ menu }, null, 2)}</pre>
    </Box>
  )
}
