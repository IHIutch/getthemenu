import * as React from 'react'

import { formatDate, getErrorMessage, reorderList } from '@/utils/functions'
import { useGetRestaurant } from '@/utils/react-query/restaurants'
import { zodResolver } from '@hookform/resolvers/zod'
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
  Container,
  FormErrorMessage,
  Grid,
  GridItem,
  Alert,
  Spinner,
  FormHelperText,
  AlertIcon,
  Icon,
  InputGroup,
  InputLeftAddon,
} from '@chakra-ui/react'
import Head from 'next/head'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import DashboardLayout from '@/layouts/Dashboard'
import { SubmitHandler, useForm } from 'react-hook-form'
import { slug as slugify } from 'github-slugger'
import { GripHorizontal } from 'lucide-react'
import { Draggable, DropResult } from 'react-beautiful-dnd'
import { Droppable } from 'react-beautiful-dnd'
import { DragDropContext } from 'react-beautiful-dnd'
import { MenuSchema } from '@/utils/zod'
import { z } from 'zod'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { createClientServer } from '@/utils/supabase/server-props'
import { trpc } from '@/utils/trpc/client'
import { appRouter } from '@/server'
import SuperJSON from 'superjson'
import { createServerSideHelpers } from '@trpc/react-query/server';
import { useGetMenus, useReorderMenus } from '@/utils/react-query/menus'


type SlugMessage = {
  type: 'success' | 'error',
  message: string
} | null

const FormPayload = MenuSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})

type FormData = z.infer<typeof FormPayload>

export default function Dashboard({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const modalState = useDisclosure()
  const [isCheckingSlug, setIsCheckingSlug] = React.useState(false)
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

  const { data: restaurant } = useGetRestaurant(user?.restaurants[0]?.id)
  const { data: menus = [] } = useGetMenus(user?.restaurants[0]?.id)
  const { mutateAsync: handleReorderMenus } = useReorderMenus(user?.restaurants[0]?.id || '')
  const { mutateAsync: handleCreateMenu, isPending } = trpc.menu.create.useMutation()

  const onSubmit: SubmitHandler<FormData> = async (form) => {
    try {
      const data = await handleCreateMenu({
        payload: {
          ...form,
          restaurantId: restaurant?.id || '',
        }
      }, {
        onSuccess() {
          router.push(`/menu/${data.id}/edit`)
        },
        onError(error) {
          throw new Error(getErrorMessage(error))
        },
      })
    } catch (error) {
      alert(getErrorMessage(error))
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

  const checkUniqueSlug = () => {
    const slug = getValues('slug')
    const testSlug = slugify(slug || '', false)
    if (!slug) {
      setSlugMessage(null)
    } else if (testSlug !== slug) {
      setSlugMessage({
        type: 'error',
        message: `Your slug is not valid. Please use only lowercase letters, numbers, and dashes.`,
      })
    } else {
      const isUsed = menus.some(m => m.slug === slug)
      if (isUsed) {
        setSlugMessage({
          type: 'error',
          message: `'${slug}' is already used.`,
        })
      } else {
        setSlugMessage({
          type: 'success',
          message: `'${slug}' is available.`,
        })
      }
    }
  }

  const handleDragStart = () => {
    if (navigator.vibrate) {
      navigator.vibrate(75)
    }
  }

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result
    if (!destination) return // dropped outside the list

    const reorderedMenus = reorderList(
      menus,
      source.index,
      destination.index
    )

    handleReorderMenus({
      payload: reorderedMenus.map((menu, idx) => ({
        id: Number(menu.id),
        position: idx,
      }))
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
          {menus.length > 0 ? (
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
                  {(drop) => (
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
                                          Published:{' '}
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
          ) : (
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
      <Modal isOpen={modalState.isOpen} onClose={modalState.onClose}>
        <ModalOverlay />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalContent>
            <ModalHeader>Create a New Menu</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid w="100%" gap="4">
                <GridItem>
                  <FormControl id="title" isInvalid={!!errors.title}>
                    <FormLabel>Menu Title</FormLabel>
                    <Input
                      {...register('title', {
                        required: 'This field is required',
                        onBlur: handleSetSlug
                      })}
                      type="text"
                      autoComplete="off"
                    />
                    <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                  </FormControl>
                </GridItem>
                <GridItem>
                  <FormControl id="slug" isInvalid={!!errors.title}>
                    <FormLabel>Menu Slug</FormLabel>
                    <InputGroup>
                      {(restaurant?.customHost || restaurant?.customDomain) && (
                        <InputLeftAddon>
                          {restaurant?.customHost
                            ? `${restaurant.customHost}.getthemenu.io/`
                            : `${restaurant.customDomain}/`}
                        </InputLeftAddon>
                      )}
                      <Input
                        {...register('slug', {
                          required: 'This field is required',
                          onChange: checkUniqueSlug
                        })}
                        type="text"
                        autoComplete="off"
                      />
                    </InputGroup>
                    <FormErrorMessage>{errors.slug?.message}</FormErrorMessage>
                    {isCheckingSlug ? (
                      <Alert status="info" mt="2">
                        <Spinner size="sm" />
                        <Text ml="2">Checking availability...</Text>
                      </Alert>
                    ) : !isCheckingSlug && slugMessage ? (
                      <Alert size="sm" status={slugMessage.type} mt="2">
                        <AlertIcon />
                        <Text ml="2">{slugMessage.message}</Text>
                      </Alert>
                    ) : null}
                    <FormHelperText>
                      Must be unique to your restaurant.
                    </FormHelperText>
                  </FormControl>
                </GridItem>
              </Grid>
            </ModalBody>
            <ModalFooter>
              <ButtonGroup>
                <Button onClick={modalState.onClose}>Cancel</Button>
                <Button
                  type="submit"
                  isLoading={isPending}
                  loadingText="Creating..."
                  colorScheme="blue"
                  isDisabled={slugMessage?.type === 'error'}
                >
                  Create
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}

Dashboard.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClientServer(context)
  const { data } = await supabase.auth.getUser()

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      session: {
        user: data.user
      }
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
