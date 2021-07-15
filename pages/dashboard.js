import Container from '@/components/common/Container'
import Navbar from '@/components/common/Navbar'

import { apiGetMenus } from '@/controllers/menus'
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'
import Head from 'next/head'
import NextLink from 'next/link'

import React from 'react'

export default function Profile({ menus }) {
  const modalState = useDisclosure()

  return (
    <>
      <Head>
        <title>Single Menu</title>
      </Head>
      <Navbar />
      <Container py="8">
        <Box>
          <Flex mb="4" align="center">
            <Heading fontSize="xl">Your Menus</Heading>
            <Box ml="auto">
              <Button colorScheme="blue" onClick={modalState.onOpen}>
                Create a Menu
              </Button>
            </Box>
          </Flex>
          {menus && (
            <Stack borderTopWidth="1px" borderBottomWidth="1px">
              {menus.map((menu, idx) => (
                <NextLink passHref href={`/menu/${menu.id}`}>
                  <Link py="2" fontWeight="medium">
                    {menu.name}
                  </Link>
                </NextLink>
              ))}
            </Stack>
          )}
        </Box>
      </Container>
      <Modal isOpen={modalState.isOpen} onClose={modalState.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create a New Menu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Menu Name</FormLabel>
              <Input type="text" />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup>
              <Button onClick={modalState.onClose}>Cancel</Button>
              <Button colorScheme="blue">Create</Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export async function getServerSideProps() {
  const menus = await apiGetMenus()
  return {
    props: {
      // restaurant,
      menus,
    },
  }
}
