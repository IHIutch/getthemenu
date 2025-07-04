import { Box, Button, Link as ChakraLink, Flex, Icon, IconButton, Tag, VStack } from '@chakra-ui/react'
import { Icon as Iconify } from '@iconify/react'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/$publicId/dashboard/')({
  loader: async ({
    context: { trpc, queryClient },
    params: { publicId },
  }) => {
    const menus = await queryClient.ensureQueryData(
      trpc.menu.getAll.queryOptions({
        publicId,
      }, {
        refetchOnMount: false,
        gcTime: 1000 * 30,
        staleTime: 1000 * 30,
      }),
    )

    return { menus }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { menus } = Route.useLoaderData()
  const { publicId } = Route.useParams()
  // const { data: menus = [] } = useQuery(trpc.menu.getAll.queryOptions({
  //   publicId
  // }, {
  //   refetchOnMount: false,
  //   gcTime: 1000 * 30,
  //   staleTime: 1000 * 30,
  //   initialData: initialData
  // }))

  return (
    <VStack gap={4}>
      {menus.map(menu => (
        <Flex key={menu.id} p={4} borderWidth={1} borderRadius="md" w="full" bg="white" shadow="xs" gap={4}>
          <Box flex="1">
            <ChakraLink fontWeight="bold" fontSize="xl" asChild>
              <Link
                to="/$publicId/menu/$menuId/edit"
                params={{
                  publicId,
                  menuId: menu.publicId,
                }}
              >
                {menu.title}
              </Link>
            </ChakraLink>
            <Box color="gray.600">
              {menu.description || 'No description provided.'}
            </Box>
            {true
              ? (
                  <Tag.Root colorPalette="yellow" mt={2} fontWeight="bold">
                    <Tag.Label>Draft</Tag.Label>
                  </Tag.Root>
                )
              : (
                  <Tag.Root colorPalette="green" mt={2} fontWeight="bold">
                    <Tag.Label>Published</Tag.Label>
                  </Tag.Root>
                )}
          </Box>
          <IconButton aria-label="Edit menu" variant="subtle" size="sm" position="relative" top={-2} right={-2}>
            <Icon size="lg">
              <Iconify icon="material-symbols:more-vert" />
            </Icon>
          </IconButton>
        </Flex>
      ))}
    </VStack>
  )
}
