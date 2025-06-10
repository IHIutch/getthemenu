import { Box, Link as ChakraLink, HStack } from '@chakra-ui/react'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/$publicId/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  const { publicId } = Route.useParams()

  return (
    <Box>
      <HStack>
        <ChakraLink asChild>
          <Link
            to="/$publicId/dashboard"
            params={{
              publicId,
            }}
          >
            Dashboard
          </Link>
        </ChakraLink>
        <ChakraLink asChild>
          <Link
            to="/$publicId/restaurant"
            params={{
              publicId,
            }}
          >
            Restaurant
          </Link>
        </ChakraLink>
        {/* <Link to="/$publicId/analytics"
          params={{
          publicId,
        }}>Analytics</Link> */}
      </HStack>
      <Box pt="32" pb="8" position="relative">
        <Outlet />
      </Box>
    </Box>
  )
}
