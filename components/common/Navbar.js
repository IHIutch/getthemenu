import React from 'react'
import {
  Box,
  Flex,
  Heading,
  useDisclosure,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  Icon,
  Stack,
  Link,
  IconButton,
  Text,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { Menu } from 'react-feather'
import Container from './Container'

export default function Navbar({ sx, menus, active, handleCreateMenu }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

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
          <Flex wrap="wrap" align="center">
            <Flex align="center" h="14">
              <Heading as="h1" size="lg">
                Red Pepper
              </Heading>
            </Flex>
            <IconButton
              ml="auto"
              icon={<Icon as={Menu} h="6" w="6" />}
              onClick={onOpen}
            />
          </Flex>
        </Container>
      </Box>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">Menu</DrawerHeader>
            <DrawerBody px="6" py="5">
              <Box mb="2">
                <Text
                  fontSize="sm"
                  fontWeight="bold"
                  textTransform="uppercase"
                  color="gray.500"
                  letterSpacing="0.025rem"
                >
                  Your Menus
                </Text>
              </Box>
              <Box borderBottomWidth="1px" pb="4" mb="4">
                <Stack as="ul" spacing="4">
                  {menus &&
                    menus.map((item, idx) => (
                      <Box
                        as="li"
                        d="flex"
                        alignItems="center"
                        lineHeight="1.5rem"
                        key={idx}
                      >
                        <NextLink href={`/menu/${idx}`} passHref>
                          <Button
                            as={Link}
                            fontWeight="semibold"
                            colorScheme="blue"
                            py="1"
                            w="100%"
                            justifyContent="flex-start"
                            variant={Number(active) === idx ? 'solid' : 'ghost'}
                          >
                            {item.name || 'Untitled Menu'}
                          </Button>
                        </NextLink>
                      </Box>
                    ))}
                </Stack>
              </Box>
              <Box>
                <Button w="100%" onClick={handleCreateMenu}>
                  Add New Menu
                </Button>
              </Box>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  )
}
