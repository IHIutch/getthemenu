import React, { useCallback, useState } from 'react'
import Container from '@/components/common/Container'
import Navbar from '@/components/common/Navbar'

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Textarea,
  Heading,
  Flex,
  Text,
  IconButton,
  Icon,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Stack,
  ButtonGroup,
  AspectRatio,
  Image,
  HStack,
} from '@chakra-ui/react'
import Head from 'next/head'
import { MoreVertical, Trash2, Edit } from 'react-feather'
import { useDropzone } from 'react-dropzone'
import SubnavItem from '@/components/common/SubnavItem'
import { useRouter } from 'next/router'
import {
  useCreateMenuItem,
  useGetMenuItems,
  useUpdateMenuItems,
} from '@/utils/react-query/menuItems'
import { useGetMenu } from '@/utils/react-query/menus'
import { postMenuItem } from '@/utils/axios/menuItems'
import { useQueryClient } from 'react-query'
import { useAuthUser } from '@/utils/react-query/user'

export default function SingleMenu(props) {
  const {
    query: { menuId },
  } = useRouter()
  const drawerState = useDisclosure()
  const [drawerType, setDrawerType] = useState(null)
  const handleDrawerOpen = (content) => {
    setDrawerType(content)
    drawerState.onOpen()
  }

  const { data: menu } = useGetMenu(props.menuId)
  const { data: menuItems } = useGetMenuItems({
    menuId: props.menuId,
  })

  return (
    <>
      <Head>
        <title>{menu?.title}</title>
      </Head>
      <Navbar>
        <HStack spacing="6">
          <SubnavItem href={`/menu/${menuId}`}>Overview</SubnavItem>
          <SubnavItem href={`/menu/${menuId}/edit`}>Edit</SubnavItem>
        </HStack>
      </Navbar>
      <Container>
        <Box my="8">
          <Button
            leftIcon={<Icon as={Edit} />}
            colorScheme="blue"
            variant="link"
            onClick={() =>
              handleDrawerOpen(
                <EditTitleDrawer handleDrawerClose={drawerState.onClose} />
              )
            }
          >
            Edit
          </Button>
          <Heading>{menu?.title}</Heading>
        </Box>
        <Grid mx="-4">
          {menuItems &&
            menuItems.map((menuItem, idx) => (
              <GridItem
                key={idx}
                p="4"
                _notFirst={{
                  borderTopWidth: '1px',
                  borderTopColor: 'gray.200',
                }}
              >
                <Flex alignItems="flex-start">
                  <AspectRatio w="16" ratio="1">
                    <Image src="https://picsum.photos/200" objectFit="cover" />
                  </AspectRatio>
                  <Box flexGrow="1" ml="4">
                    <Flex>
                      <Box flexGrow="1">
                        <Text as="span" fontSize="lg" fontWeight="medium">
                          {menuItem.title}
                        </Text>
                        <Text fontWeight="semibold">{menuItem.price}</Text>
                        <Text>{menuItem.description}</Text>
                      </Box>
                      <Box>
                        <IconButton
                          ml="2"
                          size="xs"
                          variant="outline"
                          icon={
                            <Icon
                              boxSize="5"
                              as={MoreVertical}
                              onClick={() =>
                                handleDrawerOpen(
                                  <MenuItemDrawer
                                    menuItem={menuItem}
                                    handleDrawerClose={drawerState.onClose}
                                  />
                                )
                              }
                            />
                          }
                        />
                      </Box>
                    </Flex>
                  </Box>
                </Flex>
              </GridItem>
            ))}
        </Grid>
        <Button
          colorScheme="blue"
          onClick={() =>
            handleDrawerOpen(
              <MenuItemDrawer handleDrawerClose={drawerState.onClose} />
            )
          }
        >
          Add Item
        </Button>
      </Container>
      <Drawer
        isOpen={drawerState.isOpen}
        placement="right"
        onClose={drawerState.onClose}
      >
        <DrawerOverlay />
        <DrawerContent>{drawerType}</DrawerContent>
      </Drawer>
    </>
  )
}

const EditTitleDrawer = ({ handleDrawerClose }) => {
  return (
    <>
      <DrawerCloseButton />
      <DrawerHeader px="4">Edit Menu Title</DrawerHeader>

      <DrawerBody px="4">
        <Stack spacing="6">
          <FormControl id="menuTitle">
            <FormLabel>Menu Title</FormLabel>
            <Input />
          </FormControl>
        </Stack>
      </DrawerBody>

      <DrawerFooter px="4" borderTopWidth="1px" borderTopColor="gray.200">
        <ButtonGroup w="100%">
          <Button variant="outline" onClick={handleDrawerClose} isFullWidth>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleDrawerClose} isFullWidth>
            Save
          </Button>
        </ButtonGroup>
      </DrawerFooter>
    </>
  )
}

const MenuItemDrawer = ({ menuItem = null, handleDrawerClose }) => {
  const router = useRouter()
  const { menuId } = router.query

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingItem, setEditingItem] = useState(
    menuItem ?? {
      title: '',
      description: '',
      price: '',
    }
  )

  const {
    data: user,
    // isLoading: isUserLoading,
    // isError: isUserError,
  } = useAuthUser()

  const { mutate: handleUpdateMenuItem } = useUpdateMenuItems({
    menuId,
  })

  const { mutate: handleCreateMenuItem } = useCreateMenuItem({
    menuId,
  })

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      menuItem
        ? await handleUpdateMenuItem({
            id: editingItem.id,
            payload: editingItem,
          })
        : await handleCreateMenuItem({
            ...editingItem,
            menuId,
            restaurantId: user.restaurants[0].id,
          })
      handleDrawerClose()
      setIsSubmitting(false)
    } catch (error) {
      setIsSubmitting(false)
      alert(error)
    }
  }

  return (
    <>
      <DrawerCloseButton />
      <DrawerHeader px="4">Edit Item</DrawerHeader>

      <DrawerBody px="4">
        <Stack spacing="6">
          <Box>
            <FormControl id="image">
              <FormLabel>Item Image</FormLabel>
              <AspectRatio ratio={16 / 9} d="block">
                <Dropzone />
              </AspectRatio>
            </FormControl>
          </Box>
          <FormControl id="title">
            <FormLabel>Item Name</FormLabel>
            <Input
              autoComplete="off"
              value={editingItem.title}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  title: e.target.value,
                })
              }
            />
          </FormControl>
          <FormControl id="price">
            <FormLabel>Item Price</FormLabel>
            <Input
              autoComplete="off"
              value={editingItem.price}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  price: e.target.value,
                })
              }
              type="number"
            />
          </FormControl>
          <FormControl id="desctription">
            <FormLabel>Item Description</FormLabel>
            <Textarea
              autoComplete="off"
              value={editingItem.description}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  description: e.target.value,
                })
              }
              style={{ resize: 'none' }}
              rows="6"
            />
          </FormControl>
          {menuItem && (
            <Box>
              <Button
                colorScheme="red"
                variant="link"
                leftIcon={<Icon as={Trash2} />}
              >
                Delete Item
              </Button>
            </Box>
          )}
        </Stack>
      </DrawerBody>

      <DrawerFooter px="4" borderTopWidth="1px" borderTopColor="gray.200">
        <ButtonGroup w="100%">
          <Button variant="outline" onClick={handleDrawerClose} isFullWidth>
            Cancel
          </Button>
          <Button
            loadingText={menuItem ? 'Updating...' : 'Creating...'}
            isLoading={isSubmitting}
            colorScheme="blue"
            onClick={handleSubmit}
            isFullWidth
          >
            {menuItem ? 'Update' : 'Create'}
          </Button>
        </ButtonGroup>
      </DrawerFooter>
    </>
  )
}

const Dropzone = () => {
  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <Flex
      bg={isDragActive ? 'blue.100' : 'gray.100'}
      rounded="md"
      borderColor={isDragActive ? 'blue.200' : 'gray.200'}
      borderWidth="1px"
      align="center"
      justify="center"
      textAlign="center"
      fontWeight="semibold"
      transition="all 0.2s ease"
      cursor="pointer"
      {...getRootProps()}
    >
      <Input {...getInputProps()} />
      {isDragActive ? (
        <Text>Drop the files here ...</Text>
      ) : (
        <Text>Upload an Image</Text>
      )}
    </Flex>
  )
}

export async function getServerSideProps({ params: { menuId } }) {
  return {
    props: {
      menuId,
    },
  }
}
