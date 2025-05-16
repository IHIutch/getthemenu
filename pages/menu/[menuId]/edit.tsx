import type { RouterOutputs } from '@/server'
import type {
  UseDisclosureReturn,
} from '@chakra-ui/react'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import type { DropResult } from 'react-beautiful-dnd'
import type { SubmitHandler } from 'react-hook-form'

import ImageDropzone from '@/components/common/ImageDropzone'
import MenuLayout from '@/layouts/Menu'
import { appRouter } from '@/server'
import { postUpload } from '@/utils/axios/uploads'
import { move, reorderList } from '@/utils/functions'
import {
  useCreateMenuItem,
  useDeleteMenuItem,
  useGetMenuItems,
  useReorderMenuItems,
  useUpdateMenuItem,
} from '@/utils/react-query/menuItems'
import { useGetMenu } from '@/utils/react-query/menus'
import {
  useCreateSection,
  useDeleteSection,
  useGetSections,
  useReorderSections,
  useUpdateSection,
} from '@/utils/react-query/sections'
import { useGetAuthedUser } from '@/utils/react-query/users'
import { getSupabaseServerClient } from '@/utils/supabase/server-props'
import {
  AspectRatio,
  Box,
  Button,
  ButtonGroup,
  Center,
  Container,
  Dialog,
  Drawer,
  Field,
  Flex,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  NumberInput,
  Stack,
  StackSeparator,
  Text,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import { createServerSideHelpers } from '@trpc/react-query/server'
import groupBy from 'lodash/groupBy'
import { Camera, GripHorizontal, MoreVertical, Trash2 } from 'lucide-react'
import Head from 'next/head'
import NextImage from 'next/image'
import { useRouter } from 'next/router'
import * as React from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { Controller, useForm } from 'react-hook-form'
import SuperJSON from 'superjson'

export default function MenuEdit({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useGetAuthedUser({ initialData: user })

  const router = useRouter()
  const menuId = router.query?.menuId?.toString() ?? ''

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
    'sectionId',
  )

  const sortedSections = React.useMemo(() => {
    return (sections || []).sort((a, b) => (a.position || 0) - (b.position || 0))
  }, [sections])

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result
    if (!destination)
      return // dropped outside the list

    const sectionListSource = groupedSectionItems[source.droppableId]
    const sectionListDestination = groupedSectionItems[destination.droppableId]

    if (type === 'SECTIONS') {
      const reorderedSections = reorderList(
        sections,
        source.index,
        destination.index,
      )
      handleReorderSections({
        payload: reorderedSections.map((s, idx) => ({
          id: Number(s.id),
          position: idx,
        })),
      })
    }
    else if (type === 'ITEMS') {
      if (!sectionListSource)
        throw new Error('Section "source" items not found')

      if (source.droppableId === destination.droppableId) {
        const reorderedItems = reorderList(
          sectionListSource,
          source.index,
          destination.index,
        )
        handleReorderMenuItems({
          payload: reorderedItems.map((i, idx) => ({
            id: Number(i.id),
            position: idx,
          })),
        })
      }
    }
    else {
      if (!sectionListSource)
        throw new Error('Section "source" items not found')
      if (!sectionListDestination)
        throw new Error('Section "destination" items not found')

      const { resultSource, resultDestination } = move(
        sectionListSource,
        sectionListDestination,
        source,
        destination,
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
        }),
      )
      handleReorderMenuItems({
        payload: newSource.concat(newDestination),
      })
    }
  }

  return (
    <>
      <Head>
        <title>{menu?.title}</title>
      </Head>
      <Container maxW="container.md" px={{ base: '2', lg: '4' }}>
        {sections.length > 0 && groupedSectionItems
          ? (
            <DragDropContext
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
            >
              <Droppable droppableId="sectionWrapper" type="SECTIONS">
                {drop => (
                  <Stack gap="8" ref={drop.innerRef} {...drop.droppableProps}>
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
                                    aria-label="Edit section"
                                    ml="2"
                                    size="xs"
                                    variant="outline"
                                  >
                                    <Icon
                                      boxSize="5"
                                      as={MoreVertical}
                                      onClick={() =>
                                        menu
                                          ? handleDrawerOpen(
                                            <SectionDrawer
                                              menu={menu}
                                              section={s}
                                              handleDrawerClose={
                                                drawerState.onClose
                                              }
                                            />,
                                          )
                                          : null}
                                    />
                                  </IconButton>
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
                                    menu
                                      ? handleDrawerOpen(
                                        <MenuItemDrawer
                                          menu={menu}
                                          section={s}
                                          position={
                                            groupedSectionItems?.[s.id]?.length || 0
                                          }
                                          handleDrawerClose={drawerState.onClose}
                                        />,
                                      )
                                      : null}
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
          )
          : (
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
              menu
                ? handleDrawerOpen(
                  <SectionDrawer
                    menu={menu}
                    position={sortedSections.length}
                    handleDrawerClose={drawerState.onClose}
                  />,
                )
                : null}
          >
            Add Section
          </Button>
        </Box>
      </Container>
      <Drawer.Root
        open={drawerState.open}
        placement="end"
        onOpenChange={e => drawerState.setOpen(e.open)}
      >
        <Drawer.Backdrop />
        <Drawer.Content>{drawerType}</Drawer.Content>
      </Drawer.Root>
    </>
  )
}

MenuEdit.getLayout = (page: React.ReactNode) => <MenuLayout>{page}</MenuLayout>

function MenuItemsContainer({
  items,
  handleDrawerOpen,
  drawerState,
  sectionId,
}: {
  items: RouterOutputs['menuItem']['getAllByMenuId']
  handleDrawerOpen: (content: React.ReactNode) => void
  drawerState: UseDisclosureReturn
  sectionId: number
}) {
  const router = useRouter()
  const { menuId } = router.query

  const { data: menu } = useGetMenu(Number(menuId))

  return (
    <Droppable droppableId={String(sectionId)} type="ITEMS">
      {drop => (
        <Box>
          <Stack
            gap="0"
            ref={drop.innerRef}
            {...drop.droppableProps}
            separator={<StackSeparator />}
          >
            {items?.length > 0
              ? (
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
                              {menu
                                ? (
                                  <MenuItem
                                    menu={menu}
                                    menuItem={menuItem}
                                    handleDrawerOpen={handleDrawerOpen}
                                    drawerState={drawerState}
                                  />
                                )
                                : null}
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Draggable>
                  </Box>
                ))
              )
              : (
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

function MenuItem({
  menu,
  menuItem,
  handleDrawerOpen,
  drawerState,
}: {
  menu: RouterOutputs['menu']['getById']
  menuItem: RouterOutputs['menuItem']['getAllByMenuId'][number]
  handleDrawerOpen: (content: React.ReactNode) => void
  drawerState: UseDisclosureReturn
}) {
  return (
    <Flex alignItems="flex-start">
      <AspectRatio
        w="16"
        ratio={1}
        flexShrink="0"
        rounded="sm"
        overflow="hidden"
      >
        {menuItem.image
          ? (
            <Image asChild>
              <NextImage
                alt={menuItem.title || 'Menu Item'}
                src={menuItem.image.src}
                blurDataURL={menuItem.image.blurDataURL}
                fill={true}
                placeholder={menuItem.image.blurDataURL ? 'blur' : 'empty'}
              />
            </Image>
          )
          : (
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
              aria-label="Open menu item drawer"
              ml="2"
              size="xs"
              variant="outline"
            >
              <Icon
                boxSize="5"
                as={MoreVertical}
                onClick={() =>
                  menu
                    ? handleDrawerOpen(
                      <MenuItemDrawer
                        menu={menu}
                        menuItem={menuItem}
                        handleDrawerClose={drawerState.onClose}
                      />,
                    )
                    : null}
              />
            </IconButton>
          </Box>
        </Flex>
      </Box>
    </Flex>
  )
}

interface DefaultValueSectionType {
  title: string
  description: string
}

function SectionDrawer({
  position,
  section,
  menu,
  handleDrawerClose,
}: {
  position: number
  section?: undefined
  menu: RouterOutputs['menu']['getById']
  handleDrawerClose: () => void
} | {
  position?: undefined
  section: RouterOutputs['section']['getAllByMenuId'][number]
  menu: RouterOutputs['menu']['getById']
  handleDrawerClose: () => void
}) {
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
    handleSubmit,
  } = useForm<DefaultValueSectionType>({ defaultValues })

  const { mutateAsync: handleUpdateSection, isSuccess: isUpdateSuccess } = useUpdateSection(Number(menuId))
  const { mutateAsync: handleCreateSection, isSuccess: isCreateSuccess } = useCreateSection(Number(menuId))
  const { mutateAsync: handleDeleteSection, isPending: isDeleting, isSuccess: isDeleteSuccess }
    = useDeleteSection(Number(menuId))

  const onDelete = () => {
    if (!section)
      return
    handleDeleteSection({
      where: { id: section.id },
    })
  }

  React.useEffect(() => {
    if (isDeleteSuccess) {
      dialogState.onClose()
      handleDrawerClose()
    }
  }, [dialogState, handleDrawerClose, isDeleteSuccess])

  React.useEffect(() => {
    if (isUpdateSuccess || isCreateSuccess)
      handleDrawerClose()
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
          },
        })
      setIsSubmitting(false)
    }
    catch (error) {
      setIsSubmitting(false)
      alert(error)
    }
  }

  return (
    <>
      <Drawer.CloseTrigger />
      <Drawer.Header px="4">Edit Section</Drawer.Header>

      <Drawer.Body px="4">
        <Stack gap="6">
          <Field.Root id="title">
            <Field.Label>Title</Field.Label>
            <Input
              autoComplete="off"
              {...register('title', { required: true })}
            />
          </Field.Root>
          <Field.Root id="description">
            <Field.Label>Description</Field.Label>
            <Textarea
              autoComplete="off"
              {...register('description')}
              resize="none"
              rows={6}
            />
          </Field.Root>
          {section && (
            <Box>
              <Button
                colorScheme="red"
                variant="plain"
                onClick={dialogState.onOpen}
              >
                <Icon as={Trash2} />
                {' '}
                Delete Section
              </Button>
            </Box>
          )}
        </Stack>
      </Drawer.Body>

      <Drawer.Footer px="4" borderTopWidth="1px" borderTopColor="gray.200">
        <ButtonGroup w="100%">
          <Button variant="outline" onClick={handleDrawerClose} w="100%">
            Cancel
          </Button>
          <Button
            loadingText={section ? 'Updating...' : 'Creating...'}
            loading={isSubmitting}
            colorScheme="blue"
            onClick={handleSubmit(onSubmit)}
            w="100%"
          >
            {section ? 'Update' : 'Create'}
          </Button>
        </ButtonGroup>
      </Drawer.Footer>

      <Dialog.Root
        role="alertdialog"
        open={dialogState.open}
        onOpenChange={e => dialogState.setOpen(e.open)}
        initialFocusEl={() => leastDestructiveRef.current}
      >
        <Dialog.Backdrop />
        <Dialog.Content>
          <SectionDeleteDialog
            onClose={dialogState.onClose}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        </Dialog.Content>
      </Dialog.Root>
    </>
  )
}

interface DefaultValueMenuItemType {
  title: string
  price: string
  description: string
  image: {
    type: 'old'
    src: string
    blurDataURL?: string
  } | {
    type: 'new'
    file: File
    src?: string
  }
}

function MenuItemDrawer({
  position,
  section,
  menuItem,
  handleDrawerClose,
}: {
  position: number
  section: RouterOutputs['section']['getAllByMenuId'][number]
  menuItem?: undefined
  menu: RouterOutputs['menu']['getById']
  handleDrawerClose: () => void
} | {
  position?: undefined
  section?: undefined
  menuItem: RouterOutputs['menuItem']['getAllByMenuId'][number]
  menu: RouterOutputs['menu']['getById']
  handleDrawerClose: () => void
}) {
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
      src: menuItem?.image?.src || '',
    },
  }

  const {
    register,
    handleSubmit,
    control,
  } = useForm<DefaultValueMenuItemType>({ defaultValues })

  const { mutateAsync: handleUpdateMenuItem, isSuccess: isUpdateSuccess } = useUpdateMenuItem(Number(menuId))
  const { mutateAsync: handleCreateMenuItem, isSuccess: isCreateSuccess } = useCreateMenuItem(Number(menuId))
  const { mutateAsync: handleDeleteMenuItem, isPending: isDeleting, isSuccess: isDeleteSuccess }
    = useDeleteMenuItem(Number(menuId))

  React.useEffect(() => {
    if (isDeleteSuccess) {
      dialogState.onClose()
      handleDrawerClose()
    }
  }, [dialogState, handleDrawerClose, isDeleteSuccess])

  React.useEffect(() => {
    if (isUpdateSuccess || isCreateSuccess)
      handleDrawerClose()
  }, [handleDrawerClose, isCreateSuccess, isUpdateSuccess])

  const onDelete = () => {
    if (!menuItem)
      return
    handleDeleteMenuItem({ where: { id: menuItem.id } })
  }

  const onSubmit: SubmitHandler<DefaultValueMenuItemType> = async (form) => {
    try {
      setIsSubmitting(true)

      let imageData
      if (form?.image && form.image.type === 'new') {
        const formData = new FormData()
        formData.append('file', form.image.file, form.image.file.name)

        const data = await postUpload(formData)
        imageData = {
          image: data,
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
          },
        })

      setIsSubmitting(false)
    }
    catch (error) {
      setIsSubmitting(false)
      alert(error)
    }
  }

  return (
    <>
      <Drawer.CloseTrigger />
      <Drawer.Header px="4">Edit Item</Drawer.Header>

      <Drawer.Body px="4">
        <Stack gap="6">
          <Box>
            <Field.Root id="image">
              <Field.Label>Item Image</Field.Label>
              <AspectRatio ratio={16 / 9} display="block">
                <Controller
                  name="image"
                  control={control}
                  render={({ field: { onChange, value } }) => {
                    return <ImageDropzone onChange={val => onChange({ type: 'new', file: val })} value={value.src || ''} />
                  }}
                />
              </AspectRatio>
            </Field.Root>
          </Box>
          <Field.Root id="title">
            <Field.Label>Item Name</Field.Label>
            <Input
              autoComplete="off"
              {...register('title', { required: true })}
            />
          </Field.Root>
          <Field.Root id="price">
            <Field.Label>Item Price</Field.Label>
            <Controller
              control={control}
              name="price"
              render={({ field: { value, ...field } }) => (
                <NumberInput.Root
                  {...field}
                  value={value ? `$${value}` : ''}
                  formatOptions={{
                    currency: 'USD',
                  }}
                  step={0.01}
                  min={0}
                >
                  <NumberInput.Control>
                    <NumberInput.IncrementTrigger />
                    <NumberInput.DecrementTrigger />
                  </NumberInput.Control>
                  <NumberInput.Scrubber />
                  <NumberInput.Input inputMode="decimal" />
                </NumberInput.Root>
              )}
            />
          </Field.Root>
          <Field.Root id="description">
            <Field.Label>Item Description</Field.Label>
            <Textarea
              autoComplete="off"
              {...register('description')}
              resize="none"
              rows={6}
            />
          </Field.Root>
          {menuItem && (
            <Box>
              <Button
                colorScheme="red"
                variant="plain"
                onClick={dialogState.onOpen}
              >
                <Icon as={Trash2} />
                {' '}
                Delete Item
              </Button>
            </Box>
          )}
        </Stack>
      </Drawer.Body>

      <Drawer.Footer px="4" borderTopWidth="1px" borderTopColor="gray.200">
        <ButtonGroup w="100%">
          <Button variant="outline" onClick={handleDrawerClose} w="100%">
            Cancel
          </Button>
          <Button
            loadingText={menuItem ? 'Updating...' : 'Creating...'}
            loading={isSubmitting}
            colorScheme="blue"
            onClick={handleSubmit(onSubmit)}
            w="100%"
          >
            {menuItem ? 'Update' : 'Create'}
          </Button>
        </ButtonGroup>
      </Drawer.Footer>

      <Dialog.Root
        role="alertdialog"
        open={dialogState.open}
        onOpenChange={e => dialogState.setOpen(e.open)}
        initialFocusEl={() => leastDestructiveRef.current}
      >
        <Dialog.Backdrop />
        <Dialog.Content>
          <MenuItemDeleteDialog
            onClose={dialogState.onClose}
            onDelete={onDelete}
            isDeleting={isDeleting}
          />
        </Dialog.Content>
      </Dialog.Root>
    </>
  )
}

function MenuItemDeleteDialog({
  onClose,
  onDelete,
  isDeleting,
}: {
  onClose: UseDisclosureReturn['onClose']
  onDelete: () => void
  isDeleting: boolean
}) {
  return (
    <>
      <Dialog.Header fontSize="lg" fontWeight="bold">
        Delete Item
      </Dialog.Header>

      <Dialog.Body>
        <Text mb="4">Are you sure you want to delete this item?</Text>
        <Text>This action is permanent and cannot be undone.</Text>
      </Dialog.Body>

      <Dialog.Footer>
        <ButtonGroup>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={onDelete} loading={isDeleting}>
            Delete
          </Button>
        </ButtonGroup>
      </Dialog.Footer>
    </>
  )
}

function SectionDeleteDialog({
  onClose,
  onDelete,
  isDeleting,
}: {
  onClose: UseDisclosureReturn['onClose']
  onDelete: () => void
  isDeleting: boolean
}) {
  return (
    <>
      <Dialog.Header fontSize="lg" fontWeight="bold">
        Delete Section & Items
      </Dialog.Header>

      <Dialog.Body>
        <Text mb="4">
          Are you sure you want to delete this section? Deleting a section also
          deletes
          {' '}
          <Text as="em" fontWeight="semibold">
            all the items it contains
          </Text>
          .
        </Text>
        <Text>This action is permanent and cannot be undone.</Text>
      </Dialog.Body>

      <Dialog.Footer>
        <ButtonGroup>
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={onDelete} loading={isDeleting}>
            Delete
          </Button>
        </ButtonGroup>
      </Dialog.Footer>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = getSupabaseServerClient(context)
  const { data } = await supabase.auth.getUser()

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      session: {
        user: data.user,
      },
    },
    transformer: SuperJSON,
  })

  const user = await helpers.user.getAuthedUser.fetch()

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  else if (user.restaurants.length === 0) {
    return {
      redirect: {
        destination: '/onboarding/setup',
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
