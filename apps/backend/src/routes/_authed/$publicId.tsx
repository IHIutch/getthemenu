import { Box, Flex } from '@chakra-ui/react'
import prisma from '~/utils/db'
import { createFileRoute, notFound, Outlet } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

import Navbar from '~/components/navbar'
import { NotFound } from '~/components/not-found'

const validatorSchema = z.object({
  publicId: z.string(),
  userId: z.number(),
})

const getRestaurantData = createServerFn({ method: 'GET' })
  .validator(validatorSchema)
  .handler(async ({ data }) => {
    const restaurant = await prisma.restaurants.findUnique({
      where: {
        publicId: data.publicId,
      },
    })

    return {
      customHost: restaurant?.customHost || '',
      publicId: restaurant?.publicId || '',
    }
  })

export const Route = createFileRoute('/_authed/$publicId')({
  component: RouteComponent,
  notFoundComponent: () => <NotFound />,
  loader: async ({ context, params }) => {
    const { publicId } = params
    const { user } = context
    const restaurant = await getRestaurantData({
      data: {
        publicId,
        userId: user.id,
      },
    })

    if (!user.restaurants.some(r => r.publicId === publicId)) {
      throw notFound()
    }

    return {
      user,
      restaurant,
    }
  },
})

function RouteComponent() {
  const { user, restaurant } = Route.useLoaderData()
  return (
    <Flex position="fixed" inset="0" flexDirection="column" bg="gray.50" overflow="hidden">
      <Box
        as="nav"
        bg="white"
        borderColor="gray.200"
        zIndex="1"
        borderBottomWidth={1}
      >
        <Box>
          <Navbar
            restaurant={{
              customHost: restaurant?.customHost || '',
              publicId: restaurant?.publicId || '',
            }}
            user={{
              fullName: user?.fullName || '',
            }}
          />
        </Box>
      </Box>
      {/* <Box h="full" minH={0}> */}
      <Outlet />
      {/* </Box> */}
    </Flex>
  )
}
