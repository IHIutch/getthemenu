import React from 'react'
import {
  Box,
  Flex,
  Heading,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  Icon,
  Link,
  IconButton,
  Text,
  Avatar,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { Menu } from 'react-feather'
import Container from './Container'

export default function Navbar({ sx, menus, active, handleCreateMenu }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const linkItems = [
    {
      label: 'Menus',
      to: '/menus',
      children: [
        { label: 'Dinner', to: '/menus/dinner' },
        { label: 'Add Menu', to: '/menus/create' },
      ],
    },
    { label: 'Restaurant Details', to: '/details' },
  ]

  return (
    <>
      <Box
        as="nav"
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        sx={sx}
      >
        <Container>
          <Flex align="center">
            <IconButton
              variant="outline"
              icon={<Icon as={Menu} h="6" w="6" />}
              onClick={onOpen}
            />
            <Flex align="center" h="14" ml="2">
              <Heading as="h1" size="lg">
                Dinner
              </Heading>
            </Flex>
          </Flex>
        </Container>
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader p="4" borderBottomWidth="1px">
              GetTheMenu
            </DrawerHeader>
            <DrawerBody p="4">
              <Flex h="100%" direction="column">
                <Box as="ul">
                  {linkItems.map((item, idx) => (
                    <Box
                      key={idx}
                      as="li"
                      lineHeight="1.5rem"
                      textAlign="left"
                      listStyleType="none"
                      _notFirst={{ mt: '2' }}
                    >
                      <NextLink href={`/menu/${idx}`} passHref>
                        <Link
                          fontWeight="semibold"
                          colorScheme={parseInt(active) === idx && 'blue'}
                          py="2"
                          d="block"
                        >
                          {item.label || 'Untitled Menu'}
                        </Link>
                      </NextLink>
                      {item.children && (
                        <Box as="ul" my="2">
                          {item.children.map((child, cIdx) => (
                            <Box
                              key={cIdx}
                              as="li"
                              lineHeight="1.5rem"
                              textAlign="left"
                              listStyleType="none"
                              ml="4"
                              _notFirst={{ mt: '4' }}
                            >
                              <NextLink href={`/menu/${child.to}`} passHref>
                                <Link
                                  d="block"
                                  fontWeight="semibold"
                                  colorScheme={
                                    parseInt(active) === idx && 'blue'
                                  }
                                  py="1"
                                >
                                  {child.label || 'Untitled Menu'}
                                </Link>
                              </NextLink>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
                <Box mt="auto">
                  <NextLink href={`/profile/details}`} passHref>
                    <Link
                      d="flex"
                      alignItems="center"
                      fontWeight="semibold"
                      py="1"
                    >
                      <Avatar size="sm" name="Kola Tioluwani" />
                      <Text as="span" ml="2">
                        Profile Settings
                      </Text>
                    </Link>
                  </NextLink>
                </Box>
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  )
}
