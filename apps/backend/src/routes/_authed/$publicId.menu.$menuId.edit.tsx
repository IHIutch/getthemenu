import { Box, Button, CloseButton, createOverlay, Drawer, Field, FileUpload, Flex, Float, FormatNumber, Heading, Icon, IconButton, Image, Input, NumberInput, Square, Stack, Text, Textarea, useFileUploadContext, VStack } from '@chakra-ui/react'
import { prisma } from '@repo/db'
import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import mime from 'mime'
import { getPlaiceholder } from 'plaiceholder'
import * as React from 'react'
import { v4 as uuidv4 } from 'uuid'
import * as z from 'zod/v4'
import IconAddAPhoto from '~icons/material-symbols/add-a-photo'
import IconMoreVert from '~icons/material-symbols/more-vert'
import IconUpload from '~icons/material-symbols/upload'

import { trpc } from '~/router'
import getSupabaseServerClient from '~/utils/supabase/server'

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
      },
      include: {
        sections: {
          orderBy: {
            position: 'asc',
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
            },
          },
          orderBy: {
            position: 'asc',
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

export const Route = createFileRoute('/_authed/$publicId/menu/$menuId/edit')({
  loader: async ({
    params: { menuId },
  }) => {
    const data = await fetchMenuData({ data: menuId })
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
                  menuPublicId: menu.publicId,
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
    <VStack gap={8} w="full" py={4}>
      {sectionsWithItems.map(section => (
        <Box key={section.id} w="full">
          <Flex mb={4}>
            <Box>
              { section.title
                ? <Heading>{section.title}</Heading>
                : <Heading fontStyle="italic" color="gray.500">Untitled Section</Heading>}
              { section.description
                ? <Text>{section.description}</Text>
                : <Text fontStyle="italic" color="gray.500">No description</Text>}
            </Box>
            <Box ml="auto">
              <SectionDrawer section={section} menuPublicId={menu.publicId} />
            </Box>
          </Flex>
          <Box>
            {section.menuItems.map(item => (
              <Flex key={item.id} borderWidth={1} borderColor="gray.200" borderRadius="md" p={4} mb={4} bg="white" shadow="sm" gap={4}>
                <Flex flex="1" gap={4}>
                  {item.image[0]
                    ? (
                        <Image
                          src={item.image[0].url}
                          width={16}
                          height={16}
                          objectFit="cover"
                          borderRadius="md"
                        />
                      )
                    : null}
                  <Stack direction="row" gap={4}>
                    <Box>
                      {item.image[0]?.url
                        ? (
                            <Image
                              src={item.image[0]?.url || ''}
                              width={16}
                              height={16}
                              objectFit="cover"
                              borderRadius="md"
                              alt={item.title || 'Menu Item Image'}
                            // fallbackSrc="https://via.placeholder.com/64"
                            />
                          )
                        : (
                            <Square size={16} bg="gray.100" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                              <Icon size="md" color="fg.muted">
                                <IconAddAPhoto />
                              </Icon>
                            </Square>
                          )}
                    </Box>
                    <Box>
                      <Heading>{item.title}</Heading>
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
                      {item.description
                        ? <Text>{item.description}</Text>
                        : <Text fontStyle="italic" color="gray.500">No description</Text>}
                    </Box>
                  </Stack>
                </Flex>
                <IconButton
                  aria-label="Edit menu item"
                  variant="subtle"
                  size="sm"
                  onClick={() => {
                    menuItemDrawer.open(item.id.toString(), {
                      id: item.id.toString(),
                      menuPublicId: menu.publicId,
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
                {/* <MenuItemDrawer
                  menuItem={{
                    ...item,
                    image: item.image[0],
                  }}
                  menuId={menu.id}
                  isOpen={isOpen}
                  onOpenChange={onOpenChange}
                /> */}
              </Flex>
            ))}
          </Box>
        </Box>
      ))}
    </VStack>
  )
}

function SectionDrawer({ section, menuPublicId }: {
  section: {
    id: number
    title: string | null
    description: string | null
  }
  menuPublicId: string
}) {
  const [open, setOpen] = React.useState(false)
  const updateSectionMutation = useMutation(trpc.section.update.mutationOptions())
  const queryClient = useQueryClient()

  const form = useForm({
    defaultValues: {
      title: section.title || '',
      description: section.description || '',
    },
    onSubmit: async ({ value }) => {
      await updateSectionMutation.mutateAsync({
        id: section.id,
        data: {
          title: value.title,
          description: value.description,
        },
      }, {
        onSuccess: () => {
          queryClient.invalidateQueries(trpc.section.getByMenuPublicId.queryFilter({ menuPublicId }))
          setOpen(false)
        },
      })
    },
  })

  return (
    <Drawer.Root open={open} onOpenChange={e => setOpen(e.open)}>
      <Drawer.Backdrop />
      <Drawer.Trigger asChild>
        <IconButton aria-label="Edit section" variant="subtle" size="sm">
          <Icon size="lg">
            <IconMoreVert />
          </Icon>
        </IconButton>
      </Drawer.Trigger>
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
              <Drawer.Title>Edit Section</Drawer.Title>
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
                {/* Section edit form goes here */}
              </VStack>
            </Drawer.Body>
            <Drawer.Footer>
              <Button onClick={() => setOpen(false)} variant="outline">Cancel</Button>
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
}

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
  menuPublicId: string
  // isOpen: boolean
  // onOpenChange: (open: boolean) => void
}

const menuItemDrawer = createOverlay<MenuItemDrawerProps>(({ id, menuPublicId, menuItem, ...rest }) => {
  const updateMenuItemMutation = useMutation(trpc.menuItem.update.mutationOptions())
  const createMenuItemMutation = useMutation(trpc.menuItem.create.mutationOptions())
  const queryClient = useQueryClient()

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
            price: value.price ? Number(value.price) * 100 : undefined,
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
            sectionId: 0, // Default to 0 or handle as needed
            position: 0, // Default to 0 or handle as needed
            restaurantId: publicId,
            title: value.title,
            description: value.description,
            price: value.price ? Number(value.price) * 100 : undefined,
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
                <form.Field
                  name="pendingImage"
                  children={field => (
                    <FileUpload.Root
                      maxW="xl"
                      alignItems="stretch"
                      maxFiles={1}
                      defaultValue={field.state.value?.toString() || []}
                      onFileAccept={({ files }) => {
                        // Handle file accept logic here
                        field.handleChange(files[0])
                        console.log('Files accepted:', files[0])
                      }}
                    >
                      <FileUpload.HiddenInput />
                      <FileUpload.Dropzone minH={0} aspectRatio={16 / 9}>
                        <Icon size="md" color="fg.muted">
                          <IconUpload />
                        </Icon>
                        <FileUpload.DropzoneContent>
                          <Box>Drag and drop files here</Box>
                          <Box color="fg.muted">.png, .jpg up to 5MB</Box>
                        </FileUpload.DropzoneContent>
                      </FileUpload.Dropzone>
                      <FileUploadPreview />
                      {/* <FileUpload.List /> */}
                    </FileUpload.Root>
                  )}
                />
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
        w="auto"
        boxSize="20"
        p="2"
        file={file}
      >
        <FileUpload.ItemPreviewImage />
        <Float placement="top-end">
          <FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid">
            {/* <LuX /> */}
          </FileUpload.ItemDeleteTrigger>
        </Float>
      </FileUpload.Item>
    </FileUpload.ItemGroup>
  )
}
