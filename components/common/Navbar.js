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
  Button,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import Container from './Container'

export default function Navbar(props) {
  const router = useRouter()
  const [blue500] = useToken('colors', ['blue.500'])

  const isPathMatch = (path) => {
    return router.asPath === path
  }

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
            <HStack spacing="6">
              <NextLink href="/dashboard" passHref>
                <Link
                  fontWeight="semibold"
                  py="2"
                  boxShadow={
                    isPathMatch('/dashboard') && `inset 0 -3px ${blue500}`
                  }
                  color={isPathMatch('/dashboard') && 'blue.500'}
                >
                  Dashboard
                </Link>
              </NextLink>
              <NextLink href="/menus" passHref>
                <Link fontWeight="semibold" py="2">
                  Menus
                </Link>
              </NextLink>
              <NextLink href="/restaurant" passHref>
                <Link fontWeight="semibold" py="2">
                  Restaurant
                </Link>
              </NextLink>
            </HStack>
          </Box>
        </Container>
      </Box>
    </>
  )
}
