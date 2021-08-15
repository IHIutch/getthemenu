import Container from '@/components/common/Container'
import Navbar from '@/components/common/Navbar'
import SubnavItem from '@/components/common/SubnavItem'

import { apiGetMenus } from '@/controllers/menus'
import { postMenu } from '@/utils/axios/menus'
import { formatDate } from '@/utils/functions'
import { useGetMenus } from '@/utils/react-query/menus'
import { useAuthUser } from '@/utils/react-query/user'
import {
  Box,
  Button,
  ButtonGroup,
  Center,
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
import { useRouter } from 'next/router'

import React, { useState } from 'react'

export default function Profile(props) {
  const router = useRouter()
  const modalState = useDisclosure()
  const [menuTitle, setMenuTitle] = useState('')
  const [isCreating, setIsCreating] = useState('')

  const {
    data: user,
    // isLoading: isUserLoading,
    // isError: isUserError,
  } = useAuthUser()

  const { data: menus } = useGetMenus({
    restaurantId: user?.restaurants && user.restaurants[0].id,
  })

  const handleCreateMenu = async () => {
    try {
      setIsCreating(true)
      const data = await postMenu({
        title: menuTitle,
        restaurantId: user?.restaurants && user.restaurants[0].id,
      })
      if (data.error) throw new Error(data.error)
      router.replace(`/menu/${data.id}/edit`)
    } catch (error) {
      setIsCreating(false)
      alert(error)
    }
  }

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
          {menus?.length ? (
            <Stack>
              {menus.map((menu, idx) => (
                <LinkBox key={idx} bg="white" rounded="md" shadow="base">
                  <Box p="3" borderBottomWidth="1px">
                    <NextLink passHref href={`/menu/${menu.id}`}>
                      <LinkOverlay fontWeight="medium" fontSize="2xl">
                        {menu.title}
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
          ) : (
            <Center
              borderWidth="2px"
              borderColor="gray.200"
              bg="gray.100"
              py="8"
              rounded="lg"
            >
              <Text fontSize="xl" fontWeight="medium" color="gray.600">
                Get started by creating your first menu.
              </Text>
            </Center>
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
              <Input
                onChange={(e) => setMenuTitle(e.target.value)}
                type="text"
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup>
              <Button onClick={modalState.onClose}>Cancel</Button>
              <Button
                isLoading={isCreating}
                loadingText="Creating..."
                colorScheme="blue"
                onClick={handleCreateMenu}
              >
                Create
              </Button>
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
