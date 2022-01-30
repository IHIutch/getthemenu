import React, { useMemo, useRef, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
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
  Container,
  Center,
  StackDivider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
} from '@chakra-ui/react'
import Head from 'next/head'
import { MoreVertical, Trash2, Camera, GripHorizontal } from 'lucide-react'
import { useRouter } from 'next/router'
import {
  useCreateMenuItem,
  useDeleteMenuItem,
  useGetMenuItems,
  useReorderMenuItems,
  useUpdateMenuItem,
} from '@/utils/react-query/menuItems'
import { useGetMenu } from '@/utils/react-query/menus'
import { useAuthUser } from '@/utils/react-query/user'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import {
  useCreateSection,
  useDeleteSection,
  useGetSections,
  useReorderSections,
  useUpdateSection,
} from '@/utils/react-query/sections'
import { blurhashEncode, reorderList } from '@/utils/functions'
import { postUpload } from '@/utils/axios/uploads'
import { Controller, useForm } from 'react-hook-form'
import ImageDropzone from '@/components/common/ImageDropzone'
import MenuLayout from '@/layouts/Menu'
import groupBy from 'lodash/groupBy'

export default function MenuEdit() {
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
  const { mutate: handleReorderMenuItems } = useReorderMenuItems({
    menuId,
  })
  const { mutate: handleReorderSections } = useReorderSections({ menuId })

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
      navigator.vibrate(75)
    }
  }

  const groupedSectionItems = groupBy(
    (menuItems || []).sort((a, b) => a.position - b.position),
    'sectionId'
  )

  const sortedSections = useMemo(() => {
    return sections ? sections.sort((a, b) => a.position - b.position) : []
  }, [sections])

  const handleDragEnd = (result) => {
    const { source, destination, type } = result
    if (!destination) return // dropped outside the list

    if (type === 'SECTIONS') {
      const reorderedSections = reorderList(
        sections.sort((a, b) => a.position - b.position),
        source.index,
        destination.index
      )
      handleReorderSections(
        reorderedSections.map((s, idx) => ({
          id: Number(s.id),
          position: idx,
        }))
      )
    } else if (type === 'ITEMS') {
      if (source.droppableId === destination.droppableId) {
        const reorderedItems = reorderList(
          groupedSectionItems[source.droppableId],
          source.index,
          destination.index
        )
        handleReorderMenuItems(
          reorderedItems.map((i, idx) => ({
            id: Number(i.id),
            position: idx,
          }))
        )
      } else {
        const movedItems = move(
          groupedSectionItems[source.droppableId],
          groupedSectionItems[destination.droppableId],
          source,
          destination
        )

        const newSource = movedItems[source.droppableId].map((i, idx) => ({
          id: Number(i.id),
          position: idx,
          sectionId: Number(source.droppableId),
        }))
        const newDestination = movedItems[destination.droppableId].map(
          (i, idx) => ({
            id: Number(i.id),
            position: idx,
            sectionId: Number(destination.droppableId),
          })
        )
        handleReorderMenuItems([...newSource, ...newDestination])
      }
    }
  }

  return (
    <>
      <Head>
        <title>{menu?.title}</title>
      </Head>
      <Container maxW="container.md" px={{ base: '2', lg: '4' }}>
        {sections?.length > 0 && groupedSectionItems ? (
          <DragDropContext
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            <Droppable droppableId="sectionWrapper" type="SECTIONS">
              {(drop) => (
                <Stack spacing="8" ref={drop.innerRef} {...drop.droppableProps}>
                  {sortedSections.map((s, idx) => (
                    <Draggable
                      key={`${s.id}`}
                      draggableId={`${s.id}`}
                      index={idx}
                    >
                      {(drag, snapshot) => (
                        <Box ref={drag.innerRef} {...drag.draggableProps}>
                          <Box
                            bg="white"
                            rounded="md"
                            shadow={snapshot.isDragging ? 'lg' : 'base'}
                            transform={
                              snapshot.isDragging ? 'scale(1.04)' : 'none'
                            }
                            transition="all 0.1s ease"
                          >
                            <Center {...drag.dragHandleProps}>
                              <Icon
                                color="gray.500"
                                boxSize="5"
                                as={GripHorizontal}
                              />
                            </Center>
                            <Flex
                              pb="6"
                              px="4"
                              borderBottomWidth="1px"
                              align="center"
                              w="100%"
                            >
                              <Heading
                                ml="2"
                                fontSize="2xl"
                                fontWeight="semibold"
                              >
                                {s.title}
                              </Heading>
                              <Box ml="auto">
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
                                          <SectionDrawer
                                            section={s}
                                            handleDrawerClose={
                                              drawerState.onClose
                                            }
                                          />
                                        )
                                      }
                                    />
                                  }
                                />
                              </Box>
                            </Flex>
                            <Box>
                              <MenuItemsContainer
                                sectionId={s.id}
                                items={groupedSectionItems[s.id] || []}
                                handleDrawerOpen={handleDrawerOpen}
                                drawerState={drawerState}
                              />
                            </Box>
                            <Flex px="4" py="3" borderTopWidth="1px">
                              <Button
                                colorScheme="blue"
                                onClick={() =>
                                  handleDrawerOpen(
                                    <MenuItemDrawer
                                      sectionId={s.id}
                                      position={
                                        groupedSectionItems?.[s.id]?.length || 0
                                      }
                                      handleDrawerClose={drawerState.onClose}
                                    />
                                  )
                                }
                              >
                                Add Item
                              </Button>
                            </Flex>
                          </Box>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  <Box bg="gray.50">{drop.placeholder}</Box>
                </Stack>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <Box>
            <Center
              borderWidth="2px"
              borderColor="gray.200"
              bg="gray.100"
              py="8"
              px="4"
              rounded="lg"
            >
              <Text
                fontSize="xl"
                fontWeight="medium"
                color="gray.600"
                textAlign="center"
              >
                Get started by adding a section to your menu.
              </Text>
            </Center>
          </Box>
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

MenuEdit.getLayout = (page) => <MenuLayout>{page}</MenuLayout>

const MenuItemsContainer = ({
  items = [],
  handleDrawerOpen,
  drawerState,
  sectionId,
}) => {
  return (
    <Droppable droppableId={`${sectionId}`} type="ITEMS">
      {(drop) => (
        <Box>
          <Stack
            spacing="0"
            ref={drop.innerRef}
            {...drop.droppableProps}
            divider={<StackDivider />}
          >
            {items?.length > 0 ? (
              items.map((menuItem, idx) => (
                <Box key={`${sectionId}-${menuItem.id}`}>
                  <Draggable
                    draggableId={`${sectionId}-${menuItem.id}`}
                    index={idx}
                  >
                    {(drag, snapshot) => (
                      <Box ref={drag.innerRef} {...drag.draggableProps}>
                        <Box
                          borderRadius="md"
                          bg="white"
                          shadow={snapshot.isDragging ? 'md' : 'none'}
                          transform={
                            snapshot.isDragging ? 'scale(1.02)' : 'none'
                          }
                          transition="all 0.1s ease"
                        >
                          <Center {...drag.dragHandleProps}>
                            <Icon
                              color="gray.500"
                              boxSize="5"
                              as={GripHorizontal}
                            />
                          </Center>
                          <Box pb="4" px="4">
                            <MenuItem
                              menuItem={menuItem}
                              handleDrawerOpen={handleDrawerOpen}
                              drawerState={drawerState}
                            />
                          </Box>
                        </Box>
                      </Box>
                    )}
                  </Draggable>
                </Box>
              ))
            ) : (
              <Center p="4">
                <Text color="gray.600">Add an item to this section</Text>
              </Center>
            )}
            {drop.placeholder}
          </Stack>
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
      <AspectRatio
        w="16"
        ratio="1"
        flexShrink="0"
        rounded="sm"
        overflow="hidden"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            objectFit="cover"
            alt={menuItem.title || 'Menu Item'}
          />
        ) : (
          <Box boxSize="100%" bg="gray.100">
            <Icon color="gray.400" boxSize="5" as={Camera} />
          </Box>
        )}
      </AspectRatio>
      <Box flexGrow="1" ml="4">
        <Flex>
          <Box flexGrow="1">
            <Text fontSize="lg" fontWeight="semibold" lineHeight="1">
              {menuItem.title || 'Untitled'}
            </Text>
            {(menuItem?.price || menuItem.price === 0) && (
              <Text color="gray.800" fontWeight="medium" mb="1">
                {Number(menuItem.price).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </Text>
            )}
            {menuItem.description && (
              <Text color="gray.600">{menuItem.description}</Text>
            )}
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

const SectionDrawer = ({ position, section = null, handleDrawerClose }) => {
  const router = useRouter()
  const { menuId } = router.query

  const dialogState = useDisclosure()
  const leastDestructiveRef = useRef()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    data: user,
    // isLoading: isUserLoading,
    // isError: isUserError,
  } = useAuthUser()

  const { register, handleSubmit } = useForm({
    defaultValues: { ...section },
  })

  const { mutate: handleUpdateSection } = useUpdateSection({
    menuId,
  })

  const { mutate: handleCreateSection } = useCreateSection({
    menuId,
  })

  const { mutate: handleDeleteSection, isLoading: isDeleting } =
    useDeleteSection({
      menuId,
    })

  const onDelete = () => {
    handleDeleteSection(section.id, {
      onSuccess: () => {
        dialogState.onClose()
        handleDrawerClose()
      },
    })
  }

  const onSubmit = async (form) => {
    try {
      setIsSubmitting(true)
      const payload = {
        ...form,
        title: form?.title || '',
        description: form?.description || '',
      }
      section
        ? handleUpdateSection(
            {
              id: section.id,
              payload,
            },
            {
              onSuccess: handleDrawerClose(),
            }
          )
        : handleCreateSection(
            {
              ...payload,
              position,
              menuId,
              restaurantId: user.restaurants[0].id,
            },
            {
              onSuccess: handleDrawerClose(),
            }
          )
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
            <FormLabel>Title</FormLabel>
            <Input
              autoComplete="off"
              {...register('title', { required: true })}
            />
          </FormControl>
          <FormControl id="description">
            <FormLabel>Description</FormLabel>
            <Textarea
              autoComplete="off"
              {...register('description')}
              resize="none"
              rows="6"
            />
          </FormControl>
          {section && (
            <Box>
              <Button
                colorScheme="red"
                variant="link"
                leftIcon={<Icon as={Trash2} />}
                onClick={dialogState.onOpen}
              >
                Delete Section
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
            loadingText={section ? 'Updating...' : 'Creating...'}
            isLoading={isSubmitting}
            colorScheme="blue"
            onClick={handleSubmit(onSubmit)}
            isFullWidth
          >
            {section ? 'Update' : 'Create'}
          </Button>
        </ButtonGroup>
      </DrawerFooter>

      <AlertDialog
        isOpen={dialogState.isOpen}
        onClose={dialogState.onClose}
        leastDestructiveRef={leastDestructiveRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <SectionDeleteDialog
              leastDestructiveRef={leastDestructiveRef}
              onClose={dialogState.onClose}
              onDelete={onDelete}
              isDeleting={isDeleting}
              section={section}
            />
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
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

  const dialogState = useDisclosure()
  const leastDestructiveRef = useRef()

  const {
    register,
    handleSubmit,
    control,
    formState: { dirtyFields },
  } = useForm({
    defaultValues: {
      ...menuItem,
      price:
        menuItem?.price || menuItem?.price === 0
          ? parseFloat(menuItem.price).toFixed(2)
          : null,
      image: menuItem?.image?.src || null,
    },
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useAuthUser()

  const { mutate: handleUpdateMenuItem } = useUpdateMenuItem({
    menuId,
  })

  const { mutate: handleCreateMenuItem } = useCreateMenuItem({
    menuId,
  })

  const { mutate: handleDeleteMenuItem, isLoading: isDeleting } =
    useDeleteMenuItem({
      menuId,
    })

  const onDelete = () => {
    handleDeleteMenuItem(menuItem.id, {
      onSuccess: () => {
        dialogState.onClose()
        handleDrawerClose()
      },
    })
  }

  const onSubmit = async (form) => {
    try {
      setIsSubmitting(true)
      const payload = {
        ...form,
        title: form?.title || '',
        description: form?.description || '',
        price: form?.price || null,
      }
      if (form?.image && dirtyFields?.image) {
        const formData = new FormData()
        formData.append('file', form.image, form.image.name)

        payload.image = {
          blurDataURL: await blurhashEncode(form.image),
          src: await postUpload(formData),
        }
      }
      menuItem
        ? handleUpdateMenuItem(
            {
              id: menuItem.id,
              payload,
            },
            {
              onSuccess: handleDrawerClose(),
            }
          )
        : handleCreateMenuItem(
            {
              ...payload,
              sectionId,
              position,
              menuId,
              restaurantId: user.restaurants[0].id,
            },
            {
              onSuccess: handleDrawerClose(),
            }
          )

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
            <Controller
              control={control}
              name="price"
              render={({ field: { value, ...field } }) => (
                <NumberInput
                  {...field}
                  value={value || value === 0 ? '$' + value : ''}
                  precision={2}
                  step={0.01}
                  min={0}
                >
                  <NumberInputField inputMode="numeric" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              )}
            />
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
                onClick={dialogState.onOpen}
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

      <AlertDialog
        isOpen={dialogState.isOpen}
        onClose={dialogState.onClose}
        leastDestructiveRef={leastDestructiveRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <MenuItemDeleteDialog
              onClose={dialogState.onClose}
              leastDestructiveRef={leastDestructiveRef}
              onDelete={onDelete}
              isDeleting={isDeleting}
            />
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

const MenuItemDeleteDialog = ({
  leastDestructiveRef,
  onClose,
  onDelete,
  isDeleting,
  menuItem,
}) => {
  return (
    <>
      <AlertDialogHeader fontSize="lg" fontWeight="bold">
        Delete Item
      </AlertDialogHeader>

      <AlertDialogBody>
        <Text mb="4">Are you sure you want to delete this item?</Text>
        <Text>This action is permanent and cannot be undone.</Text>
      </AlertDialogBody>

      <AlertDialogFooter>
        <ButtonGroup>
          <Button ref={leastDestructiveRef} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={onDelete} isLoading={isDeleting}>
            Delete
          </Button>
        </ButtonGroup>
      </AlertDialogFooter>
    </>
  )
}

const SectionDeleteDialog = ({
  leastDestructiveRef,
  onClose,
  onDelete,
  isDeleting,
  section,
}) => {
  return (
    <>
      <AlertDialogHeader fontSize="lg" fontWeight="bold">
        Delete Section & Items
      </AlertDialogHeader>

      <AlertDialogBody>
        <Text mb="4">
          Are you sure you want to delete this section? Deleting a section also
          deletes{' '}
          <Text as="em" fontWeight="semibold">
            all the items it contains
          </Text>
          .
        </Text>
        <Text>This action is permanent and cannot be undone.</Text>
      </AlertDialogBody>

      <AlertDialogFooter>
        <ButtonGroup>
          <Button ref={leastDestructiveRef} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={onDelete} isLoading={isDeleting}>
            Delete
          </Button>
        </ButtonGroup>
      </AlertDialogFooter>
    </>
  )
}
