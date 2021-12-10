import React, { useCallback, useEffect, useMemo, useState } from 'react'

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
  VStack,
  Container,
} from '@chakra-ui/react'
import Head from 'next/head'
import { MoreVertical, Trash2, Edit, X } from 'react-feather'
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
import {
  useCreateSection,
  useGetSections,
  useReorderSections,
  useUpdateSection,
} from '@/utils/react-query/sections'
import { blurhashEncode, getPublicURL } from '@/utils/functions'
import { postUpload } from '@/utils/axios/uploads'
import { Controller, useForm } from 'react-hook-form'
import ImageDropzone from '@/components/common/ImageDropzone'

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

  const { data: menu } = useGetMenu(menuId)
  const { data: menuItems } = useGetMenuItems({ menuId })
  const { data: sections } = useGetSections({ menuId })
  const { mutate: reorderMenuItems } = useReorderMenuItems({ menuId })
  const { mutate: reorderSections } = useReorderSections({ menuId })

  const reorder = (list = [], startIndex, endIndex) => {
    const temp = [...list]
    const [removed] = temp.splice(startIndex, 1)
    temp.splice(endIndex, 0, removed)
    return temp
  }

  const move = (sourceList = [], destinationList = [], source, destination) => {
    const [removed] = sourceList.splice(source.index, 1)
    destinationList.splice(destination.index, 0, removed)

    return {
      [source.droppableId]: sourceList,
      [destination.droppableId]: destinationList,
    }
  }

  const handleDragStart = () => {
    if (navigator.vibrate) {
      navigator.vibrate(100)
    }
  }

  const getSectionItems = (sectionId) => {
    return menuItems
      .filter((mi) => mi.sectionId === sectionId)
      .sort((a, b) => a.position - b.position)
  }

  const sortedSections = useMemo(() => {
    return sections ? sections.sort((a, b) => a.position - b.position) : []
  }, [sections])

  const handleDragEnd = (result) => {
    const { source, destination, type } = result
    if (!destination) return // dropped outside the list

    if (type === 'SECTIONS') {
      const reorderedSections = reorder(
        sections.sort((a, b) => a.position - b.position),
        source.index,
        destination.index
      )
      reorderSections(
        reorderedSections.map((s, idx) => ({ ...s, position: idx }))
      )
    } else if (type === 'ITEMS') {
      if (source.droppableId === destination.droppableId) {
        const reorderedItems = reorder(
          getSectionItems(parseInt(source.droppableId)),
          source.index,
          destination.index
        )
        reorderMenuItems(
          reorderedItems.map((i, idx) => ({ ...i, position: idx }))
        )
      } else {
        const movedItems = move(
          getSectionItems(parseInt(source.droppableId)),
          getSectionItems(parseInt(destination.droppableId)),
          source,
          destination
        )

        const newSource = movedItems[source.droppableId]
        const newDestination = movedItems[destination.droppableId].map(
          (i, idx) => ({
            ...i,
            position: idx,
            sectionId: parseInt(destination.droppableId),
          })
        )
        reorderMenuItems([...newSource, ...newDestination])
      }
    }
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
      <Container maxW="container.xl">
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
            <Droppable droppableId="sectionWrapper" type="SECTIONS">
              {(drop) => (
                <VStack
                  spacing="8"
                  ref={drop.innerRef}
                  {...drop.droppableProps}
                >
                  {sortedSections.map((s, idx) => (
                    <Draggable
                      key={`${s.id}`}
                      draggableId={`${s.id}`}
                      index={idx}
                    >
                      {(drag, snapshot) => (
                        <Box
                          p="4"
                          shadow="base"
                          bg="white"
                          w="100%"
                          sx={
                            snapshot.isDragging && {
                              bg: 'gray.200',
                            }
                          }
                          ref={drag.innerRef}
                          {...drag.draggableProps}
                          {...drag.dragHandleProps}
                        >
                          <Heading>{s.title}</Heading>
                          <Grid mx="-4">
                            <MenuItemsContainer
                              sectionId={s.id}
                              items={getSectionItems(s.id)}
                              handleDrawerOpen={handleDrawerOpen}
                              drawerState={drawerState}
                            />
                          </Grid>
                          <Box>
                            <Button
                              colorScheme="blue"
                              onClick={() =>
                                handleDrawerOpen(
                                  <MenuItemDrawer
                                    sectionId={s.id}
                                    position={getSectionItems(s.id).length}
                                    handleDrawerClose={drawerState.onClose}
                                  />
                                )
                              }
                            >
                              Add Item
                            </Button>
                          </Box>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {drop.placeholder}
                </VStack>
              )}
            </Droppable>
          </DragDropContext>
        )}
        <Box py="8">
          <Button
            variant="outline"
            colorScheme="blue"
            onClick={() =>
              handleDrawerOpen(
                <SectionDrawer
                  position={sortedSections.length}
                  handleDrawerClose={drawerState.onClose}
                />
              )
            }
          >
            Add Section
          </Button>
        </Box>
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
  return (
    <Droppable droppableId={`${sectionId}`} type="ITEMS">
      {(drop) => (
        <Box ref={drop.innerRef} {...drop.droppableProps}>
          {items.map((menuItem, idx) => (
            <Draggable
              key={`${sectionId}-${menuItem.id}`}
              draggableId={`${sectionId}-${menuItem.id}`}
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
  const imageUrl = useMemo(() => {
    return menuItem?.image?.src || null
  }, [menuItem.image])
  return (
    <Flex alignItems="flex-start">
      <AspectRatio w="16" ratio="1">
        {imageUrl ? (
          <Image
            src={imageUrl}
            objectFit="cover"
            alt={menuItem.title || 'Menu Item'}
          />
        ) : (
          <Box boxSize="100%" bg="gray.100" />
        )}
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

const SectionDrawer = ({ position, section = null, handleDrawerClose }) => {
  const router = useRouter()
  const { menuId } = router.query
  const { data: sections } = useGetSections({ menuId })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingSection, setEditingSection] = useState(
    section ?? {
      title: '',
      position: sections.length,
    }
  )

  const {
    data: user,
    // isLoading: isUserLoading,
    // isError: isUserError,
  } = useAuthUser()

  const { mutate: handleUpdateSection } = useUpdateSection({
    menuId,
  })

  const { mutate: handleCreateSection } = useCreateSection({
    menuId,
  })

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      section
        ? await handleUpdateSection({
            id: editingSection.id,
            payload: editingSection,
          })
        : await handleCreateSection({
            ...editingSection,
            position,
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
      <DrawerHeader px="4">Edit Section</DrawerHeader>

      <DrawerBody px="4">
        <Stack spacing="6">
          <FormControl id="title">
            <FormLabel>Section Name</FormLabel>
            <Input
              autoComplete="off"
              value={editingSection.title}
              onChange={(e) =>
                setEditingSection({
                  ...editingSection,
                  title: e.target.value,
                })
              }
            />
          </FormControl>
        </Stack>
      </DrawerBody>

      <DrawerFooter px="4" borderTopWidth="1px" borderTopColor="gray.200">
        <ButtonGroup w="100%">
          <Button variant="outline" onClick={handleDrawerClose} isFullWidth>
            Cancel
          </Button>
          <Button
            loadingText={section ? 'Updating...' : 'Creating...'}
            isLoading={isSubmitting}
            colorScheme="blue"
            onClick={handleSubmit}
            isFullWidth
          >
            {section ? 'Update' : 'Create'}
          </Button>
        </ButtonGroup>
      </DrawerFooter>
    </>
  )
}

const MenuItemDrawer = ({
  sectionId,
  position,
  menuItem = null,
  handleDrawerClose,
}) => {
  const router = useRouter()
  const { menuId } = router.query

  const { register, handleSubmit, reset, control } = useForm()

  useEffect(() => {
    if (menuItem) {
      const payload = {
        ...menuItem,
        image: menuItem?.image?.src || null,
      }
      reset(payload)
    }
  }, [menuItem, reset])

  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const onSubmit = async (form) => {
    try {
      setIsSubmitting(true)
      const payload = {
        title: form?.title || '',
        description: form?.description || '',
        price: form?.price || null,
        image: null,
      }
      if (form?.image) {
        const formData = new FormData()
        formData.append('file', form.image, form.image.name)

        payload.image = {
          blurDataURL: await blurhashEncode(form.image),
          src: await postUpload(formData),
        }
      }
      menuItem
        ? await handleUpdateMenuItem({
            id: menuItem.id,
            payload,
          })
        : await handleCreateMenuItem({
            ...payload,
            sectionId,
            position,
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
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => {
                    return <ImageDropzone {...field} />
                  }}
                />
              </AspectRatio>
            </FormControl>
          </Box>
          <FormControl id="title">
            <FormLabel>Item Name</FormLabel>
            <Input
              autoComplete="off"
              {...register('title', { required: true })}
            />
          </FormControl>
          <FormControl id="price">
            <FormLabel>Item Price</FormLabel>
            <Input autoComplete="off" {...register('price')} type="number" />
          </FormControl>
          <FormControl id="description">
            <FormLabel>Item Description</FormLabel>
            <Textarea
              autoComplete="off"
              {...register('description')}
              resize="none"
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
            onClick={handleSubmit(onSubmit)}
            isFullWidth
          >
            {menuItem ? 'Update' : 'Create'}
          </Button>
        </ButtonGroup>
      </DrawerFooter>
    </>
  )
}
