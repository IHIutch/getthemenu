import Container from '@/components/common/Container'
import Navbar from '@/components/common/Navbar'
import SubnavItem from '@/components/common/SubnavItem'

import { apiGetMenus } from '@/controllers/menus'
import { formatDate } from '@/util/functions'
import {
  Box,
  Button,
  ButtonGroup,
  Circle,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  LinkBox,
  LinkOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
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
      <Navbar>
        <HStack spacing="6">
          <SubnavItem href="/dashboard">Dashboard</SubnavItem>
          <SubnavItem href="/restaurant">Restaurant</SubnavItem>
          <SubnavItem href="/menus">Menus</SubnavItem>
        </HStack>
      </Navbar>
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
            <Stack>
              {menus.map((menu, idx) => (
                <LinkBox key={idx} bg="white" rounded="md" shadow="base">
                  <Box p="3" borderBottomWidth="1px">
                    <NextLink passHref href={`/menu/${menu.id}`}>
                      <LinkOverlay fontWeight="medium" fontSize="2xl">
                        {menu.name}
                      </LinkOverlay>
                    </NextLink>
                  </Box>
                  <Flex p="3" justify="space-between">
                    <Flex align="center">
                      <Circle boxSize="4" bg="green.100">
                        <Circle boxSize="2" bg="green.500" />
                      </Circle>
                      <Text
                        ml="2"
                        lineHeight="1.2"
                        fontWeight="semibold"
                        color="green.600"
                      >
                        Live
                      </Text>
                    </Flex>
                    <Box>
                      <Text
                        fontWeight="semibold"
                        color="gray.600"
                        fontSize="sm"
                      >
                        Published: {formatDate(menu.createdAt)}
                      </Text>
                    </Box>
                  </Flex>
                </LinkBox>
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
