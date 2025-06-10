import { Box, Heading, Text } from '@chakra-ui/react'
import { prisma } from '@repo/db'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

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
      include: {
        sections: true,
        menuItems: true,
      },
    })

    if (!menu) {
      return {
        menu: null,
        sections: [],
        menuItems: [],
      }
    }

    const { sections, menuItems, ...rest } = menu

    return {
      menu: rest,
      sections,
      menuItems,
    }
  })

export const Route = createFileRoute('/_authed/$publicId/menu/$menuId/edit')({
  loader: async ({
    // context: { trpc, queryClient },
    params: { menuId },
  }) => {
    const data = await fetchMenuData({ data: menuId })
    return data
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { menu, sections, menuItems } = Route.useLoaderData()

  const sectionsWithItems = sections.map((section) => {
    const items = menuItems.filter(item => item.sectionId === section.id)
    return {
      ...section,
      menuItems: items,
    }
  })

  const formatMoney = (value: number) => {
    const dollars = value / 100
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(dollars)
  }

  return (
    <Box>
      <pre>{JSON.stringify({ menu }, null, 2)}</pre>
      {/* <pre>{JSON.stringify({ sections }, null, 2)}</pre>
      <pre>{JSON.stringify({ menuItems }, null, 2)}</pre> */}

      <Heading>Edit Menu</Heading>
      <Box>
        {sectionsWithItems.map(section => (
          <Box key={section.id} borderWidth={1} borderColor="gray.200" borderRadius="md" p={4} mb={4}>
            <Heading>{section.title}</Heading>
            <Text>{section.description}</Text>
            <Box>
              {section.menuItems.map(item => (
                <Box key={item.id}>
                  <Heading>{item.title}</Heading>
                  <Text>{item.description}</Text>
                  <Text>{item.price ? formatMoney(item.price) : ''}</Text>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
