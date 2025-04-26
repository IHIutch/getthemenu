import type { RouterOutputs } from '@/server'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import type { SubmitHandler } from 'react-hook-form'
import MenuLayout from '@/layouts/Menu'
import { appRouter } from '@/server'
import { getErrorMessage } from '@/utils/functions'
import { useDeleteMenu, useGetMenu, useGetMenus, useUpdateMenu } from '@/utils/react-query/menus'
import { useGetRestaurant } from '@/utils/react-query/restaurants'
import { useGetAuthedUser } from '@/utils/react-query/users'
import { createClientServer } from '@/utils/supabase/server-props'
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Container,
  Dialog,
  Field,
  Flex,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { createServerSideHelpers } from '@trpc/react-query/server'
import { slug as slugify } from 'github-slugger'
import Head from 'next/head'
import { useRouter } from 'next/router'
import * as React from 'react'
import { useForm, useFormState } from 'react-hook-form'
import SuperJSON from 'superjson'

export default function MenuOverview({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const menuId = router.query?.menuId?.toString() ?? ''

  useGetAuthedUser({ initialData: user })
  const { data: restaurant } = useGetRestaurant(user?.restaurants[0]?.id)
  const { data: menu } = useGetMenu(Number(menuId))
  const { data: menus = [] } = useGetMenus(user?.restaurants[0]?.id)

  return (
    <>
      <Head>
        <title>Single Menu</title>
      </Head>
      <Container maxW="container.md">
        <Stack gap="6">
          <Box bg="white" rounded="md" shadow="base">
            {(menu && restaurant)
              ? <DetailsSection menu={menu} restaurant={restaurant} menus={menus} />
              : null}
          </Box>
          <Box bg="white" rounded="md" shadow="base">
            {menu ? <DeleteSection menu={menu} /> : null}
          </Box>
        </Stack>
      </Container>
    </>
  )
}

type SlugMessageType = {
  type: 'success' | 'error'
  message: string
} | null

interface FormData {
  title: string
  slug: string
}

function DetailsSection({
  menu,
  restaurant,
  menus,
}: {
  menu: RouterOutputs['menu']['getById']
  restaurant: RouterOutputs['restaurant']['getById']
  menus: RouterOutputs['menu']['getAllByRestaurantId']
}) {
  const [isCheckingSlug, _setIsCheckingSlug] = React.useState(false)
  const [slugMessage, setSlugMessage] = React.useState<SlugMessageType>(null)

  const { mutateAsync: handleUpdateMenu, isPending }
    = useUpdateMenu(menu.id)

  const defaultValues = {
    title: menu?.title || '',
    slug: menu?.slug || '',
  }

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({ defaultValues })

  const { isDirty } = useFormState({
    control,
  })

  const checkUniqueSlug = () => {
    const slug = getValues('slug')
    const testSlug = slugify(slug || '', false)
    if (!slug || slug === menu.slug) {
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

  const onSubmit: SubmitHandler<FormData> = async (form) => {
    try {
      const payload = {
        title: form.title || '',
        slug: slugify(form.slug || '', false),
      }
      await handleUpdateMenu({
        where: {
          id: Number(menu.id),
        },
        payload,
      })
    }
    catch (error) {
      alert(getErrorMessage(error))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box p="6">
        <Grid w="100%" gap="4">
          <GridItem>
            <Field.Root id="title">
              <Field.Label>Menu Title</Field.Label>
              <Input
                {...register('title', {
                  required: 'This field is required',
                  onBlur: handleSetSlug,
                })}
                type="text"
                autoComplete="off"
              />
            </Field.Root>
          </GridItem>
          <GridItem>
            <Field.Root id="slug">
              <Field.Label>Menu Slug</Field.Label>
              <InputGroup endElement={(restaurant?.customHost || restaurant?.customDomain) && (
                restaurant?.customHost
                  ? `${restaurant.customHost}.getthemenu.io/`
                  : `${restaurant.customDomain}/`
              )}
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
      </Box>
      <Flex px="6" py="3" borderTopWidth="1px">
        <ButtonGroup ml="auto">
          <Button
            onClick={() => {
              reset(defaultValues)
            }}
            disabled={!isDirty}
          >
            Reset
          </Button>
          <Button
            colorScheme="blue"
            type="submit"
            disabled={
              !isDirty || slugMessage?.type === 'error'
            }
            loading={isPending}
            loadingText="Saving..."
          >
            Save
          </Button>
        </ButtonGroup>
      </Flex>
    </form>
  )
}

function DeleteSection({ menu }: { menu: RouterOutputs['menu']['getById'] }) {
  const router = useRouter()

  const dialogState = useDisclosure()
  const leastDestructiveRef = React.useRef<HTMLButtonElement>(null)

  const { mutateAsync: handleDeleteMenu, isPending, isSuccess } = useDeleteMenu()

  if (isSuccess) {
    router.replace('/dashboard')
  }

  return (
    <>
      <Box p="6" borderBottomWidth="1px">
        <Heading as="h2" fontSize="xl" fontWeight="semibold">
          Danger Zone
        </Heading>
      </Box>
      <Box p="6">
        <Box
          bg="red.100"
          rounded="md"
          borderColor="red.200"
          borderWidth="1px"
          p="4"
        >
          <Heading as="h3" fontSize="lg" mb="1" fontWeight="semibold">
            Delete Menu
          </Heading>
          <Text mb="4">
            Your menu will no longer be visible to your visitors and will
            permanently delete all of it&apos;s contents. Please be careful
            before proceeding.
          </Text>
          <Button colorScheme="red" onClick={dialogState.onOpen}>
            Delete
          </Button>
        </Box>
      </Box>
      <Dialog.Root
        open={dialogState.open}
        onOpenChange={e => dialogState.setOpen(e.open)}
        initialFocusEl={() => leastDestructiveRef.current}
      >
        <Dialog.Backdrop />
        <Dialog.Content>
          <Dialog.Header fontSize="lg" fontWeight="bold">
            Delete Menu
          </Dialog.Header>

          <Dialog.Body>
            <Text mb="4">Are you sure you want to delete this menu?</Text>
            <Text>This action is permanent and cannot be undone.</Text>
          </Dialog.Body>

          <Dialog.Footer>
            <ButtonGroup>
              <Button ref={leastDestructiveRef} onClick={dialogState.onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => handleDeleteMenu({ where: { id: menu.id } })}
                loading={isPending}
              >
                Delete
              </Button>
            </ButtonGroup>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </>
  )
}

MenuOverview.getLayout = (page: React.ReactNode) => <MenuLayout>{page}</MenuLayout>

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClientServer(context)
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
