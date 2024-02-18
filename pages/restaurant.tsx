import React, { useEffect, useMemo, useState } from 'react'
import {
  Grid,
  GridItem,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Box,
  Heading,
  InputGroup,
  InputRightAddon,
  Switch,
  Flex,
  Text,
  ButtonGroup,
  Button,
  Container,
  AspectRatio,
  Stack,
  FormErrorMessage,
} from '@chakra-ui/react'
import Head from 'next/head'
import {
  useGetRestaurant,
  useUpdateRestaurant,
} from '@/utils/react-query/restaurants'
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormState,
} from 'react-hook-form'
import DashboardLayout from '@/layouts/Dashboard'
import ImageDropzone from '@/components/common/ImageDropzone'
import { postUpload } from '@/utils/axios/uploads'
import { useGetAuthedUser } from '@/utils/react-query/users'
import { DAYS_OF_WEEK } from '@/utils/zod'
import { RouterOutputs, appRouter } from '@/server'
import { getErrorMessage } from '@/utils/functions'
import { createClientServer } from '@/utils/supabase/server-props'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { createServerSideHelpers } from '@trpc/react-query/server'
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
        <Stack spacing="6">
          <Box bg="white" rounded="md" shadow="base">
            {restaurant ?
              <Details restaurant={restaurant} />
              : null}
          </Box>
          <Box bg="white" rounded="md" shadow="base">
            {restaurant ?
              <Contact restaurant={restaurant} />
              : null}
          </Box>
          <Box bg="white" rounded="md" shadow="base">
            {restaurant ?
              <Address restaurant={restaurant} />
              : null}
          </Box>
          <Box bg="white" rounded="md" shadow="base">
            {restaurant ?
              <Hours restaurant={restaurant} />
              : null}
          </Box>
        </Stack>
      </Container>
    </>
  )
}

Restaurant.getLayout = (page: React.ReactNode) => <DashboardLayout>{page}</DashboardLayout>

const Details = ({ restaurant }: { restaurant: RouterOutputs['restaurant']['getById'] }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { mutateAsync: handleUpdateRestaurant } = useUpdateRestaurant(restaurant?.id)

  const defaultValues: {
    name: string | null,
    customHost: string | null,
    coverImage: {
      src?: string,
      file?: File | null
    }
  } = {
    name: restaurant?.name,
    customHost: restaurant?.customHost,
    coverImage: {
      src: restaurant.coverImage.src
    },
  }

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, dirtyFields },
  } = useForm<typeof defaultValues>({ defaultValues })
  const { isDirty } = useFormState({
    control,
  })

  const onSubmit: SubmitHandler<typeof defaultValues> = async (form) => {
    try {
      setIsSubmitting(true)
      const payload = {
        name: form.name,
        customHost: form.customHost,
        coverImage: {
          src: form.coverImage.src || ''
        }
      }

      if (form?.coverImage && form.coverImage.file) {
        const formData = new FormData()
        formData.append('file', form.coverImage.file, form.coverImage.file.name)
        payload.coverImage.src = await postUpload(formData)
      }
      await handleUpdateRestaurant({
        where: {
          id: restaurant.id,
        },
        payload,
      })
      setIsSubmitting(false)
    } catch (error) {
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
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Name</FormLabel>
                <Input
                  {...register('name', {
                    required: 'This field is required',
                  })}
                  type="text"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={!!errors.customHost}>
                <FormLabel>Unique URL</FormLabel>
                <InputGroup>
                  <Input
                    {...register('customHost', {
                      required: 'This field is required',
                    })}
                    type="text"
                    autoComplete="off"
                  />
                  <InputRightAddon>.getthemenu.io</InputRightAddon>
                </InputGroup>
                <FormErrorMessage>
                  {errors.customHost?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl id="coverImage" isInvalid={!!errors.coverImage}>
                <FormLabel>Cover Image</FormLabel>
                <AspectRatio ratio={16 / 9} display="block">
                  <Controller
                    name="coverImage"
                    control={control}
                    render={({ field: { onChange, value } }) => {
                      return <ImageDropzone onChange={onChange} value={value.src || ''} />
                    }}
                  />
                </AspectRatio>
                <FormErrorMessage>
                  {errors.coverImage?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>
        </Box>
        <Flex px="6" py="3" borderTopWidth="1px">
          <ButtonGroup ml="auto">
            <Button
              onClick={() => {
                reset(defaultValues)
              }}
              isDisabled={!isDirty}
            >
              Reset
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isDisabled={!isDirty}
              isLoading={isSubmitting}
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

const Address = ({ restaurant }: { restaurant: RouterOutputs['restaurant']['getById'] }) => {
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
    } catch (error) {
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
              <FormControl isInvalid={!!errors.streetAddress}>
                <FormLabel>Street Address</FormLabel>
                <Input {...register('streetAddress')} type="text" />
                <FormErrorMessage>
                  {errors.streetAddress?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={{ sm: 12, md: 6 }}>
              <FormControl isInvalid={!!errors.city}>
                <FormLabel>City</FormLabel>
                <Input {...register('city')} type="text" />
                <FormErrorMessage>{errors.city?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={{ sm: 6, md: 3 }}>
              <FormControl isInvalid={!!errors.state}>
                <FormLabel>State</FormLabel>
                <Input {...register('state')} type="text" />
                <FormErrorMessage>{errors.state?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={{ sm: 6, md: 3 }}>
              <FormControl isInvalid={!!errors.zip}>
                <FormLabel>Postal Code</FormLabel>
                <Input {...register('zip')} type="text" />
                <FormErrorMessage>{errors.zip?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>
        </Box>
        <Flex px="6" py="3" borderTopWidth="1px">
          <ButtonGroup ml="auto">
            <Button
              onClick={() => {
                reset(defaultValues)
              }}
              isDisabled={!isDirty}
            >
              Reset
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isDisabled={!isDirty}
              isLoading={isSubmitting}
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

const Contact = ({ restaurant }: { restaurant: RouterOutputs['restaurant']['getById'] }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { mutateAsync: handleUpdateRestaurant } = useUpdateRestaurant(restaurant?.id)

  const defaultValues = {
    phone: restaurant.phone.map(v => ({
      value: v
    })),
    email: restaurant.email.map(v => ({
      value: v
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
  });

  const { fields: emailFields } = useFieldArray({
    control,
    name: "email",
  });

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
    } catch (error) {
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
                  <FormControl key={field.id} isInvalid={!!errors.phone}>
                    <FormLabel>Phone Number</FormLabel>
                    <Input {...register(`phone.${idx}.value` as const)} type="text" />
                    <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
                  </FormControl>
                ))}
              </Stack>
            </GridItem>
            <GridItem colSpan={{ sm: 6 }}>
              <Stack>
                {emailFields.map((field, idx) => (
                  <FormControl key={field.id} isInvalid={!!errors.email}>
                    <FormLabel>Email</FormLabel>
                    <Input {...register(`email.${idx}.value` as const)} type="email" />
                    <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                  </FormControl>
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
              isDisabled={!isDirty}
            >
              Reset
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isDisabled={!isDirty}
              isLoading={isSubmitting}
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

const Hours = ({ restaurant }: { restaurant: RouterOutputs['restaurant']['getById'] }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { mutateAsync: handleUpdateRestaurant } = useUpdateRestaurant(restaurant.id)

  const defaultValues = {
    standardHours: DAYS_OF_WEEK.map(day => ({
      label: day,
      isOpen: restaurant?.hours?.[day]?.isOpen || false,
      openTime: restaurant?.hours?.[day]?.openTime || '',
      closeTime: restaurant?.hours?.[day]?.closeTime || '',
    }))
  }

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
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
    } catch (error) {
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
          <Stack spacing={{ base: '6', lg: '4' }}>
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
                  <FormControl display="flex" alignItems="center">
                    <Switch {...register(`standardHours.${idx}.isOpen`)} />
                    <FormLabel ml="2" mb="0">
                      {watchField(idx) ? 'Open' : 'Closed'}
                    </FormLabel>
                  </FormControl>
                </GridItem>
                {watchField(idx) && (
                  <GridItem colSpan={{ base: 12, lg: 6 }}>
                    <HStack align="center">
                      <FormControl>
                        <FormLabel hidden>{field.label} Open Time</FormLabel>
                        <Input
                          {...register(`standardHours.${idx}.openTime`)}
                          isRequired
                          type="time"
                        // TODO: Add support for browsers that don't support time inputs
                        />
                      </FormControl>
                      <Text as="span">to</Text>
                      <FormControl>
                        <FormLabel hidden>{field.label} Close Time</FormLabel>
                        <Input
                          {...register(`standardHours.${idx}.closeTime`)}
                          // defaultValue={field.closeTime}
                          isRequired
                          type="time"
                        // TODO: Add support for browsers that don't support time inputs
                        />
                      </FormControl>
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
              isDisabled={!isDirty}
            >
              Reset
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isDisabled={!isDirty}
              isLoading={isSubmitting}
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
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      supabase
    },
    transformer: SuperJSON,
  });

  const user = await helpers.user.getAuthedUser.fetch()

  if (user.restaurants.length === 0) {
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