import React, { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import Container from '@/components/common/Container'
import Navbar from '@/components/common/Navbar'
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
  VStack,
  ButtonGroup,
  Button,
} from '@chakra-ui/react'
import SubnavItem from '@/components/common/SubnavItem'
import {
  useGetRestaurant,
  useUpdateRestaurant,
} from '@/utils/react-query/restaurants'
import { useAuthUser } from '@/utils/react-query/user'
import { useFieldArray, useForm, useFormState } from 'react-hook-form'
import DefaultLayout from '@/layouts/Default'

export default function Restaurant() {
  return (
    <>
      <Head>
        <title>GetTheMenu</title>
      </Head>

      <DefaultLayout>
        <Container py="8">
          <Grid templateColumns={{ md: 'repeat(12, 1fr)' }} gap="6">
            <GridItem
              colStart={{ md: '2', xl: '3' }}
              colSpan={{ md: '10', xl: '8' }}
            >
              <Box bg="white" rounded="md" shadow="base">
                <Details />
              </Box>
            </GridItem>
            <GridItem
              colStart={{ md: '2', xl: '3' }}
              colSpan={{ md: '10', xl: '8' }}
            >
              <Box bg="white" rounded="md" shadow="base">
                <Contact />
              </Box>
            </GridItem>
            <GridItem
              colStart={{ md: '2', xl: '3' }}
              colSpan={{ md: '10', xl: '8' }}
            >
              <Box bg="white" rounded="md" shadow="base">
                <Address />
              </Box>
            </GridItem>
            <GridItem
              colStart={{ md: '2', xl: '3' }}
              colSpan={{ md: '10', xl: '8' }}
            >
              <Box bg="white" rounded="md" shadow="base">
                <Hours />
              </Box>
            </GridItem>
          </Grid>
        </Container>
      </DefaultLayout>
    </>
  )
}

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
      restaurantName: restaurant?.name || '',
      subdomain: restaurant?.subdomain || '',
    }
  }, [restaurant])

  const {
    register,
    handleSubmit,
    getValues,
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

  const onSubmit = async () => {
    try {
      const [name, subdomain] = getValues(['restaurantName', 'subdomain'])
      setIsSubmitting(true)
      await handleUpdateRestaurant({
        id: user.restaurants[0].id,
        payload: {
          name,
          subdomain,
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
          Details
        </Heading>
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box p="6">
          <Grid w="100%" gap="4">
            <GridItem>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  {...register('restaurantName', {
                    required: 'This field is required',
                  })}
                  type="text"
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel>Unique Slug</FormLabel>
                <InputGroup>
                  <Input
                    {...register('subdomain', {
                      required: 'This field is required',
                    })}
                    type="text"
                    autoComplete="off"
                  />
                  <InputRightAddon>.getthemenu.io</InputRightAddon>
                </InputGroup>
              </FormControl>
            </GridItem>
          </Grid>
        </Box>
        <Flex px="6" py="3" borderTopWidth="1px">
          <ButtonGroup ml="auto">
            {/* <Button>Reset</Button> */}
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
    restaurant?.id || null
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
    getValues,
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

  const onSubmit = async () => {
    try {
      const [streetAddress, city, state, zip] = getValues([
        'streetAddress',
        'city',
        'state',
        'zip',
      ])
      setIsSubmitting(true)
      await handleUpdateRestaurant({
        id: 123,
        payload: {
          address: {
            streetAddress,
            city,
            state,
            zip,
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
              <FormControl>
                <FormLabel>Street Address</FormLabel>
                <Input {...register('streetAddress')} type="text" />
              </FormControl>
            </GridItem>
            <GridItem colSpan={{ sm: '12', md: '6' }}>
              <FormControl>
                <FormLabel>City</FormLabel>
                <Input {...register('city')} type="text" />
              </FormControl>
            </GridItem>
            <GridItem colSpan={{ sm: '6', md: '3' }}>
              <FormControl>
                <FormLabel>State</FormLabel>
                <Input {...register('state')} type="text" />
              </FormControl>
            </GridItem>
            <GridItem colSpan={{ sm: '6', md: '3' }}>
              <FormControl>
                <FormLabel>Postal Code</FormLabel>
                <Input {...register('zip')} type="text" />
              </FormControl>
            </GridItem>
          </Grid>
        </Box>
        <Flex px="6" py="3" borderTopWidth="1px">
          <ButtonGroup ml="auto">
            {/* <Button>Reset</Button> */}
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
      phone: restaurant?.phone[0] || '',
      email: restaurant?.email[0] || '',
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
          phone: [phone],
          email: [email],
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
              <VStack>
                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <Input {...register('phone')} type="text" />
                </FormControl>
              </VStack>
            </GridItem>
            <GridItem colSpan={{ sm: '6' }}>
              <VStack>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input {...register('email')} type="email" />
                </FormControl>
              </VStack>
            </GridItem>
          </Grid>
        </Box>
        <Flex px="6" py="3" borderTopWidth="1px">
          <ButtonGroup ml="auto">
            {/* <Button>Reset</Button> */}
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
          isOpen: restaurant?.hours[day]?.isOpen || false,
          openTime: restaurant?.hours[day]?.openTime || '',
          closeTime: restaurant?.hours[day]?.closeTime || '',
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
          <VStack spacing={{ base: '6', lg: '4' }}>
            {fields.map((field, idx) => (
              <Grid
                key={field.id}
                as="fieldset"
                w="100%"
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
                    <Switch
                      {...register(`standardHours.${idx}.isOpen`)}
                      // defaultValue={field.isOpen}
                    />
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
                          // defaultValue={field.openTime}
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
          </VStack>
        </Box>
        <Flex px="6" py="3" borderTopWidth="1px">
          <ButtonGroup ml="auto">
            {/* <Button>Reset</Button> */}
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
