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
  HStack,
  useToken,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import Container from './Container'

export default function Navbar(props) {
  const { query } = useRouter()
  const { menuId } = query

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
                    <Avatar size="sm" name="Kola Tioluwani" />
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
            {/* <HStack spacing="6">
              <NavMenuItem href="/dashboard">Dashboard</NavMenuItem>
              <NavMenuItem href="/restaurant">Restaurant</NavMenuItem>
              <NavMenuItem href="/menus">Menus</NavMenuItem>
            </HStack> */}
            <HStack spacing="6">
              <NavMenuItem href={`/menu/${menuId}`}>Overview</NavMenuItem>
              <NavMenuItem href={`/menu/${menuId}/edit`}>Edit</NavMenuItem>
            </HStack>
          </Box>
        </Container>
      </Box>
    </>
  )
}

const NavMenuItem = ({ href, children }) => {
  const isPathMatch = (path) => {
    return asPath === path
  }

  const { asPath } = useRouter()
  const [blue500] = useToken('colors', ['blue.500'])

  return (
    <NextLink href={href} passHref>
      <Link
        fontWeight="semibold"
        py="2"
        boxShadow={isPathMatch(href) && `inset 0 -3px ${blue500}`}
        color={isPathMatch(href) && 'blue.500'}
      >
        {children}
      </Link>
    </NextLink>
  )
}
