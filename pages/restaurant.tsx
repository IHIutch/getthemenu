import type { RouterOutputs } from '@/server'
import type { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import type {
  SubmitHandler,
} from 'react-hook-form'
import ImageDropzone from '@/components/common/ImageDropzone'
import DashboardLayout from '@/layouts/Dashboard'
import { appRouter } from '@/server'
import { postUpload } from '@/utils/axios/uploads'
import { getErrorMessage } from '@/utils/functions'
import {
  useGetRestaurant,
  useUpdateRestaurant,
} from '@/utils/react-query/restaurants'
import { useGetAuthedUser } from '@/utils/react-query/users'
import { createClientServer } from '@/utils/supabase/server-props'
import { DAYS_OF_WEEK } from '@/utils/zod'
import {
  AspectRatio,
  Box,
  Button,
  ButtonGroup,
  Container,
  Field,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  InputGroup,
  Stack,
  Switch,
  Text,
} from '@chakra-ui/react'
import { createServerSideHelpers } from '@trpc/react-query/server'
import Head from 'next/head'
import React, { useState } from 'react'
import {
  Controller,
  useFieldArray,
  useForm,
  useFormState,
} from 'react-hook-form'
import SuperJSON from 'superjson'

export default function Restaurant({ user }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useGetAuthedUser({ initialData: user })
  const { data: restaurant } = useGetRestaurant(user?.restaurants[0]?.id)

  return (
    <>
      <Head>
        <title>GetTheMenu</title>
      </Head>

      <Container maxW="container.md">
        <Stack gap="6">
          <Box bg="white" rounded="md" shadow="base">
            {restaurant
              ? <Details restaurant={restaurant} />
              : null}
          </Box>
          <Box bg="white" rounded="md" shadow="base">
            {restaurant
              ? <Contact restaurant={restaurant} />
              : null}
          </Box>
          <Box bg="white" rounded="md" shadow="base">
            {restaurant
              ? <Address restaurant={restaurant} />
              : null}
          </Box>
          <Box bg="white" rounded="md" shadow="base">
            {restaurant
              ? <Hours restaurant={restaurant} />
              : null}
          </Box>
        </Stack>
      </Container>
    </>
  )
}

Restaurant.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>

type CoverImageType = {
  type: 'old'
  src: string
  blurDataURL?: string
} | {
  type: 'new'
  file: File
  src?: string
}

function Details({ restaurant }: { restaurant: RouterOutputs['restaurant']['getById'] }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { mutateAsync: handleUpdateRestaurant } = useUpdateRestaurant(restaurant?.id)

  const defaultValues: {
    name: string | null
    customHost: string | null
    coverImage: CoverImageType
  } = {
    name: restaurant?.name,
    customHost: restaurant?.customHost,
    coverImage: {
      type: 'old',
      src: restaurant.coverImage?.src || '',
    },
  }

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<typeof defaultValues>({ defaultValues })
  const { isDirty } = useFormState({
    control,
  })

  const onSubmit: SubmitHandler<typeof defaultValues> = async (form) => {
    try {
      setIsSubmitting(true)

      let imageData
      if (form?.coverImage && form.coverImage.type === 'new') {
        const formData = new FormData()
        formData.append('file', form.coverImage.file, form.coverImage.file.name)
        const data = await postUpload(formData)

        imageData = {
          coverImage: data,
        }
      }

      const payload = {
        name: form.name,
        customHost: form.customHost,
        ...imageData,
      }

      await handleUpdateRestaurant({
        where: {
          id: restaurant.id,
        },
        payload,
      })
      setIsSubmitting(false)
    }
    catch (error) {
      setIsSubmitting(false)
      alert(getErrorMessage(error))
    }
  }

  return (
    <>
      <Box p="6" borderBottomWidth="1px">
        <Heading fontSize="xl" fontWeight="semibold">
          Details
        </Heading>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box p="6">
          <Grid w="100%" gap="4">
            <GridItem>
              <Field.Root invalid={!!errors.name}>
                <Field.Label>Name</Field.Label>
                <Input
                  {...register('name', {
                    required: 'This field is required',
                  })}
                  type="text"
                />
              </Field.Root>
            </GridItem>
            <GridItem>
              <Field.Root invalid={!!errors.customHost}>
                <Field.Label>Unique URL</Field.Label>
                <InputGroup endElement="getthemenu.com">
                  <Input
                    {...register('customHost', {
                      required: 'This field is required',
                    })}
                    type="text"
                    autoComplete="off"
                  />
                </InputGroup>
                <Field.ErrorText>
                  {errors.customHost?.message}
                </Field.ErrorText>
              </Field.Root>
            </GridItem>
            <GridItem>
              <Field.Root id="coverImage" invalid={!!errors.coverImage}>
                <Field.Label>Cover Image</Field.Label>
                <AspectRatio ratio={16 / 9} display="block">
                  <Controller
                    name="coverImage"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return <ImageDropzone onChange={val => onChange({ type: 'new', file: val })} value={value.src || ''} />
                    }}
                  />
                </AspectRatio>
                <Field.ErrorText>
                  {errors.coverImage?.message}
                </Field.ErrorText>
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
              disabled={!isDirty}
              loading={isSubmitting}
              loadingText="Saving..."
            >
              Save
            </Button>
          </ButtonGroup>
        </Flex>
      </form>
    </>
  )
}

function Address({ restaurant }: { restaurant: RouterOutputs['restaurant']['getById'] }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { mutateAsync: handleUpdateRestaurant } = useUpdateRestaurant(restaurant.id)

  const defaultValues = {
    streetAddress: restaurant?.address?.streetAddress || '',
    city: restaurant?.address?.city || '',
    state: restaurant?.address?.state || '',
    zip: restaurant?.address?.zip || '',
  }

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<typeof defaultValues>({
    defaultValues,
  })
  const { isDirty } = useFormState({
    control,
  })

  const onSubmit: SubmitHandler<typeof defaultValues> = async (form) => {
    try {
      setIsSubmitting(true)
      await handleUpdateRestaurant({
        where: {
          id: restaurant.id,
        },
        payload: {
          address: {
            streetAddress: form?.streetAddress,
            city: form?.city,
            state: form?.state,
            zip: form?.zip,
          },
        },
      })
      setIsSubmitting(false)
    }
    catch (error) {
      setIsSubmitting(false)
      alert(getErrorMessage(error))
    }
  }

  return (
    <>
      <Box p="6" borderBottomWidth="1px">
        <Heading fontSize="xl" fontWeight="semibold">
          Address
        </Heading>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box p="6">
          <Grid templateColumns={{ sm: 'repeat(12, 1fr)' }} gap="4">
            <GridItem colSpan={{ sm: 12 }}>
              <Field.Root invalid={!!errors.streetAddress}>
                <Field.Label>Street Address</Field.Label>
                <Input {...register('streetAddress')} type="text" />
                <Field.ErrorText>
                  {errors.streetAddress?.message}
                </Field.ErrorText>
              </Field.Root>
            </GridItem>
            <GridItem colSpan={{ sm: 12, md: 6 }}>
              <Field.Root invalid={!!errors.city}>
                <Field.Label>City</Field.Label>
                <Input {...register('city')} type="text" />
                <Field.ErrorText>{errors.city?.message}</Field.ErrorText>
              </Field.Root>
            </GridItem>
            <GridItem colSpan={{ sm: 6, md: 3 }}>
              <Field.Root invalid={!!errors.state}>
                <Field.Label>State</Field.Label>
                <Input {...register('state')} type="text" />
                <Field.ErrorText>{errors.state?.message}</Field.ErrorText>
              </Field.Root>
            </GridItem>
            <GridItem colSpan={{ sm: 6, md: 3 }}>
              <Field.Root invalid={!!errors.zip}>
                <Field.Label>Postal Code</Field.Label>
                <Input {...register('zip')} type="text" />
                <Field.ErrorText>{errors.zip?.message}</Field.ErrorText>
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
              disabled={!isDirty}
              loading={isSubmitting}
              loadingText="Saving..."
            >
              Save
            </Button>
          </ButtonGroup>
        </Flex>
      </form>
    </>
  )
}

function Contact({ restaurant }: { restaurant: RouterOutputs['restaurant']['getById'] }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { mutateAsync: handleUpdateRestaurant } = useUpdateRestaurant(restaurant?.id)

  const defaultValues = {
    phone: (Array.isArray(restaurant.phone) ? restaurant.phone : []).map(v => ({
      value: v,
    })),
    email: (Array.isArray(restaurant.email) ? restaurant.email : []).map(v => ({
      value: v,
    })),
  }

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<typeof defaultValues>({
    defaultValues,
  })
  const { isDirty } = useFormState({
    control,
  })

  const { fields: phoneFields } = useFieldArray({
    control,
    name: 'phone',
  })

  const { fields: emailFields } = useFieldArray({
    control,
    name: 'email',
  })

  const onSubmit: SubmitHandler<typeof defaultValues> = async (form) => {
    try {
      setIsSubmitting(true)
      await handleUpdateRestaurant({
        where: {
          id: restaurant.id,
        },
        payload: {
          phone: form.phone.map(v => v.value),
          email: form.email.map(v => v.value),
        },
      })
      setIsSubmitting(false)
    }
    catch (error) {
      setIsSubmitting(false)
      alert(getErrorMessage(error))
    }
  }
  return (
    <>
      <Box p="6" borderBottomWidth="1px">
        <Heading fontSize="xl" fontWeight="semibold">
          Contact
        </Heading>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box p="6">
          <Grid templateColumns={{ sm: 'repeat(12, 1fr)' }} gap="4">
            <GridItem colSpan={{ sm: 6 }}>
              <Stack>
                {phoneFields.map((field, idx) => (
                  <Field.Root key={field.id} invalid={!!errors.phone}>
                    <Field.Label>Phone Number</Field.Label>
                    <Input {...register(`phone.${idx}.value` as const)} type="text" />
                    <Field.ErrorText>{errors.phone?.message}</Field.ErrorText>
                  </Field.Root>
                ))}
              </Stack>
            </GridItem>
            <GridItem colSpan={{ sm: 6 }}>
              <Stack>
                {emailFields.map((field, idx) => (
                  <Field.Root key={field.id} invalid={!!errors.email}>
                    <Field.Label>Email</Field.Label>
                    <Input {...register(`email.${idx}.value` as const)} type="email" />
                    <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
                  </Field.Root>
                ))}
              </Stack>
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
              disabled={!isDirty}
              loading={isSubmitting}
              loadingText="Saving..."
            >
              Save
            </Button>
          </ButtonGroup>
        </Flex>
      </form>
    </>
  )
}

function Hours({ restaurant }: { restaurant: RouterOutputs['restaurant']['getById'] }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { mutateAsync: handleUpdateRestaurant } = useUpdateRestaurant(restaurant.id)

  const defaultValues = {
    standardHours: DAYS_OF_WEEK.map(day => ({
      label: day,
      isOpen: restaurant?.hours?.[day]?.isOpen || false,
      openTime: restaurant?.hours?.[day]?.openTime || '',
      closeTime: restaurant?.hours?.[day]?.closeTime || '',
    })),
  }

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
  } = useForm<typeof defaultValues>({
    defaultValues,
  })
  const { isDirty } = useFormState({
    control,
  })

  const { fields } = useFieldArray({
    control,
    name: 'standardHours',
  })

  const onSubmit: SubmitHandler<typeof defaultValues> = async (form) => {
    try {
      setIsSubmitting(true)
      const hours = form.standardHours.reduce((acc, day) => {
        return {
          ...acc,
          [day.label]: {
            isOpen: day.isOpen,
            openTime: day.openTime,
            closeTime: day.closeTime,
          },
        }
      }, {})
      await handleUpdateRestaurant({
        where: {
          id: restaurant.id,
        },
        payload: {
          hours,
        },
      })
      setIsSubmitting(false)
    }
    catch (error) {
      setIsSubmitting(false)
      alert(getErrorMessage(error))
    }
  }

  const watchField = (idx: number) => watch(`standardHours.${idx}.isOpen`)

  return (
    <>
      <Box p="6" borderBottomWidth="1px">
        <Heading fontSize="xl" fontWeight="semibold">
          Hours
        </Heading>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box p="6">
          <Heading fontSize="lg" fontWeight="semibold" mb="2">
            Standard Hours
          </Heading>
          <Stack gap={{ base: '6', lg: '4' }}>
            {fields.map((field, idx) => (
              <Grid
                key={field.id}
                as="fieldset"
                templateColumns={{ base: 'repeat(12, 1fr)' }}
                gap="4"
              >
                <GridItem
                  colSpan={{ base: 6, lg: 3 }}
                  display="flex"
                  alignItems="center"
                  h={{ lg: '10' }}
                >
                  <Text as="legend" fontWeight="medium">
                    {field.label}
                  </Text>
                </GridItem>
                <GridItem
                  colSpan={{ base: 6, lg: 3 }}
                  display="flex"
                  alignItems="center"
                  h={{ lg: '10' }}
                >
                  <Switch.Root display="flex" alignItems="center" {...register(`standardHours.${idx}.isOpen`)}>
                    <Switch.HiddenInput />
                    <Switch.Control>
                      <Switch.Thumb />
                    </Switch.Control>
                    <Switch.Label ml="2" mb="0">
                      {watchField(idx) ? 'Open' : 'Closed'}
                    </Switch.Label>
                  </Switch.Root>
                </GridItem>
                {watchField(idx) && (
                  <GridItem colSpan={{ base: 12, lg: 6 }}>
                    <HStack align="center">
                      <Field.Root>
                        <Field.Label hidden>
                          {field.label}
                          {' '}
                          Open Time
                        </Field.Label>
                        <Input
                          {...register(`standardHours.${idx}.openTime`)}
                          required
                          type="time"
                        // TODO: Add support for browsers that don't support time inputs
                        />
                      </Field.Root>
                      <Text as="span">to</Text>
                      <Field.Root>
                        <Field.Label hidden>
                          {field.label}
                          {' '}
                          Close Time
                        </Field.Label>
                        <Input
                          {...register(`standardHours.${idx}.closeTime`)}
                          // defaultValue={field.closeTime}
                          required
                          type="time"
                        // TODO: Add support for browsers that don't support time inputs
                        />
                      </Field.Root>
                    </HStack>
                  </GridItem>
                )}
              </Grid>
            ))}
          </Stack>
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
              disabled={!isDirty}
              loading={isSubmitting}
              loadingText="Saving..."
            >
              Save
            </Button>
          </ButtonGroup>
        </Flex>
      </form>
    </>
  )
}

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
