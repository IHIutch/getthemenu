import React from 'react'
import {
  Box,
  Flex,
  Heading,
  Avatar,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  Link,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import Container from './Container'
import { useAuthUser } from '@/utils/react-query/user'

export default function Navbar({ children, ...props }) {
  const {
    data: user,
    // isLoading: isUserLoading,
    // isError: isUserError,
  } = useAuthUser()

  return (
    <>
      <Box
        as="nav"
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        {...props}
      >
        <Container>
          <Box>
            <Flex align="center">
              <Flex align="center" h="14">
                <Heading as="h1" fontSize="lg">
                  GetTheMenu
                </Heading>
              </Flex>
              <Box ml="auto">
                <Menu>
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
              </Box>
            </Flex>
            {children}
          </Box>
        </Container>
      </Box>
    </>
  )
}
