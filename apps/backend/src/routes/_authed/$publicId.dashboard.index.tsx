import { Box, Link as ChakraLink, VStack } from '@chakra-ui/react'
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
    <VStack className="p-2 gap-2" spaceX={4}>
      {menus.map(menu => (
        <Box key={menu.id} p={4} borderWidth={1} borderRadius="md">
          <ChakraLink asChild>
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
        </Box>
      ))}
    </VStack>
  )
}
