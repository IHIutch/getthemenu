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
import { useAuthUser } from '@/utils/react-query/user'
import {
  Controller,
  useFieldArray,
  useForm,
  useFormState,
} from 'react-hook-form'
import DashboardLayout from '@/layouts/Dashboard'
import ImageDropzone from '@/components/common/ImageDropzone'
import { postUpload } from '@/utils/axios/uploads'

export default function Restaurant() {
  return (
    <>
      <Head>
        <title>GetTheMenu</title>
      </Head>

      <Container maxW="container.md">
        <Stack spacing="6">
          <Box bg="white" rounded="md" shadow="base">
            <Details />
          </Box>
          <Box bg="white" rounded="md" shadow="base">
            <Contact />
          </Box>
          <Box bg="white" rounded="md" shadow="base">
            <Address />
          </Box>
          <Box bg="white" rounded="md" shadow="base">
            <Hours />
          </Box>
        </Stack>
      </Container>
    </>
  )
}

Restaurant.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>

const Details = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    data: user,
    // isLoading: isUserLoading,
    // isError: isUserError,
  } = useAuthUser()

  const { data: restaurant } = useGetRestaurant(
    user?.restaurants?.length ? user.restaurants[0].id : null
  )

  const { mutate: handleUpdateRestaurant } = useUpdateRestaurant(
    restaurant?.id || null
  )

  const defaultValues = useMemo(() => {
    return {
      name: restaurant?.name || '',
      customHost: restaurant?.customHost || '',
      coverImage: restaurant?.coverImage?.src || null,
    }
  }, [restaurant])

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, dirtyFields },
  } = useForm({
    defaultValues,
  })
  const { isDirty } = useFormState({
    control,
  })

  useEffect(() => {
    // Handles resetting the form to the default values after they're loaded in with React Query. Could probably also be handles showing an initial skeleton and swapping when the data is loaded.
    reset(defaultValues)
  }, [defaultValues, reset, restaurant])

  const onSubmit = async (form) => {
    try {
      setIsSubmitting(true)
      const payload = {
        name: form?.name || '',
        customHost: form?.customHost || '',
      }
      if (form?.coverImage && dirtyFields?.coverImage) {
        const formData = new FormData()
        formData.append('file', form.coverImage, form.coverImage.name)

        payload.coverImage = await postUpload(formData)
      } else if (form?.coverImage === null && dirtyFields?.coverImage) {
        payload.coverImage = null
      }
      await handleUpdateRestaurant({
        id: user.restaurants[0].id,
        payload,
      })
      setIsSubmitting(false)
    } catch (error) {
      setIsSubmitting(false)
      alert(error.message)
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
              <FormControl isInvalid={errors.name}>
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
              <FormControl isInvalid={errors.customHost}>
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
              <FormControl id="coverImage" isInvalid={errors.coverImage}>
                <FormLabel>Cover Image</FormLabel>
                <AspectRatio ratio={16 / 9} d="block">
                  <Controller
                    name="coverImage"
                    control={control}
                    render={({ field }) => {
                      return <ImageDropzone {...field} />
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

const Address = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    data: user,
    // isLoading: isUserLoading,
    // isError: isUserError,
  } = useAuthUser()

  const { data: restaurant } = useGetRestaurant(
    user?.restaurants?.length ? user.restaurants[0].id : null
  )

  const { mutate: handleUpdateRestaurant } = useUpdateRestaurant(
    user?.restaurants?.length ? user.restaurants[0].id : null
  )

  const defaultValues = useMemo(() => {
    return {
      streetAddress: restaurant?.address?.streetAddress || '',
      city: restaurant?.address?.city || '',
      state: restaurant?.address?.state || '',
      zip: restaurant?.address?.zip || '',
    }
  }, [restaurant])

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues,
  })
  const { isDirty } = useFormState({
    control,
  })

  useEffect(() => {
    // Handles resetting the form to the default values after they're loaded in with React Query. Could probably also be handles showing an initial skeleton and swapping when the data is loaded.
    reset(defaultValues)
  }, [defaultValues, reset, restaurant])

  const onSubmit = async (form) => {
    try {
      setIsSubmitting(true)
      await handleUpdateRestaurant({
        id: user.restaurants[0].id,
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
      alert(error.message)
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
            <GridItem colSpan={{ sm: '12' }}>
              <FormControl isInvalid={errors.streetAddress}>
                <FormLabel>Street Address</FormLabel>
                <Input {...register('streetAddress')} type="text" />
                <FormErrorMessage>
                  {errors.streetAddress?.message}
                </FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={{ sm: '12', md: '6' }}>
              <FormControl isInvalid={errors.city}>
                <FormLabel>City</FormLabel>
                <Input {...register('city')} type="text" />
                <FormErrorMessage>{errors.city?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={{ sm: '6', md: '3' }}>
              <FormControl isInvalid={errors.state}>
                <FormLabel>State</FormLabel>
                <Input {...register('state')} type="text" />
                <FormErrorMessage>{errors.state?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={{ sm: '6', md: '3' }}>
              <FormControl isInvalid={errors.zip}>
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

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    data: user,
    // isLoading: isUserLoading,
    // isError: isUserError,
  } = useAuthUser()

  const { data: restaurant } = useGetRestaurant(
    user?.restaurants?.length ? user.restaurants[0].id : null
  )

  const { mutate: handleUpdateRestaurant } = useUpdateRestaurant(
    restaurant?.id || null
  )

  const defaultValues = useMemo(() => {
    return {
      phone: restaurant?.phone?.[0] || '',
      email: restaurant?.email?.[0] || '',
    }
  }, [restaurant])

  const {
    register,
    handleSubmit,
    getValues,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  })
  const { isDirty } = useFormState({
    control,
  })

  useEffect(() => {
    // Handles resetting the form to the default values after they're loaded in with React Query. Could probably also be handles showing an initial skeleton and swapping when the data is loaded.
    reset(defaultValues)
  }, [defaultValues, reset, restaurant])

  const onSubmit = async () => {
    try {
      const [phone, email] = getValues(['phone', 'email'])
      setIsSubmitting(true)
      await handleUpdateRestaurant({
        id: user.restaurants[0].id,
        payload: {
          phone: phone ? [phone] : [],
          email: email ? [email] : [],
        },
      })
      setIsSubmitting(false)
    } catch (error) {
      setIsSubmitting(false)
      alert(error.message)
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
            <GridItem colSpan={{ sm: '6' }}>
              <FormControl isInvalid={errors.phone}>
                <FormLabel>Phone Number</FormLabel>
                <Input {...register('phone')} type="text" />
                <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem colSpan={{ sm: '6' }}>
              <FormControl isInvalid={errors.email}>
                <FormLabel>Email</FormLabel>
                <Input {...register('email')} type="email" />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
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

const Hours = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    data: user,
    // isLoading: isUserLoading,
    // isError: isUserError,
  } = useAuthUser()

  const { data: restaurant } = useGetRestaurant(
    user?.restaurants?.length ? user.restaurants[0].id : null
  )

  const { mutate: handleUpdateRestaurant } = useUpdateRestaurant(
    restaurant?.id || null
  )

  const defaultValues = useMemo(() => {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]
    return {
      standardHours: daysOfWeek.map((day) => {
        return {
          label: day,
          isOpen: restaurant?.hours?.[day]?.isOpen || false,
          openTime: restaurant?.hours?.[day]?.openTime || '',
          closeTime: restaurant?.hours?.[day]?.closeTime || '',
        }
      }),
    }
  }, [restaurant])

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
  })
  const { isDirty } = useFormState({
    control,
  })

  const { fields } = useFieldArray({
    control,
    name: 'standardHours',
  })

  useEffect(() => {
    // Handles resetting the form to the default values after they're loaded in with React Query. Could probably also be handles showing an initial skeleton and swapping when the data is loaded.
    reset(defaultValues)
  }, [defaultValues, reset, restaurant])

  const onSubmit = async () => {
    try {
      const [standardHours] = getValues(['standardHours'])
      setIsSubmitting(true)
      const hours = standardHours.reduce((acc, day) => {
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
        id: user.restaurants[0].id,
        payload: {
          hours,
        },
      })
      setIsSubmitting(false)
    } catch (error) {
      setIsSubmitting(false)
      alert(error.message)
    }
  }

  const watchField = (idx) => watch(`standardHours.${idx}.isOpen`)

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
                  colSpan={{ base: '6', lg: '3' }}
                  d="flex"
                  alignItems="center"
                  h={{ lg: '10' }}
                >
                  <Text as="legend" fontWeight="medium">
                    {field.label}
                  </Text>
                </GridItem>
                <GridItem
                  colSpan={{ base: '6', lg: '3' }}
                  d="flex"
                  alignItems="center"
                  h={{ lg: '10' }}
                >
                  <FormControl d="flex" alignItems="center">
                    <Switch {...register(`standardHours.${idx}.isOpen`)} />
                    <FormLabel ml="2" mb="0">
                      {watchField(idx) ? 'Open' : 'Closed'}
                    </FormLabel>
                  </FormControl>
                </GridItem>
                {watchField(idx) && (
                  <GridItem colSpan={{ base: '12', lg: '6' }}>
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
