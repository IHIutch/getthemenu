import React, { useEffect, useState } from 'react'
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
  Select,
  Text,
  VStack,
  ButtonGroup,
  Button,
} from '@chakra-ui/react'
import SubnavItem from '@/components/common/SubnavItem'
import { useGetRestaurant } from '@/utils/react-query/restaurants'
import { useAuthUser } from '@/utils/react-query/user'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

export default function Restaurant() {
  return (
    <>
      <Head>
        <title>GetTheMenu</title>
      </Head>
      <Navbar>
        <HStack spacing="6">
          <SubnavItem href="/dashboard">Dashboard</SubnavItem>
          <SubnavItem href="/restaurant">Restaurant</SubnavItem>
          <SubnavItem href="/menus">Menus</SubnavItem>
        </HStack>
      </Navbar>
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

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    setValue('restaurantName', restaurant?.name || '')
    setValue('subdomain', restaurant?.subdomain || '')
  }, [restaurant, setValue])

  const onSubmit = async (form) => {
    try {
      const [name, subdomain] = getValues(['restaurantName', 'subdomain'])
      setIsSubmitting(true)
      console.log({ name, subdomain })
      // await postRestaurant({
      //   userId: user.id,
      //   name,
      //   subdomain,
      // })
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
                  <InputRightAddon children=".getthemenu.io" />
                </InputGroup>
              </FormControl>
            </GridItem>
          </Grid>
        </Box>
        <Flex px="6" py="3" borderTopWidth="1px">
          <ButtonGroup ml="auto">
            {/* <Button>Reset</Button> */}
            <Button colorScheme="blue" type="submit">
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

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    const address = restaurant?.address || {}
    setValue('streetAddress', address?.streetAddress || '')
    setValue('city', address?.city || '')
    setValue('state', address?.state || '')
    setValue('zip', address?.zip || '')
  }, [restaurant, setValue])

  const onSubmit = async (form) => {
    try {
      const [streetAddress, city, state, zip] = getValues([
        'streetAddress',
        'city',
        'state',
        'zip',
      ])
      setIsSubmitting(true)
      console.log({ streetAddress, city, state, zip })
      // await postRestaurant({
      //   userId: user.id,
      //   name,
      //   subdomain,
      // })
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
            <GridItem colSpan={{ md: '12' }}>
              <FormControl>
                <FormLabel>Street Address</FormLabel>
                <Input {...register('streetAddress')} type="text" />
              </FormControl>
            </GridItem>
            <GridItem colSpan={{ md: '6' }}>
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
            <Button colorScheme="blue" type="submit">
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

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    setValue('phone', restaurant?.phone ? restaurant.phone[0] : '')
    setValue('email', restaurant?.email ? restaurant.email[0] : '')
  }, [restaurant, setValue])

  const onSubmit = async (form) => {
    try {
      const [phone, email] = getValues(['phone', 'email'])
      setIsSubmitting(true)
      console.log({ phone, email })
      // await postRestaurant({
      //   userId: user.id,
      //   name,
      //   subdomain,
      // })
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
            <GridItem colSpan={{ md: '6' }}>
              <VStack>
                <FormControl>
                  <FormLabel>Phone Number</FormLabel>
                  <Input {...register('phone')} type="text" />
                </FormControl>
              </VStack>
            </GridItem>
            <GridItem colSpan={{ md: '6' }}>
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
            <Button colorScheme="blue" type="submit">
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

  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  const standardHours = daysOfWeek.reduce((acc, day) => {
    return {
      ...acc,
      [day]: {
        isOpen: restaurant?.hours ? restaurant.hours[day].isOpen : false,
        openTime: restaurant?.hours ? restaurant.hours[day].openTime : '',
        closeTime: restaurant?.hours ? restaurant.hours[day].closeTime : '',
      },
    }
  }, {})

  const defaultValues = {
    standardHours: Object.keys(standardHours).map((k) => ({
      ...standardHours[k],
      label: k,
    })),
  }

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
  })

  const { fields } = useFieldArray({
    control,
    name: 'standardHours',
    // keyName: "id", default to "id", you can change the key name
  })

  const onSubmit = async (form) => {
    try {
      const [standardHours] = getValues(['standardHours'])
      setIsSubmitting(true)
      console.log({ standardHours })
      // await postRestaurant({
      //   userId: user.id,
      //   name,
      //   subdomain,
      // })
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
                    <Switch {...register(`standardHours.${idx}.isOpen`)} />
                    <FormLabel ml="2" mb="0">
                      {watchField(idx) ? 'Open' : 'Closed'}
                    </FormLabel>
                  </FormControl>
                </GridItem>
                <GridItem
                  colSpan={{ base: '12', lg: '6' }}
                  d={watchField(idx) ? 'block' : 'none'}
                >
                  <HStack align="center">
                    <FormControl>
                      <FormLabel hidden>{field.label} Open Time</FormLabel>
                      <Input
                        {...register(`standardHours.${idx}.openTime`)}
                        type="time"
                      />
                    </FormControl>
                    <Text as="span">to</Text>
                    <FormControl>
                      <FormLabel hidden>{field.label} Close Time</FormLabel>
                      <Input
                        {...register(`standardHours.${idx}.closeTime`)}
                        type="time"
                      />
                    </FormControl>
                  </HStack>
                </GridItem>
              </Grid>
            ))}
          </VStack>
        </Box>
        <Flex px="6" py="3" borderTopWidth="1px">
          <ButtonGroup ml="auto">
            {/* <Button>Reset</Button> */}
            <Button colorScheme="blue" type="submit">
              Save
            </Button>
          </ButtonGroup>
        </Flex>
      </form>
    </>
  )
}
