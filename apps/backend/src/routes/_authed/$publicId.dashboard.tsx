import { Box, chakra, Link as ChakraLink, Container, Flex, HStack } from '@chakra-ui/react'
import { createFileRoute, createLink, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/$publicId/dashboard')({
  component: RouteComponent,
})

const CustomLink = chakra(ChakraLink, {
  base: {
    h: 12,
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'medium',
    borderBottomWidth: '2px',
    borderRadius: 0,
    borderColor: 'transparent',
    transition: 'border-color 0.2s',
    _hover: {
      borderColor: 'gray.400',
      textDecoration: 'none',
    },
    _currentPage: {
      borderColor: 'black',
      _hover: {
        borderColor: 'black',
      },
    },
  },
})

const TabLink = createLink(CustomLink)

function RouteComponent() {
  const { publicId } = Route.useParams()

  return (
    <Box>
      <Flex bg="white" h="12" boxShadow="sm" align="center">
        <Container maxW="8xl">
          <HStack gap={6}>
            <TabLink
              to="/$publicId/dashboard"
              params={{
                publicId,
              }}
              activeOptions={{ exact: true }}
            >
              Menus
            </TabLink>
            <TabLink
              to="/$publicId/restaurant"
              params={{
                publicId,
              }}
              activeOptions={{ exact: true }}
            >
              Settings
            </TabLink>
            {/* <Link to="/$publicId/analytics"
              params={{
              publicId,
            }}>Analytics</Link> */}
          </HStack>
        </Container>
      </Flex>
      <Box py={4}>
        <Container maxW="8xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
}
