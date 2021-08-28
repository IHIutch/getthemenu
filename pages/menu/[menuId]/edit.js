import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
  useReorderMenuItems,
  useUpdateMenuItem,
} from '@/utils/react-query/menuItems'
import { useGetMenu } from '@/utils/react-query/menus'
import { useAuthUser } from '@/utils/react-query/user'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

export default function SingleMenu() {
  const {
    query: { menuId },
  } = useRouter()
  const drawerState = useDisclosure()
  const [drawerType, setDrawerType] = useState(null)
  const handleDrawerOpen = (content) => {
    setDrawerType(content)
    drawerState.onOpen()
  }

  const [sections, setSections] = useState(['section1', 'section2', 'section3'])

  const { data: menu } = useGetMenu(menuId)
  const { data: menuItems } = useGetMenuItems({ menuId })
  const { mutate } = useReorderMenuItems({ menuId })

  const reorder = (list, startIndex, endIndex) => {
    const temp = [...list]
    const [removed] = temp.splice(startIndex, 1)
    temp.splice(endIndex, 0, removed)
    return temp
  }

  const handleDragStart = () => {
    if (navigator.vibrate) {
      navigator.vibrate(100)
    }
  }

  const handleDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) return
    if (result.type === 'ITEMS') {
      const items = reorder(
        menuItems,
        result.source.index,
        result.destination.index
      )
      console.log(items)
    } else if (result.type === 'SECTIONS') {
      const items = reorder(
        sections,
        result.source.index,
        result.destination.index
      )
      console.log(items)
      setSections(items)
    }
    console.log(result)
    // setSections()
    // mutate(items.map((i, idx) => ({ ...i, order: idx })))
  }

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
        {sections && menuItems && (
          <DragDropContext
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            <Droppable droppableId="droppable-outer" type="SECTIONS">
              {(drop) => (
                <Box ref={drop.innerRef} {...drop.droppableProps}>
                  {sections.map((s, idx) => (
                    <Draggable
                      key={s}
                      index={idx}
                      draggableId={`draggable-outer-${s}`}
                    >
                      {(drag, snapshot) => (
                        <Box
                          sx={
                            snapshot.isDragging && {
                              bg: 'gray.200',
                            }
                          }
                          ref={drag.innerRef}
                          {...drag.draggableProps}
                          {...drag.dragHandleProps}
                        >
                          <Heading>{s}</Heading>
                          <Grid mx="-4">
                            <MenuItemsContainer
                              sectionId={idx}
                              items={menuItems}
                              handleDrawerOpen={handleDrawerOpen}
                              drawerState={drawerState}
                            />
                          </Grid>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {drop.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        )}
        <ButtonGroup>
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
          <Button
            onClick={
              () => console.log('Add Section')
              // handleDrawerOpen(
              //   <MenuItemDrawer handleDrawerClose={drawerState.onClose} />
              // )
            }
          >
            Add Section
          </Button>
        </ButtonGroup>
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

const MenuItemsContainer = ({
  items,
  handleDrawerOpen,
  drawerState,
  sectionId,
}) => {
  const sortedItems = useMemo(() => {
    return items ? items.sort((a, b) => a.order - b.order) : []
  }, [items])

  return (
    <Droppable droppableId={`droppable-${sectionId}`} type="ITEMS">
      {(drop) => (
        <Box ref={drop.innerRef} {...drop.droppableProps}>
          {sortedItems.map((menuItem, idx) => (
            <Draggable
              key={`${sectionId}${menuItem.id}`}
              draggableId={`${sectionId}${menuItem.id}`}
              index={idx}
            >
              {(drag, snapshot) => (
                <GridItem
                  sx={
                    snapshot.isDragging && {
                      bg: 'gray.200',
                    }
                  }
                  ref={drag.innerRef}
                  {...drag.draggableProps}
                  {...drag.dragHandleProps}
                  p="4"
                  _notFirst={{
                    borderTopWidth: '1px',
                    borderTopColor: 'gray.200',
                  }}
                >
                  <MenuItem
                    menuItem={menuItem}
                    handleDrawerOpen={handleDrawerOpen}
                    drawerState={drawerState}
                  />
                </GridItem>
              )}
            </Draggable>
          ))}
          {drop.placeholder}
        </Box>
      )}
    </Droppable>
  )
}

const MenuItem = ({ menuItem, handleDrawerOpen, drawerState }) => {
  return (
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

  const { mutate: handleUpdateMenuItem } = useUpdateMenuItem({
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
