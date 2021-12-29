import React from 'react'
import NextLink from 'next/link'
import { useAuthUser } from '@/utils/react-query/user'
import { Box, Container, Flex, Heading, HStack, Link } from '@chakra-ui/layout'
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu'
import { Avatar } from '@chakra-ui/avatar'
import { Button } from '@chakra-ui/button'
import { useGetRestaurant } from '@/utils/react-query/restaurants'

export default function Navbar({ children, ...props }) {
  const {
    data: user,
    // isLoading: isUserLoading,
    // isError: isUserError,
  } = useAuthUser()
  const { data: restaurant } = useGetRestaurant(
    user?.restaurants?.length ? user.restaurants[0].id : null
  )

  return (
    <>
      <Box
        as="nav"
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        position="fixed"
        top="0"
        w="100%"
        zIndex="1"
        {...props}
      >
        <Container maxW="container.md">
          <Box>
            <Flex align="center">
              <Flex align="center" h="14">
                <Heading as="h1" fontSize="lg">
                  <NextLink href={'/dashboard'} passHref>
                    <Link>GetTheMenu</Link>
                  </NextLink>
                </Heading>
              </Flex>
              <Box ml="auto">
                <HStack>
                  {restaurant?.customHost && (
                    <NextLink
                      href={`https://${restaurant.customHost}.getthemenu.io`}
                      passHref
                    >
                      <Button size="sm" as={Link} target="blank">
                        View Site
                      </Button>
                    </NextLink>
                  )}
                  <Menu placement="bottom-end">
                    <MenuButton>
                      <Avatar size="sm" name={`${user && user.fullName}`} />
                    </MenuButton>
                    <MenuList boxShadow="lg">
                      <NextLink href="/dashboard" passHref>
                        <MenuItem as={Link}>Dashboard</MenuItem>
                      </NextLink>
                      <NextLink href="/settings" passHref>
                        <MenuItem as={Link}>Account Settings</MenuItem>
                      </NextLink>
                      <MenuItem as="button">Feedback</MenuItem>
                      <NextLink href="/logout" passHref>
                        <MenuItem as={Link}>Log Out</MenuItem>
                      </NextLink>
                    </MenuList>
                  </Menu>
                </HStack>
              </Box>
            </Flex>
            <Box position="relative">{children}</Box>
          </Box>
        </Container>
      </Box>
    </>
  )
}
