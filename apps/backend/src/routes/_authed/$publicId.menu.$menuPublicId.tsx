import { chakra, Link as ChakraLink, Container, Flex, HStack } from '@chakra-ui/react'
import { createFileRoute, createLink, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/$publicId/menu/$menuPublicId')({
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
  const { publicId, menuPublicId } = Route.useParams()
  return (
    <Flex direction="column" h="full" minH={0}>
      <Flex bg="white" h="12" boxShadow="sm" align="center" zIndex={1}>
        <Container maxW="8xl">
          <HStack gap={6}>
            <TabLink
              to="/$publicId/menu/$menuPublicId/edit"
              params={{
                publicId,
                menuPublicId,
              }}
              activeOptions={{ exact: true }}
            >
              Edit
            </TabLink>
            <TabLink
              to="/$publicId/menu/$menuPublicId"
              params={{
                publicId,
                menuPublicId,
              }}
              activeOptions={{ exact: true }}
            >
              Settings
            </TabLink>
          </HStack>
        </Container>
      </Flex>
      <Container h="full" minH={0} flex="1" maxW="8xl" overflow="auto">
        <Outlet />
      </Container>
    </Flex>
  )
}
