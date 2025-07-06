import { AspectRatio, Box, Button, CloseButton, createOverlay, Drawer, Field, FileUpload, Flex, Float, FormatNumber, Heading, HStack, Icon, IconButton, Image, Input, NumberInput, Square, Stack, StackSeparator, Text, Textarea, useFileUploadContext, VStack } from '@chakra-ui/react'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import mime from 'mime'
import { getPlaiceholder } from 'plaiceholder'
import { v4 as uuidv4 } from 'uuid'
import * as z from 'zod/v4'
import IconClose from '~icons/material-symbols/close'
import IconImage from '~icons/material-symbols/imagesmode'
import IconMoreVert from '~icons/material-symbols/more-vert'
import IconUpload from '~icons/material-symbols/upload'

import { trpc } from '~/router'
import prisma from '~/utils/db'
import getSupabaseServerClient from '~/utils/supabase/server'
import { resizeImage } from '~/utils/resize-image'

export const uploadFile = createServerFn({ method: 'POST' })
  .validator((data) => {
    if (!(data instanceof FormData)) {
      throw new TypeError('Invalid form data')
    }
    const file = data.get('file')
    return {
      file: z.instanceof(File).parse(file),
    }
  })
  .handler(async ({ data }) => {
    const supabase = await getSupabaseServerClient()
    const file = data.file

    if (!file) {
      throw new Error('No file provided')
    }

    const fileName = `${uuidv4()}.${mime.getExtension(file.type)}`
    const { data: uploadData, error } = await supabase.storage
      .from('public')
      .upload(fileName, file)

    if (error) {
      throw new Error(error.message)
    }

    // eslint-disable-next-line node/prefer-global/buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    const {
      base64: blurDataUrl,
      metadata: {
        height,
        width,
      },
      color: {
        hex,
      },
    } = await getPlaiceholder(buffer, {
      size: 4,
    })

    return {
      blurDataUrl,
      height,
      width,
      hex,
      url: supabase.storage.from('public').getPublicUrl(uploadData.path).data.publicUrl,
    }
  })

const fetchMenuData = createServerFn({ method: 'GET' })
  .validator((publicId: unknown) => {
    return {
      publicId: z.string().parse(publicId),
    }
  })
  .handler(async ({ data }) => {
    const menu = await prisma.menus.findUnique({
      where: {
        publicId: data.publicId,
        deletedAt: null,
      },
      include: {
        sections: {
          orderBy: {
            position: 'asc',
          },
          where: {
            deletedAt: null,
          },
        },
        menuItems: {
          include: {
            image: {
              select: {
                id: true,
                url: true,
                width: true,
                height: true,
              },
              where: {
                deletedAt: null,
              }
            },
          },
          orderBy: {
            position: 'asc',
          },
          where: {
            deletedAt: null,
          },
        },
      },
    })

    if (!menu) {
      throw notFound()
    }

    const { sections, menuItems, ...rest } = menu

    return {
      menu: rest,
      sections: sections.sort((a, b) => a.position - b.position),
      menuItems: menuItems.sort((a, b) => a.position - b.position),
    }
  })

export const Route = createFileRoute('/_authed/$publicId/menu/$menuPublicId/edit')({
  loader: async ({
    params: { menuPublicId },
  }) => {
    const data = await fetchMenuData({ data: menuPublicId })
    return data
  },
  component: RouteComponent,
})

function RouteComponent() {
  const { menu, sections: initialSections, menuItems: initialMenuItems } = Route.useLoaderData()

  const { data: sections = [] } = useQuery(trpc.section.getByMenuPublicId.queryOptions({
    menuPublicId: menu.publicId,
  }, {
    initialData: initialSections,
    refetchOnMount: false,
  }))

  const { data: menuItems = [] } = useQuery(trpc.menuItem.getByMenuPublicId.queryOptions({
    menuPublicId: menu.publicId,
  }, {
    initialData: initialMenuItems,
    refetchOnMount: false,
  }))

  const sectionsWithItems = sections.map((section) => {
    const items = menuItems.filter(item => item.sectionId === section.id)
    return {
      ...section,
      menuItems: items,
    }
  })

  if (!sectionsWithItems.length) {
    return (
      <Box py={12} h="full">
        <Flex h="full" minH={0} w="full" alignItems="center" justifyContent="center" borderStyle="dashed" borderWidth={2} borderColor="gray.200" borderRadius="lg">
          <Box textAlign="center">
            <Text>Get started by adding your first menu item!</Text>
            <Button
              mt={4}
              onClick={() => {
                menuItemDrawer.open('a', {
                  id: 'a',
                })
              }}
            >
              Create Menu Item
            </Button>
            <menuItemDrawer.Viewport />
          </Box>
        </Flex>
      </Box>
    )
  }

  return (
    <Box py={4}>
      <VStack gap={4} w="full">
        {sectionsWithItems.map(section => (
          <Box key={section.id} w="full" borderWidth={1} borderColor="gray.100" borderRadius="md" bg="white" shadow="sm">
            <Flex mb={4} p={3}>
              <Box>
                { section.title
                  ? <Heading>{section.title}</Heading>
                  : <Heading fontStyle="italic" color="gray.500">Untitled Section</Heading>}
                { section.description
                  ? <Text>{section.description}</Text>
                  : <Text fontStyle="italic" color="gray.500">No description</Text>}
              </Box>
              <Box ml="auto">
                <IconButton
                  aria-label="Edit section"
                  variant="subtle"
                  size="sm"
                  onClick={() => {
                    sectionDrawer.open(section.id.toString(), {
                      id: section.id.toString(),
                      section,
                    })
                  }}
                >
                  <Icon size="lg">
                    <IconMoreVert />
                  </Icon>
                </IconButton>
                <sectionDrawer.Viewport />
              </Box>
            </Flex>
            <Box>
              <VStack separator={<StackSeparator borderColor="gray.200" />} gap={3}>
                {section.menuItems.map(item => (
                  <Box key={item.id} w="full" px={3}>
                    <HStack gap={2}>
                      {item.image[0]?.url
                        ? (
                            <Image
                              src={item.image[0]?.url || ''}
                              height={16}
                              width={16}
                              objectFit="cover"
                              alt={item.title || 'Menu Item Image'}
                              rounded="sm"
                              // fallbackSrc="https://via.placeholder.com/64"
                            />
                          )
                        : (
                            <Square
                              size={16}
                              bg="gray.100"
                              borderRadius="md"
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Icon size="md" color="fg.muted">
                                <IconImage />
                              </Icon>
                            </Square>
                          )}
                      <Box flex="1">
                        {item.title
                          ? <Heading>{item.title}</Heading>
                          : <Heading fontStyle="italic" color="gray.500">Untitled Item</Heading>}
                        {item.price
                          ? (
                              <Text>
                                <FormatNumber
                                  value={item.price / 100}
                                  style="currency"
                                  currency="USD"
                                />
                              </Text>
                            )
                          : <Text fontStyle="italic" color="gray.500">No price</Text>}
                      </Box>
                      <IconButton
                        aria-label="Edit menu item"
                        variant="subtle"
                        size="sm"
                        onClick={() => {
                          menuItemDrawer.open(item.id.toString(), {
                            id: item.id.toString(),
                            menuItem: {
                              ...item,
                              image: item.image[0],
                            },
                          })
                        }}
                      >
                        <Icon size="lg">
                          <IconMoreVert />
                        </Icon>
                      </IconButton>
                      <menuItemDrawer.Viewport />
                    </HStack>
                    <Box mt={2}>
                      {item.description
                        ? <Text>{item.description}</Text>
                        : <Text fontStyle="italic" color="gray.500">No description</Text>}
                    </Box>
                  </Box>
                ))}
              </VStack>
              <Box borderTop="1px solid" borderColor="gray.200" p={3} mt={2}>
                <Button
                  size="sm"
                  onClick={() => {
                    menuItemDrawer.open('a', {
                      id: 'a',
                      sectionId: section.id,
                    })
                  }}
                >
                  Add Item
                </Button>
              </Box>
            </Box>
          </Box>
        ))}
      </VStack>
      <Box mt={4}>
        <Button
          size="sm"
          onClick={() => {
            sectionDrawer.open('a', {
              id: 'a',
            })
          }}
        >
          Add Section
        </Button>
      </Box>
    </Box>
  )
}

interface SectionDrawerProps {
  id: string
  section?: {
    id: number
    title: string | null
    description: string | null
  }
}

const sectionDrawer = createOverlay<SectionDrawerProps>(({ id, section, ...rest }) => {
  const { publicId, menuPublicId } = Route.useParams()
  const updateSectionMutation = useMutation(trpc.section.update.mutationOptions())
  const createSectionMutation = useMutation(trpc.section.create.mutationOptions())
  const queryClient = useQueryClient()
  const { sections } = Route.useLoaderData()

  const form = useForm({
    defaultValues: {
      title: section?.title || '',
      description: section?.description || '',
    },
    onSubmit: async ({ value }) => {
      if (section?.id) {
        await updateSectionMutation.mutateAsync({
          id: section.id,
          payload: {
            title: value.title,
            description: value.description,
          },
        }, {
          onSuccess: () => {
            queryClient.invalidateQueries(trpc.section.getByMenuPublicId.queryFilter({ menuPublicId }))
            sectionDrawer.close(id)
          },
        })
      }
      else {
        await createSectionMutation.mutateAsync({
          payload: {
            restaurantPublicId: publicId,
            menuPublicId,
            title: value.title,
            description: value.description,
            position: sections.length + 1,
          },
        }, {
          onSuccess: () => {
            queryClient.invalidateQueries(trpc.section.getByMenuPublicId.queryFilter({ menuPublicId }))
            sectionDrawer.close(id)
          },
        })
      }
    },
  })

  return (
    <Drawer.Root {...rest}>
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content asChild>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Title>
                { section?.id
                  ? 'Edit Section'
                  : 'Add Section' }
              </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <VStack gap={4}>
                <form.Field
                  name="title"
                  children={field => (
                    <Field.Root invalid={!!field.state.meta.errors.length} required>
                      <Field.Label>
                        Title
                        <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        type="text"
                        name={field.name}
                        defaultValue={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                      />
                      <Field.ErrorText>{field.state.meta.errors?.[0]}</Field.ErrorText>
                    </Field.Root>
                  )}
                />
                <form.Field
                  name="description"
                  children={field => (
                    <Field.Root invalid={!!field.state.meta.errors.length}>
                      <Field.Label>
                        Description
                      </Field.Label>
                      <Textarea
                        name={field.name}
                        defaultValue={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                        rows={4}
                      />
                      <Field.ErrorText>{field.state.meta.errors?.[0]}</Field.ErrorText>
                    </Field.Root>
                  )}
                />
              </VStack>
            </Drawer.Body>
            <Drawer.Footer>
              <Button onClick={() => sectionDrawer.close(id)} variant="outline">Cancel</Button>
              <form.Subscribe
                selector={state => ({ isSubmitting: state.isSubmitting })}
                children={({ isSubmitting }) => (
                  <Button
                    type="submit"
                    loading={isSubmitting}
                  >
                    Save
                  </Button>
                )}
              />
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </form>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  )
})

interface MenuItemDrawerProps {
  id: string
  menuItem?: {
    id: number
    title: string | null
    description: string | null
    price: number | null
    image?: {
      id: number
      url: string | null
      width: number | null
      height: number | null
    } | null
  }
  sectionId?: number
}

const menuItemDrawer = createOverlay<MenuItemDrawerProps>(({ id, menuItem, sectionId, ...rest }) => {
  const { menuPublicId } = Route.useParams()
  const updateMenuItemMutation = useMutation(trpc.menuItem.update.mutationOptions())
  const createMenuItemMutation = useMutation(trpc.menuItem.create.mutationOptions())
  const queryClient = useQueryClient()
  const { menuItems } = Route.useLoaderData()
  const itemsInSection = menuItems.filter(item => item.sectionId === sectionId)

  const { publicId } = Route.useParams()

  const form = useForm({
    defaultValues: {
      title: menuItem?.title || '',
      description: menuItem?.description || '',
      price: menuItem?.price ? menuItem.price / 100 : undefined,
      image: menuItem?.image?.url || '',
      pendingImage: undefined as File | undefined,
    },
    onSubmit: async ({ value }) => {
      let newImage
      if (value.pendingImage) {
        const formData = new FormData()
        formData.append('file', value.pendingImage)
        newImage = await uploadFile({ data: formData })
      }
      if (menuItem) {
        await updateMenuItemMutation.mutateAsync({
          id: menuItem.id,
          payload: {
            title: value.title,
            description: value.description,
            price: value.price ? Number(value.price) * 100 : null,
            image: newImage
              ? {
                  ...newImage,
                  menuItemId: menuItem.id,
                }
              : undefined,
          },
        }, {
          onSuccess: () => {
            queryClient.invalidateQueries()
            menuItemDrawer.close(id)
          },
        })
      }
      else {
        await createMenuItemMutation.mutateAsync({
          payload: {
            menuPublicId,
            sectionId,
            position: itemsInSection.length + 1,
            restaurantId: publicId,
            title: value.title,
            description: value.description,
            price: value.price ? Number(value.price) * 100 : null,
            image: newImage,
          },
        }, {
          onSuccess: () => {
            queryClient.invalidateQueries()
            menuItemDrawer.close(id)
          },
        })
      }
    },
  })

  return (
    <Drawer.Root {...rest}>
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content asChild>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              e.stopPropagation()
              form.handleSubmit()
            }}
          >
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Title>
                { menuItem ? 'Edit Menu Item' : 'Create Menu Item' }
              </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <VStack gap={4}>
                <Box w="full">
                  <form.Subscribe
                    selector={state => ({
                      image: state.values.image,
                    })}
                    children={({ image }) =>
                      <AspectRatio ratio={16 / 9} w="full">
                        {image
                          ? (
                            <Box
                              // position="relative"
                              rounded="md"
                              borderColor="gray.200"
                              borderWidth={1}
                              overflow="hidden"
                              width="full"
                              height="full"
                            >
                              <Image
                                src={image || ''}
                                width="full"
                                height="full"
                                objectFit="cover"
                                borderRadius="md"
                              />
                              <Float placement="top-end" offset={6}>
                                <IconButton
                                  aria-label="Remove file"
                                  variant="subtle"
                                  size="sm"
                                  colorScheme="red"
                                  onClick={() => {
                                    form.setFieldValue('image', '')
                                  }}
                                >
                                  <IconClose />
                                </IconButton>
                              </Float>
                            </Box>
                          )
                          : (
                            <form.Field
                              name="pendingImage"
                              children={field => (
                                <FileUpload.Root
                                  maxW="xl"
                                  alignItems="stretch"
                                  maxFiles={1}
                                  accept={['image/*']}
                                  onFileAccept={async ({ files }) => {
                                    // Handle file accept logic here
                                    const resized = await resizeImage(files[0])
                                    field.handleChange(resized)
                                  }}
                                >
                                  <FileUpload.HiddenInput />
                                  {field.state.value
                                    ? (
                                      <FileUploadPreview />
                                    )
                                    : (
                                      <FileUpload.Dropzone minH="0" width="full" aspectRatio={16/9}>
                                        <Icon size="md" color="fg.muted">
                                          <IconUpload />
                                        </Icon>
                                        <FileUpload.DropzoneContent>
                                          <Box>Drag and drop files here</Box>
                                          <Box color="fg.muted">.png, .jpg up to 5MB</Box>
                                        </FileUpload.DropzoneContent>
                                      </FileUpload.Dropzone>
                                    )}
                                  {/* <FileUpload.List /> */}
                                </FileUpload.Root>
                              )}
                            />
                          )}
                      </AspectRatio>
                    }
                  />
                </Box>

                <form.Field
                  name="title"
                  children={field => (
                    <Field.Root invalid={!!field.state.meta.errors.length} required>
                      <Field.Label>
                        Title
                        <Field.RequiredIndicator />
                      </Field.Label>
                      <Input
                        type="text"
                        name={field.name}
                        defaultValue={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                      />
                      <Field.ErrorText>{field.state.meta.errors?.[0]}</Field.ErrorText>
                    </Field.Root>
                  )}
                />
                <form.Field
                  name="description"
                  children={field => (
                    <Field.Root invalid={!!field.state.meta.errors.length}>
                      <Field.Label>
                        Description
                      </Field.Label>
                      <Textarea
                        name={field.name}
                        defaultValue={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                        rows={4}
                      />
                      <Field.ErrorText>{field.state.meta.errors?.[0]}</Field.ErrorText>
                    </Field.Root>
                  )}
                />
                <form.Field
                  name="price"
                  children={field => (
                    <Field.Root invalid={!!field.state.meta.errors.length}>
                      <Field.Label>
                        Price
                      </Field.Label>
                      <NumberInput.Root
                        w="full"
                        pattern=".*"
                        step={0.01}
                        min={0}
                        defaultValue={String(field.state.value)}
                        onValueChange={(e) => {
                          field.handleChange(e.valueAsNumber)
                        }}
                        invalid={!!field.state.meta.errors.length}
                        formatOptions={{
                          style: 'currency',
                          currency: 'USD',
                        }}
                      >
                        <NumberInput.Control />
                        <NumberInput.Input />
                      </NumberInput.Root>
                      <Field.ErrorText>{field.state.meta.errors?.[0]}</Field.ErrorText>
                    </Field.Root>
                  )}
                />

              </VStack>
            </Drawer.Body>
            <Drawer.Footer>
              <Button onClick={() => menuItemDrawer.close(id)} variant="outline">
                Cancel
              </Button>
              <form.Subscribe
                selector={state => ({ isSubmitting: state.isSubmitting })}
                children={({ isSubmitting }) => (
                  <Button
                    type="submit"
                    loading={isSubmitting}
                  >
                    Save
                  </Button>
                )}
              />
            </Drawer.Footer>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </form>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  )
})

function FileUploadPreview() {
  const fileUpload = useFileUploadContext()
  const files = fileUpload.acceptedFiles

  if (files.length === 0) {
    return null
  }

  const file = files[0]
  return (
    <FileUpload.ItemGroup>

      <FileUpload.Item
        w="full"
        h="auto"
        file={file}
        p={0}
        overflow="hidden"
        rounded="md"
      >
        <FileUpload.ItemPreviewImage
          aspectRatio={16 / 9}
          objectFit="cover"
        />
        <Float placement="top-end" offset={6}>
          <IconButton
            aria-label="Remove file"
            variant="subtle"
            size="sm"
            colorScheme="red"
            asChild
          >
            <FileUpload.ItemDeleteTrigger>
              <IconClose />
            </FileUpload.ItemDeleteTrigger>
          </IconButton>
        </Float>
      </FileUpload.Item>
    </FileUpload.ItemGroup>
  )
}
