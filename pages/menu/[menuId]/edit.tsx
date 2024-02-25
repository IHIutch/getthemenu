import * as React from 'react'
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
  UseDisclosureReturn,
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
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd'
import {
  useCreateSection,
  useDeleteSection,
  useGetSections,
  useReorderSections,
  useUpdateSection,
} from '@/utils/react-query/sections'
import { move, reorderList } from '@/utils/functions'
import { postUpload } from '@/utils/axios/uploads'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import ImageDropzone from '@/components/common/ImageDropzone'
import MenuLayout from '@/layouts/Menu'
import groupBy from 'lodash/groupBy'
import BlurImage from '@/components/common/BlurImage'
import { RouterOutputs, appRouter } from '@/server'
import { createClientServer } from '@/utils/supabase/server-props'
import { createServerSideHelpers } from '@trpc/react-query/server'
import SuperJSON from 'superjson'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { useGetAuthedUser } from '@/utils/react-query/users'

export default function MenuEdit({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useGetAuthedUser({ initialData: user })

  const router = useRouter()
  const menuId = router.query?.menuId?.toString() ?? ""

  const drawerState = useDisclosure()
  const [drawerType, setDrawerType] = React.useState<React.ReactNode>(null)
  const handleDrawerOpen = (content: React.ReactNode) => {
    setDrawerType(content)
    drawerState.onOpen()
  }

  const { data: menu } = useGetMenu(Number(menuId))
  const { data: menuItems = [] } = useGetMenuItems(Number(menuId))
  const { data: sections = [] } = useGetSections(Number(menuId))
  const { mutateAsync: handleReorderMenuItems } = useReorderMenuItems(Number(menuId))
  const { mutateAsync: handleReorderSections } = useReorderSections(Number(menuId))

  const handleDragStart = () => {
    if (navigator.vibrate) {
      navigator.vibrate(75)
    }
  }

  const groupedSectionItems = groupBy(
    (menuItems || []).sort((a, b) => (a.position || 0) - (b.position || 0)),
    'sectionId'
  )

  const sortedSections = React.useMemo(() => {
    return (sections || []).sort((a, b) => (a.position || 0) - (b.position || 0))
  }, [sections])

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result
    if (!destination) return // dropped outside the list

    console.log({ source, destination })

    const sectionListSource = groupedSectionItems[source.droppableId]
    const sectionListDestination = groupedSectionItems[destination.droppableId]

    if (type === 'SECTIONS') {
      const reorderedSections = reorderList(
        (sections || []).sort((a, b) => (a.position || 0) - (b.position || 0)),
        source.index,
        destination.index
      )
      handleReorderSections({
        payload: reorderedSections.map((s, idx) => ({
          id: Number(s.id),
          position: idx,
        }))
      })
    } else if (type === 'ITEMS') {
      if (!sectionListSource) throw new Error('Section "source" items not found')

      if (source.droppableId === destination.droppableId) {
        const reorderedItems = reorderList(
          sectionListSource,
          source.index,
          destination.index
        )
        handleReorderMenuItems({
          payload: reorderedItems.map((i, idx) => ({
            id: Number(i.id),
            position: idx,
          }))
        })
      }

    } else {
      if (!sectionListSource) throw new Error('Section "source" items not found')
      if (!sectionListDestination) throw new Error('Section "destination" items not found')

      const { resultSource, resultDestination } = move(
        sectionListSource,
        sectionListDestination,
        source,
        destination
      )

      const newSource = resultSource.map((i, idx) => ({
        id: Number(i.id),
        position: idx,
        sectionId: Number(source.droppableId),
      }))
      const newDestination = resultDestination.map(
        (i, idx) => ({
          id: Number(i.id),
          position: idx,
          sectionId: Number(destination.droppableId),
        })
      )
      handleReorderMenuItems({
        payload: newSource.concat(newDestination)
      })
    }
  }

  return (
    <>
      <Head>
        <title>{menu?.title}</title>
      </Head>
      <Container maxW="container.md" px={{ base: '2', lg: '4' }}>
        {sections.length > 0 && groupedSectionItems ? (
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
                              <Box>
                                <Heading fontSize="2xl" fontWeight="semibold">
                                  {s.title}
                                </Heading>
                                {s.description && (
                                  <Text
                                    color="gray.600"
                                    mt="1"
                                    whiteSpace="pre-line"
                                  >
                                    {s.description}
                                  </Text>
                                )}
                              </Box>
                              <Box ml="auto">
                                <IconButton
                                  aria-label='Edit section'
                                  ml="2"
                                  size="xs"
                                  variant="outline"
                                  icon={
                                    <Icon
                                      boxSize="5"
                                      as={MoreVertical}
                                      onClick={() =>
                                        menu ? handleDrawerOpen(
                                          <SectionDrawer
                                            menu={menu}
                                            section={s}
                                            handleDrawerClose={
                                              drawerState.onClose
                                            }
                                          />
                                        ) : null
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
                                  menu ? handleDrawerOpen(
                                    <MenuItemDrawer
                                      menu={menu}
                                      section={s}
                                      position={
                                        groupedSectionItems?.[s.id]?.length || 0
                                      }
                                      handleDrawerClose={drawerState.onClose}
                                    />
                                  ) : null
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
              menu ? handleDrawerOpen(
                <SectionDrawer
                  menu={menu}
                  position={sortedSections.length}
                  handleDrawerClose={drawerState.onClose}
                />
              ) : null
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

MenuEdit.getLayout = (page: React.ReactNode) => <MenuLayout>{page}</MenuLayout>

const MenuItemsContainer = ({
  items,
  handleDrawerOpen,
  drawerState,
  sectionId,
}: {
  items: RouterOutputs['menuItem']['getAllByMenuId'],
  handleDrawerOpen: (content: React.ReactNode) => void,
  drawerState: UseDisclosureReturn,
  sectionId: number
}) => {

  const router = useRouter()
  const { menuId } = router.query

  const { data: menu } = useGetMenu(Number(menuId))

  return (
    <Droppable droppableId={String(sectionId)} type="ITEMS">
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
                            {menu ? <MenuItem
                              menu={menu}
                              menuItem={menuItem}
                              handleDrawerOpen={handleDrawerOpen}
                              drawerState={drawerState}
                            /> : null}
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

const MenuItem = ({
  menu,
  menuItem,
  handleDrawerOpen,
  drawerState
}: {
  menu: RouterOutputs['menu']['getById'],
  menuItem: RouterOutputs['menuItem']['getAllByMenuId'][number],
  handleDrawerOpen: (content: React.ReactNode) => void,
  drawerState: UseDisclosureReturn
}) => {
  return (
    <Flex alignItems="flex-start">
      <AspectRatio
        w="16"
        ratio={1}
        flexShrink="0"
        rounded="sm"
        overflow="hidden"
      >
        {menuItem.image ? (
          <BlurImage
            alt={menuItem.title || 'Menu Item'}
            src={menuItem.image.src}
            blurDataURL={menuItem.image.blurDataURL}
            fill={true}
            placeholder={menuItem.image.blurDataURL ? "blur" : 'empty'}
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
                {menuItem.price.toLocaleString('en-US', {
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
              aria-label='Open menu item drawer'
              ml="2"
              size="xs"
              variant="outline"
              icon={
                <Icon
                  boxSize="5"
                  as={MoreVertical}
                  onClick={() =>
                    menu ? handleDrawerOpen(
                      <MenuItemDrawer
                        menu={menu}
                        menuItem={menuItem}
                        handleDrawerClose={drawerState.onClose}
                      />
                    ) : null
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

type DefaultValueSectionType = {
  title: string,
  description: string
}

const SectionDrawer = ({
  position,
  section,
  menu,
  handleDrawerClose
}: {
  position: number,
  section?: undefined,
  menu: RouterOutputs['menu']['getById'],
  handleDrawerClose: () => void
} | {
  position?: undefined,
  section: RouterOutputs['section']['getAllByMenuId'][number],
  menu: RouterOutputs['menu']['getById'],
  handleDrawerClose: () => void
}) => {
  const router = useRouter()
  const { menuId } = router.query

  const dialogState = useDisclosure()
  const leastDestructiveRef = React.useRef(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const defaultValues: DefaultValueSectionType = {
    title: section?.title || '',
    description: section?.description || '',
  }

  const {
    register,
    handleSubmit
  } = useForm<DefaultValueSectionType>({ defaultValues })

  const { mutateAsync: handleUpdateSection, isSuccess: isUpdateSuccess } = useUpdateSection(Number(menuId))
  const { mutateAsync: handleCreateSection, isSuccess: isCreateSuccess } = useCreateSection(Number(menuId))
  const { mutateAsync: handleDeleteSection, isPending: isDeleting, isSuccess: isDeleteSuccess } =
    useDeleteSection(Number(menuId))

  const onDelete = () => {
    if (!section) return
    handleDeleteSection({
      where: { id: section.id }
    })
  }

  React.useEffect(() => {
    if (isDeleteSuccess) {
      dialogState.onClose()
      handleDrawerClose()
    }
  }, [dialogState, handleDrawerClose, isDeleteSuccess])

  React.useEffect(() => {
    if (isUpdateSuccess || isCreateSuccess) handleDrawerClose()
  }, [handleDrawerClose, isCreateSuccess, isUpdateSuccess])


  const onSubmit: SubmitHandler<DefaultValueSectionType> = async (form) => {
    try {
      setIsSubmitting(true)
      section
        ? handleUpdateSection({
          where: { id: section.id },
          payload: form,
        })
        : handleCreateSection({
          payload: {
            ...form,
            position,
            menuId: menu?.id,
            restaurantId: menu?.restaurantId,
          }
        })
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
              rows={6}
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
          <Button variant="outline" onClick={handleDrawerClose} w="100%">
            Cancel
          </Button>
          <Button
            loadingText={section ? 'Updating...' : 'Creating...'}
            isLoading={isSubmitting}
            colorScheme="blue"
            onClick={handleSubmit(onSubmit)}
            w="100%"
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
            />
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

type DefaultValueMenuItemType = {
  title: string,
  price: string,
  description: string
  image: {
    type: 'old'
    src: string,
    blurDataURL?: string
  } | {
    type: 'new'
    file: File
    src?: string,
  }
}

const MenuItemDrawer = ({
  position,
  section,
  menuItem,
  handleDrawerClose,
}: {
  position: number,
  section: RouterOutputs['section']['getAllByMenuId'][number],
  menuItem?: undefined,
  menu: RouterOutputs['menu']['getById'],
  handleDrawerClose: () => void
} | {
  position?: undefined,
  section?: undefined,
  menuItem: RouterOutputs['menuItem']['getAllByMenuId'][number],
  menu: RouterOutputs['menu']['getById'],
  handleDrawerClose: () => void
}) => {
  const router = useRouter()
  const { menuId } = router.query

  const dialogState = useDisclosure()
  const leastDestructiveRef = React.useRef(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const defaultValues: DefaultValueMenuItemType = {
    title: menuItem?.title || '',
    price: String(menuItem?.price) || '',
    description: menuItem?.description || '',
    image: {
      type: 'old',
      src: menuItem?.image?.src || ''
    },
  }

  const {
    register,
    handleSubmit,
    control,
  } = useForm<DefaultValueMenuItemType>({ defaultValues })

  const { mutateAsync: handleUpdateMenuItem, isSuccess: isUpdateSuccess } = useUpdateMenuItem(Number(menuId))
  const { mutateAsync: handleCreateMenuItem, isSuccess: isCreateSuccess } = useCreateMenuItem(Number(menuId))
  const { mutateAsync: handleDeleteMenuItem, isPending: isDeleting, isSuccess: isDeleteSuccess } =
    useDeleteMenuItem(Number(menuId))

  React.useEffect(() => {
    if (isDeleteSuccess) {
      dialogState.onClose()
      handleDrawerClose()
    }
  }, [dialogState, handleDrawerClose, isDeleteSuccess])

  React.useEffect(() => {
    if (isUpdateSuccess || isCreateSuccess) handleDrawerClose()
  }, [handleDrawerClose, isCreateSuccess, isUpdateSuccess])

  const onDelete = () => {
    if (!menuItem) return
    handleDeleteMenuItem({ where: { id: menuItem.id } })
  }

  const onSubmit: SubmitHandler<DefaultValueMenuItemType> = async (form) => {
    try {
      setIsSubmitting(true)

      let imageData
      if (form?.image && form.image.type === 'new') {
        const formData = new FormData()
        formData.append('file', form.image.file, form.image.file.name)

        const { src, blurDataURL } = await postUpload(formData)
        imageData = {
          image: {
            src,
            blurDataURL
          }
        }
      }

      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        ...imageData,
      }
      menuItem
        ? handleUpdateMenuItem({
          where: { id: menuItem.id },
          payload,
        })
        : handleCreateMenuItem({
          payload: {
            ...payload,
            position,
            sectionId: section.id,
            menuId: section.menuId,
            restaurantId: section.restaurantId,
          }
        })

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
              <AspectRatio ratio={16 / 9} display="block">
                <Controller
                  name="image"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return <ImageDropzone onChange={(val) => onChange({ type: 'new', file: val })} value={value.src || ''} />
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
                  value={value ? '$' + value : ''}
                  precision={2}
                  step={0.01}
                  min={0}
                >
                  <NumberInputField inputMode="decimal" />
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
              rows={6}
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
          <Button variant="outline" onClick={handleDrawerClose} w="100%">
            Cancel
          </Button>
          <Button
            loadingText={menuItem ? 'Updating...' : 'Creating...'}
            isLoading={isSubmitting}
            colorScheme="blue"
            onClick={handleSubmit(onSubmit)}
            w="100%"
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
}: {
  leastDestructiveRef: React.RefObject<HTMLButtonElement>,
  onClose: UseDisclosureReturn['onClose'],
  onDelete: () => void,
  isDeleting: boolean,
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
}: {
  leastDestructiveRef: React.RefObject<HTMLButtonElement>,
  onClose: UseDisclosureReturn['onClose'],
  onDelete: () => void,
  isDeleting: boolean,
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClientServer(context)
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      supabase
    },
    transformer: SuperJSON,
  });

  const user = await helpers.user.getAuthedUser.fetch()

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  } else if (user.restaurants.length === 0) {
    return {
      redirect: {
        destination: '/get-started',
        permanent: false,
      },
    }
  }

  return {
    props: {
      user,
      trpcState: helpers.dehydrate(),
    },
  }
}

