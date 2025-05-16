import type { GetServerSidePropsContext } from 'next'
import type { DropResult } from 'react-beautiful-dnd'
import type { SubmitHandler } from 'react-hook-form'
import type { z } from 'zod'

import DashboardLayout from '@/layouts/Dashboard'
import { formatDate, getErrorMessage, reorderList } from '@/utils/functions'
import { useReorderMenus } from '@/utils/react-query/menus'
import { getSupabaseServerClient } from '@/utils/supabase/server-props'
import { trpc } from '@/utils/trpc'
import { MenuSchema } from '@/utils/zod'
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Center,
  Circle,
  Container,
  Dialog,
  Field,
  Flex,
  Grid,
  GridItem,
  Heading,
  Icon,
  Input,
  InputGroup,
  LinkBox,
  LinkOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { slug as slugify } from 'github-slugger'
import { GripHorizontal } from 'lucide-react'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useForm } from 'react-hook-form'

type SlugMessage = {
  type: 'success' | 'error'
  message: string
} | null

const FormPayload = MenuSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})

type FormData = z.infer<typeof FormPayload>

export default function Dashboard() {
  const router = useRouter()
  const modalState = useDisclosure()
  const [isCheckingSlug, _setIsCheckingSlug] = React.useState(false)
  const [slugMessage, setSlugMessage] = React.useState<SlugMessage>(null)

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormPayload),
  })

  const { data: user } = trpc.user.getAuthedUser.useQuery(undefined, {
    refetchOnMount: false,
  })

  const { data: restaurant } = trpc.restaurant.getById.useQuery({
    where: {
      id: user?.restaurants[0]?.id || '',
    },
  }, {
    refetchOnMount: false,
    enabled: !!user?.restaurants[0]?.id,
  })

  const { data: menus = [] } = trpc.menu.getAllByRestaurantId.useQuery({
    where: {
      restaurantId: user?.restaurants[0]?.id || '',
    },
  }, {
    refetchOnMount: false,
    enabled: !!user?.restaurants[0]?.id,
  })

  const { mutateAsync: handleReorderMenus } = useReorderMenus(user?.restaurants[0]?.id || '')
  const { mutateAsync: handleCreateMenu, isPending } = trpc.menu.create.useMutation()

  const onSubmit: SubmitHandler<FormData> = async (form) => {
    try {
      const data = await handleCreateMenu({
        payload: {
          ...form,
          restaurantId: restaurant?.id || '',
        },
      }, {
        onSuccess() {
          router.push(`/menu/${data.id}/edit`)
        },
        onError(error) {
          throw new Error(getErrorMessage(error))
        },
      })
    }
    catch (error) {
      alert(getErrorMessage(error))
    }
  }

  const checkUniqueSlug = () => {
    const slug = getValues('slug')
    const testSlug = slugify(slug || '', false)
    if (!slug) {
      setSlugMessage(null)
    }
    else if (testSlug !== slug) {
      setSlugMessage({
        type: 'error',
        message: `Your slug is not valid. Please use only lowercase letters, numbers, and dashes.`,
      })
    }
    else {
      const isUsed = menus.some(m => m.slug === slug)
      if (isUsed) {
        setSlugMessage({
          type: 'error',
          message: `'${slug}' is already used.`,
        })
      }
      else {
        setSlugMessage({
          type: 'success',
          message: `'${slug}' is available.`,
        })
      }
    }
  }

  const handleSetSlug = async () => {
    const [title, slug] = getValues(['title', 'slug'])
    if (title && !slug) {
      const newSlug = slugify(title, false)
      setValue('slug', newSlug, { shouldValidate: true, shouldDirty: true })
      checkUniqueSlug()
    }
  }

  const handleDragStart = () => {
    if (navigator.vibrate) {
      navigator.vibrate(75)
    }
  }

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination)
      return // dropped outside the list

    const reorderedMenus = reorderList(
      menus,
      source.index,
      destination.index,
    )

    handleReorderMenus({
      payload: reorderedMenus.map((menu, idx) => ({
        id: Number(menu.id),
        position: idx,
      })),
    })
  }
  const sortedMenus = React.useMemo(() => {
    return menus ? menus.sort((a, b) => (a.position || 0) - (b.position || 0)) : []
  }, [menus])

  return (
    <>
      <Head>
        <title>Single Menu</title>
      </Head>
      <Container maxW="container.md">
        <Box>
          <Flex mb="2" align="center">
            <Heading fontSize="xl">Your Menus</Heading>
            <Box ml="auto">
              <Button colorScheme="blue" onClick={modalState.onOpen}>
                Create a Menu
              </Button>
            </Box>
          </Flex>
          {menus.length > 0
            ? (
              <>
                <Box mb="4">
                  <Text fontSize="sm" color="gray.700">
                    Your first ordered menu will automatically be set as your
                    homepage.
                  </Text>
                </Box>
                <DragDropContext
                  onDragEnd={handleDragEnd}
                  onDragStart={handleDragStart}
                >
                  <Droppable droppableId="menuWrapper">
                    {drop => (
                      <Stack ref={drop.innerRef} {...drop.droppableProps}>
                        {sortedMenus.map((menu, idx) => (
                          <Draggable
                            draggableId={`${menu.id}`}
                            key={`${menu.id}`}
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
                                  <LinkBox>
                                    <Box>
                                      <Box pb="3" px="3" borderBottomWidth="1px">
                                        <LinkOverlay as={NextLink} href={`/menu/${menu.id}`}>
                                          <Heading
                                            ml="2"
                                            fontSize="2xl"
                                            fontWeight="semibold"
                                          >
                                            {menu.title}
                                          </Heading>
                                        </LinkOverlay>
                                      </Box>
                                      <Flex p="3" justify="space-between">
                                        <Flex align="center">
                                          <Circle size={4} bg="green.100">
                                            <Circle size={2} bg="green.500" />
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
                                            Published:
                                            {' '}
                                            {formatDate(menu.createdAt)}
                                          </Text>
                                        </Box>
                                      </Flex>
                                    </Box>
                                  </LinkBox>
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
              </>
            )
            : (
              <Center
                borderWidth="2px"
                borderColor="gray.200"
                bg="gray.100"
                py="8"
                px="4"
                rounded="lg"
              >
                <Text fontSize="xl" fontWeight="medium" color="gray.600">
                  Get started by creating your first menu.
                </Text>
              </Center>
            )}
        </Box>
      </Container>
      <Dialog.Root open={modalState.open} onOpenChange={e => modalState.setOpen(e.open)}>
        <Dialog.Backdrop />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Dialog.Content>
            <Dialog.Header>Create a New Menu</Dialog.Header>
            <Dialog.CloseTrigger />
            <Dialog.Body>
              <Grid w="100%" gap="4">
                <GridItem>
                  <Field.Root id="title" invalid={!!errors.title}>
                    <Field.Label>Menu Title</Field.Label>
                    <Input
                      {...register('title', {
                        required: 'This field is required',
                        onBlur: handleSetSlug,
                      })}
                      type="text"
                      autoComplete="off"
                    />
                    <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                  </Field.Root>
                </GridItem>
                <GridItem>
                  <Field.Root id="slug" invalid={!!errors.title}>
                    <Field.Label>Menu Slug</Field.Label>
                    <InputGroup startElement={
                      (restaurant?.customHost || restaurant?.customDomain)
                      && (restaurant?.customHost
                        ? `${restaurant.customHost}.getthemenu.io/`
                        : `${restaurant?.customDomain}/`)
                    }
                    >
                      <Input
                        {...register('slug', {
                          required: 'This field is required',
                          onChange: checkUniqueSlug,
                        })}
                        type="text"
                        autoComplete="off"
                      />
                    </InputGroup>
                    <Field.ErrorText>{errors.slug?.message}</Field.ErrorText>
                    {isCheckingSlug
                      ? (
                        <Alert.Root status="info" mt="2">
                          <Alert.Indicator>
                            <Spinner size="sm" />
                          </Alert.Indicator>
                          <Alert.Description ml="2">Checking availability...</Alert.Description>
                        </Alert.Root>
                      )
                      : !isCheckingSlug && slugMessage
                        ? (
                          <Alert.Root size="sm" status={slugMessage.type} mt="2">
                            <Alert.Indicator />
                            <Alert.Description ml="2">{slugMessage.message}</Alert.Description>
                          </Alert.Root>
                        )
                        : null}
                    <Field.HelperText>
                      Must be unique to your restaurant.
                    </Field.HelperText>
                  </Field.Root>
                </GridItem>
              </Grid>
            </Dialog.Body>
            <Dialog.Footer>
              <ButtonGroup>
                <Button onClick={modalState.onClose}>Cancel</Button>
                <Button
                  type="submit"
                  loading={isPending}
                  loadingText="Creating..."
                  colorScheme="blue"
                  disabled={slugMessage?.type === 'error'}
                >
                  Create
                </Button>
              </ButtonGroup>
            </Dialog.Footer>
          </Dialog.Content>
        </form>
      </Dialog.Root>
    </>
  )
}

Dashboard.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = getSupabaseServerClient(context)
  const { data } = await supabase.auth.getUser()

  if (!data.user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  // const helpers = await getServerSideHelpers({
  //   user: data.user,
  // })

  // const user = await helpers.user.getAuthedUser.fetch()


  // if (!user?.restaurants[0]?.id) {
  //   return {
  //     redirect: {
  //       destination: '/onboarding/setup',
  //       permanent: false,
  //     },
  //   }
  // }

  // await Promise.all([
  //   helpers.restaurant.getById.prefetch({
  //     where: {
  //       id: user?.restaurants[0]?.id,
  //     },
  //   }),
  //   helpers.menu.getAllByRestaurantId.prefetch({
  //     where: {
  //       restaurantId: user?.restaurants[0]?.id,
  //     },
  //   }),
  // ])

  return {
    props: {
      // trpcState: helpers.dehydrate(),
    },
  }
}
